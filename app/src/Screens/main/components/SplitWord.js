import { LoadingScreen, PrimaryButton, StackLayout } from 'components';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, HeartActive, Person2, ResultWord } from 'assets';
import { StyleSheet } from 'react-native';
import { Colors } from 'assets/Colors';
import { gameApi, wordApi } from 'apis';
import { randomPersonIcon, scaleSize, screenSize, showAlert } from 'utilities';
import { WordResultModal } from './WordResultModal';
import { Config } from 'config';
import { navigate } from 'navigators/utils';

const splitWord = (word = '') => {
    let splitArr = [];
    let failFlag = 1;

    while (failFlag) {
        // Prevent infinite loop
        if (failFlag >= 50) {
            break;
        }

        splitArr = word.split('').sort(() => Math.random() - 0.5);

        if (splitArr.join('') === word) {
            failFlag++;
        } else {
            failFlag = 0;
            break;
        }
    }

    return splitArr;
};

const renderHearts = nWrong => {
    const numHeartActive = Config.MAX_WRONG_ANSWER - nWrong;

    const hearts = [];
    for (let i = 0; i < numHeartActive; i++) {
        hearts.push(
            <View marginR-5>
                <HeartActive key={i} />
            </View>,
        );
    }
    for (let i = 0; i < nWrong; i++) {
        hearts.push(
            <View marginR-5>
                <Heart key={i} />
            </View>,
        );
    }
    return hearts;
};

const renderStatistical = (nRight, nWrong) => {
    return (
        <View row centerV>
            <Text success fs20 font-bold>
                {nRight}
            </Text>
            <Text fs20 white>
                &nbsp;/&nbsp;
            </Text>
            <Text error fs20 font-bold>
                {nWrong}
            </Text>
        </View>
    );
};

export const SplitWord = ({
    word,
    mean,
    onCorrect,
    onWrong,
    onNext,
    nWrong,
    nRight,
    isRankingMode,
}) => {
    const originSplit = useMemo(() => splitWord(word.toLowerCase()), [word]);
    const [userSplit, setUserSplit] = useState([]);
    const [isCorrect, setIsCorrect] = useState(0);
    const [wordDetail, setWordDetail] = useState();
    const [isShowModalWord, setIsShowModalWord] = useState(false);

    const isAnswered = isCorrect !== 0;

    const handleSelectCharacter = index => {
        const newUserSplit = [...userSplit, { index, ch: originSplit[index] }];
        setUserSplit(newUserSplit);
    };

    const handleReturnCharacter = index => {
        if (isAnswered) {
            return;
        }
        const newUserSplit = userSplit.slice(0, index);
        setUserSplit(newUserSplit);
    };

    const renderOriginSplit = () => {
        return originSplit.map((ch, index) => {
            const isSelected =
                userSplit.findIndex(item => index === item.index) !== -1;

            return (
                <WordButton
                    key={index}
                    word={isSelected ? '' : ch}
                    disabled={isSelected}
                    onPress={() => handleSelectCharacter(index)}
                />
            );
        });
    };

    const renderUserSplit = () => {
        if (userSplit.length === 0) {
            return (
                <View style={{ opacity: 0 }}>
                    <WordButton word="" />
                </View>
            );
        }
        return userSplit.map((item, key) => {
            const correctClass =
                item.ch === word.toLowerCase()[key] ? 'right' : 'wrong';
            return (
                <WordButton
                    key={key}
                    word={item.ch}
                    onPress={() => handleReturnCharacter(key)}
                    status={isAnswered && correctClass}
                />
            );
        });
    };

    const checkIsCorrect = () => {
        const answer = userSplit.map(i => i.ch).join('');
        if (answer.toLowerCase() === word.toLowerCase()) {
            setIsCorrect(1);
            onCorrect();
        } else {
            setIsCorrect(-1);
            onWrong();
        }
    };

    const handleRedo = () => {
        setUserSplit([]);
        setIsCorrect(0);
    };

    const handleNextWord = () => {
        setIsCorrect(0);
        setUserSplit([]);
        onNext();
    };

    const handleGetWordDetail = async () => {
        try {
            const data = await wordApi.getWordDetails(word);
            setWordDetail(data);
        } catch (error) {
            showAlert('Error', error.message);
        }
    };

    useEffect(() => {
        handleGetWordDetail();
    }, [word]);

    useEffect(() => {
        if (nWrong === Config.MAX_WRONG_ANSWER && isRankingMode) {
            navigate('GameOver', {
                game: Config.GAMES.PUZZLE,
                nRight,
            });
        }
    }, [nWrong]);

    console.log('word : ', word);

    const personIcon = useMemo(() => randomPersonIcon(), [word]);

    return (
        <View>
            {wordDetail && (
                <WordResultModal
                    visible={isShowModalWord}
                    onClose={() => setIsShowModalWord(false)}
                    word={wordDetail}
                />
            )}
            <View
                paddingT-10
                paddingH-20
                style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
                height={'100%'}
                width={screenSize.width}
            >
                <View>
                    <View row style={{ justifyContent: 'space-between' }}>
                        <View>
                            {isRankingMode && nRight > 0 && (
                                <Text success fs20 font-bold>
                                    + {nRight * Config.POINT_OF_RIGHT_ANSWER}
                                </Text>
                            )}
                        </View>
                        <View row>
                            {isRankingMode
                                ? renderHearts(nWrong)
                                : renderStatistical(nRight, nWrong)}
                        </View>
                    </View>
                    <View row centerV marginT-10>
                        {personIcon}
                        <View
                            style={styles.boxTextMean}
                            padding-10
                            paddingV-15
                            br10
                            maxWidth={screenSize.width - scaleSize(140)}
                        >
                            <Text white fs17>
                                {mean}
                            </Text>
                        </View>
                    </View>
                    <View row marginT-10 style={styles.wordsContainer}>
                        {renderUserSplit()}
                    </View>
                    {isCorrect === -1 ? (
                        <>
                            <Text error marginL-5 marginT-2 fs15>
                                Incorrect !
                            </Text>
                            {isRankingMode && (
                                <Text white marginL-5 marginT-2 fs15>
                                    The answer is :{' '}
                                    <Text success fs20 font-extraBold marginT-2>
                                        {word}
                                    </Text>{' '}
                                </Text>
                            )}
                        </>
                    ) : isCorrect === 1 ? (
                        <Text success marginL-5 marginT-2 fs15>
                            Correct !
                        </Text>
                    ) : null}
                </View>
                <View row style={styles.wordsContainer}>
                    {renderOriginSplit()}
                </View>
                <View marginB-10>
                    {!isRankingMode && (
                        <View right marginB-15>
                            <TouchableOpacity
                                onPress={() => setIsShowModalWord(true)}
                            >
                                <ResultWord />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View row>
                        {isCorrect === -1 && !isRankingMode && (
                            <View flex-1 marginH-5>
                                <PrimaryButton
                                    text="REDO"
                                    onPress={handleRedo}
                                    border
                                />
                            </View>
                        )}
                        {isAnswered ? (
                            <View flex-1 marginH-5>
                                <PrimaryButton
                                    text="CONTINUE"
                                    onPress={handleNextWord}
                                />
                            </View>
                        ) : (
                            <View flex-1 marginH-5>
                                <PrimaryButton
                                    text="CHECK"
                                    disabled={userSplit.length !== word.length}
                                    onPress={checkIsCorrect}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const WordButton = ({ word, onPress, small, disabled, status }) => {
    return (
        <TouchableOpacity
            style={[
                styles.boxText,
                !word && styles.boxTextBlank,
                status && styles[status],
            ]}
            onPress={onPress}
            br5
            margin-4={!small}
            margin-2={small}
            disabled={disabled}
        >
            <Text fs17 font-light white>
                {word}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    boxTextMean: {
        borderColor: Colors.aluminiumGrey,
        borderWidth: 2,
    },
    boxText: {
        borderColor: Colors.aluminiumGrey,
        borderWidth: 2,
        width: scaleSize(40),
        height: scaleSize(40),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxTextBlank: {
        backgroundColor: Colors.aluminiumGrey,
    },
    wordsContainer: {
        flexWrap: 'wrap',
    },
    right: {
        backgroundColor: Colors.success,
        borderWidth: 0,
    },
    wrong: {
        backgroundColor: Colors.error,
        borderWidth: 0,
    },
});
