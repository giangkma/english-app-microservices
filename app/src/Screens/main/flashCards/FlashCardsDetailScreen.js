// @format
import { accountApi, flashcardApi } from 'apis';
import {
    ArrowLeft,
    ArrowRight,
    Heart,
    HeartActive,
    Option,
    Pause,
    Speaker,
    Play,
} from 'assets';
import { LoadingScreen, Modal, StackLayout } from 'components';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Carousel from 'react-native-snap-carousel';
import { Image, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { getFlashCardsSettings, learnedWord } from 'store/flashCards';
import { scaleSize, screenSize, showAlert } from 'utilities';
import { FlashCardSettings } from '../components';
import { Config } from 'config';
import Tts from 'react-native-tts';
import { useAuth } from 'hooks';
import { addWordToFavoriteList } from 'store/auth';
import { useFocusEffect } from '@react-navigation/native';

const compareTime = (createdAt, hours) => {
    const createdAtTime = new Date(createdAt);
    const currentTimeTime = new Date();
    const diff = currentTimeTime - createdAtTime;
    const diffMinutes = Math.floor(diff / 1000 / 60 / 60);
    return diffMinutes >= hours;
};

const compareTimeTest = (createdAt, seconds) => {
    const createdAtTime = new Date(createdAt);
    const currentTimeTime = new Date();
    const diff = currentTimeTime - createdAtTime;
    const diffMinutes = Math.floor(diff / 1000);
    return diffMinutes >= seconds;
};

export const FlashCardsDetailScreen = ({ route, navigation }) => {
    const carousel = useRef(null);
    const { topic } = route.params;
    const { topicId, total, name, wordIdsLearned } = topic;
    const isDone = total === wordIdsLearned.length;
    const learned = wordIdsLearned.length;

    const settings = useSelector(getFlashCardsSettings);
    const { cardSpeed } = settings;

    const [wordsReviewedIds, setWordsReviewedIds] = useState([]);
    const [modalMessage, setModalMessage] = useState();
    const [isActiveSlideCards, setIsActiveSlideCards] = useState(false);
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openSettingModal, setOpenSettingModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user } = useAuth();

    const isReviewing = wordsReviewedIds.length > 0;
    const isLastCard = currentIndex === data.length - 1;

    const getUnLearnedWords = async () => {
        try {
            setLoading(true);
            const unLearnedWords = await flashcardApi.getUnLearnedWords(
                topicId,
            );
            setData(unLearnedWords);
            setCurrentIndex(0);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onCancelReviewWords = async () => {
        try {
            setLoading(true);
            setModalMessage();
            await getUnLearnedWords();
            await flashcardApi.cancelReviewWords(topicId);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onAcceptReviewWords = async () => {
        try {
            setLoading(true);
            setModalMessage();
            setCurrentIndex(0);
            const wordsReview = await flashcardApi.getWordsLearnedToReview(
                topicId,
            );
            setData(wordsReview);
            addWordToReviewed(wordsReview[0]);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const showRemindModalIfNeeded = prevReviewWasUnFinished => {
        if (prevReviewWasUnFinished) {
            const { total, reviewed } = prevReviewWasUnFinished;
            const timer = setTimeout(() => {
                setModalMessage({
                    text: '🗣️ Remind You',
                    description: `In the previous review, you only learned ${reviewed}/${total} words, please work harder!`,
                    buttons: [
                        {
                            text: 'Ok',
                            onPress: () => setModalMessage(),
                        },
                    ],
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    };

    const onClickEndOfReview = async () => {
        if (wordsReviewedIds.length < Config.NUM_WORDS_PREVIEW) {
            openModalExitReview();
        } else {
            openModalCompletedReview();
        }
    };

    const onEndOfReview = async () => {
        try {
            setLoading(true);
            setModalMessage();
            await onPostReviewWordsLog();
            setWordsReviewedIds([]);
            setCurrentIndex(0);
            await getUnLearnedWords();
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onPostReviewWordsLog = () => {
        if (wordsReviewedIds.length === 0) return;
        return flashcardApi.postReviewWords(topicId, {
            reviewed: wordsReviewedIds.length,
            learned,
        });
    };

    const openModalReviewWords = prevReviewWasUnFinished => {
        setModalMessage({
            text: '📝 Review vocabulary',
            description:
                'Do you want to review some of the vocabulary you have learned?',
            buttons: [
                {
                    text: 'Yes',
                    onPress: () => {
                        onAcceptReviewWords();
                        showRemindModalIfNeeded(prevReviewWasUnFinished);
                    },
                },
                {
                    text: 'No',
                    onPress: onCancelReviewWords,
                },
            ],
        });
    };

    const openModalCompletedReview = () => {
        setModalMessage({
            text: '💯 Compeleted the Review',
            description: 'Press "Ok" to continue the topic !',
            buttons: [
                {
                    text: 'Ok',
                    onPress: onEndOfReview,
                },
                {
                    text: 'Cancel',
                    onPress: () => setModalMessage(),
                },
            ],
        });
    };

    const openModalExitReview = () => {
        setModalMessage({
            text: '🔈 End of Review',
            description:
                "You haven't reviewed all the vocabulary, are you sure you want to quit!",
            buttons: [
                {
                    text: 'Yes',
                    onPress: onEndOfReview,
                },
                {
                    text: 'No',
                    onPress: () => setModalMessage(),
                },
            ],
        });
    };

    const checkLogAndShowReviewModal = async () => {
        try {
            if (isDone) return;
            setLoading(true);
            const mostRecentLog =
                await flashcardApi.getMostRecentFlashCardsReviewLog(topicId);
            const { status, createdAt } = mostRecentLog;
            if (
                mostRecentLog &&
                mostRecentLog.error &&
                learned >= 2 * Config.NUM_WORDS_PREVIEW
            ) {
                openModalReviewWords();
                return true;
            }
            if (
                status === Config.REVIEW_STATUS_LOGS.CANCELLED &&
                compareTimeTest(createdAt, 10)
                // compareTime(createdAt, 4)
            ) {
                openModalReviewWords();
                return true;
            }
            if (
                status === Config.REVIEW_STATUS_LOGS.UN_FINISHED &&
                compareTimeTest(createdAt, 15)
                // compareTime(createdAt, 24)
            ) {
                const { total, reviewed } = mostRecentLog;
                if (
                    learned >=
                    Config.NUM_WORDS_PREVIEW + mostRecentLog.learned
                ) {
                    openModalReviewWords({ total, reviewed });
                    return true;
                }
            }
            if (
                status === Config.REVIEW_STATUS_LOGS.FINISHED &&
                compareTimeTest(createdAt, 20)
                // compareTime(createdAt, 48)
            ) {
                if (
                    learned >=
                    2 * Config.NUM_WORDS_PREVIEW + mostRecentLog.learned
                ) {
                    openModalReviewWords();
                    return true;
                }
            }
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onClickPrevCard = () => {
        carousel.current.snapToPrev();
    };

    const startAutoplayCards = () => {
        carousel.current.startAutoplay();
        setIsActiveSlideCards(true);
    };

    const stopAutoplayCards = () => {
        carousel.current.stopAutoplay();
        setIsActiveSlideCards(false);
    };

    const onToggleSlideCards = () => {
        if (!isActiveSlideCards && !isLastCard) {
            startAutoplayCards();
        } else {
            stopAutoplayCards();
        }
    };

    const onClickNextCard = () => {
        carousel.current.snapToNext();
        checkLastCardOfTopic();
    };

    const addWordToReviewed = word => {
        if (!wordsReviewedIds.includes(word._id)) {
            setWordsReviewedIds(prev => [...prev, word._id]);
        }
    };

    const onLearnedWord = () => {
        if (!isDone || !isReviewing) {
            dispatch(
                learnedWord({
                    topicId,
                    wordId: data[currentIndex]._id,
                }),
            );
        }
        flashcardApi.learnWord({
            topicId,
            wordId: data[currentIndex]._id,
        });
    };

    const checkLastCardOfTopic = () => {
        if (isLastCard) {
            if (wordsReviewedIds.length === Config.NUM_WORDS_PREVIEW) {
                openModalCompletedReview();
                return;
            }
            if (isActiveSlideCards) {
                setIsActiveSlideCards(false);
                carousel.current.stopAutoplay();
            }
            if (!isDone) {
                setModalMessage({
                    text: '👏 Amazing!',
                    description: `You have learned all the vocabulary in our topic ${name}! You can review the entire this topic.`,
                    buttons: [
                        {
                            text: 'Ok',
                            onPress: () => {
                                setModalMessage();
                                getUnLearnedWords();
                            },
                        },
                    ],
                });
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            setData([]);
            (async () => {
                const isShowReviewModal = await checkLogAndShowReviewModal();
                if (!isShowReviewModal) {
                    getUnLearnedWords();
                }
            })();
        }, [topic]),
    );

    useEffect(() => {
        if (data && data[currentIndex]) {
            onLearnedWord();
            if (isReviewing) {
                addWordToReviewed(data[currentIndex]);
            }
            if (isActiveSlideCards && isLastCard) {
                stopAutoplayCards();
            }
        }
    }, [currentIndex, data]);

    useEffect(
        () =>
            navigation.addListener('beforeRemove', e => {
                if (!isReviewing) {
                    // If we don't in reviewing, then we don't need to do anything
                    return;
                }
                // Prevent default behavior of leaving the screen
                e.preventDefault();
                // Prompt the user before leaving the screen
                setModalMessage({
                    text: '⚠️ Exit of Review',
                    description:
                        'You are in review mode, are you sure you want to exit?',
                    buttons: [
                        {
                            text: 'Yes',
                            onPress: () => {
                                onEndOfReview();
                                navigation.dispatch(e.data.action);
                            },
                        },
                        {
                            text: 'No',
                            onPress: () => setModalMessage(),
                        },
                    ],
                });
            }),
        [],
    );

    const _onPressSpeech = () => {
        if (!data[currentIndex].word) return;
        if (Platform.OS === 'android') {
            Tts.speak(data[currentIndex].word, {
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 0.5,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                },
            });
        }
        Tts.speak(data[currentIndex].word, {
            iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
            rate: 0.5,
        });
    };

    const _onPressSpeechStop = () => {
        Tts.stop();
    };

    useEffect(() => {
        if (isActiveSlideCards) {
            _onPressSpeech();
            return;
        }
        _onPressSpeechStop();
    }, [isActiveSlideCards, currentIndex]);

    const _renderItem = ({ item }) => {
        return (
            <View marginT-10 marginH-20>
                <Image style={styles.image} source={{ uri: item.picture }} />
                <ScrollView style={{ maxHeight: 200 }}>
                    <View centerH paddingT-20 paddingB-20>
                        <View flex row centerV>
                            <Text font-black fs24 white>
                                {item.word}
                            </Text>
                            <Text fs15 font-semibold white marginL-4>
                                ( {item.type} )
                            </Text>
                        </View>
                        <Text fs15 font-semibold white>
                            {item.phonetic}
                        </Text>
                        <Text fs15 font-semibold white marginT-10>
                            Example: {item.examples[0]}
                        </Text>
                        <Text fs15 font-semibold white marginT-10>
                            Mean: {item.mean}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    };

    const onHandleAddFavorite = async () => {
        const wordSelected = data[currentIndex];
        const result = await accountApi.putToggleWordFavorite({
            username: user.username,
            word: wordSelected.word,
            isAdd: true,
        });
        if (result) {
            const addFavoriteWord = data.map((item, index) => {
                if (index === currentIndex) {
                    return {
                        ...item,
                        isChecked: true,
                    };
                }
                return item;
            });
            setData(addFavoriteWord);
            dispatch(addWordToFavoriteList(wordSelected));
        }
    };

    return (
        <StackLayout
            scroll={false}
            navigateTo={'FlashCards'}
            optionRight={
                <View row centerV>
                    {isReviewing && (
                        <TouchableOpacity onPress={onClickEndOfReview}>
                            <View
                                padding-5
                                paddingH-15
                                br20
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'white',
                                }}
                            >
                                <Text white fs14 font-bold>
                                    End of Review
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View marginL-20>
                        <TouchableOpacity
                            onPress={() => setOpenSettingModal(true)}
                        >
                            <Option />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        >
            {loading && <LoadingScreen />}
            {data && data[currentIndex] && (
                <>
                    <Carousel
                        data={data}
                        ref={c => {
                            carousel.current = c;
                        }}
                        sliderWidth={screenSize.width + 40}
                        itemWidth={screenSize.width}
                        renderItem={_renderItem}
                        onSnapToItem={index => setCurrentIndex(index)}
                        autoplayInterval={cardSpeed * 1000}
                        autoplayDelay={0}
                    />
                    <View marginH-40>
                        <View paddingV-10 row centerV spread paddingH-20>
                            <TouchableOpacity onPress={onHandleAddFavorite}>
                                {data[currentIndex].isChecked ? (
                                    <HeartActive />
                                ) : (
                                    <Heart />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_onPressSpeech}>
                                <Speaker />
                            </TouchableOpacity>
                        </View>
                        <View
                            paddingV-20
                            paddingH-10
                            style={styles.container}
                            centerH
                        >
                            <View
                                row
                                centerV
                                spread
                                marginB-15
                                paddingH-60
                                width="100%"
                            >
                                <TouchableOpacity onPress={onClickPrevCard}>
                                    <ArrowLeft />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onToggleSlideCards}>
                                    <View height={20}>
                                        {isActiveSlideCards ? (
                                            <Pause />
                                        ) : (
                                            <Play />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onClickNextCard}>
                                    <ArrowRight />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View row spread marginB-10>
                                    <Text fs15 greyChateau>
                                        {currentIndex + 1}
                                    </Text>
                                    <Text fs15 greyChateau>
                                        {data.length}
                                    </Text>
                                </View>
                                <Progress.Bar
                                    color={'white'}
                                    width={scaleSize(280)}
                                    progress={(currentIndex + 1) / data.length}
                                    unfilledColor={'rgba(0,0,0,0.25)'}
                                    height={4}
                                    borderColor={'transparent'}
                                />
                            </View>
                        </View>
                    </View>
                </>
            )}
            <FlashCardSettings
                visible={openSettingModal}
                onClose={() => setOpenSettingModal(false)}
            />
            <Modal
                visible={!!modalMessage}
                text={modalMessage?.text}
                description={modalMessage?.description}
                agreeButton={{
                    text: modalMessage?.buttons[0]?.text,
                    onPress: modalMessage?.buttons[0]?.onPress,
                }}
                cancelButton={{
                    text: modalMessage?.buttons[1]?.text,
                    onPress: modalMessage?.buttons[1]?.onPress,
                }}
            />
        </StackLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 136.43%)',
        height: scaleSize(110),
        width: '100%',
        borderRadius: 20,
    },
    image: {
        height: scaleSize(220),
        borderRadius: 10,
    },
    thumb: {
        width: scaleSize(8),
        height: scaleSize(8),
        backgroundColor: '#fff',
        color: '#fff',
    },
});
