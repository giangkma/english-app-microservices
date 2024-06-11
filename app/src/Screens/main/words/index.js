import { LoadingScreen, StackLayout } from 'components';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Card,
    Button,
    Image,
    TouchableOpacity,
} from 'react-native-ui-lib';

import { navigate } from 'navigators/utils';
import { Colors } from 'assets/Colors';
import { wordApi } from 'apis';
import { showAlert } from 'utilities';

import { FlatList, ActivityIndicator } from 'react-native';
import { Config } from 'config';
import { DeleteWordConfirm } from './DeleteWordConfirm';

const SECTIONS = [
    {
        sceen: 'ContributeWords',
        name: 'Contributed Words',
    },
    {
        sceen: 'AllWords',
        name: 'All Words',
    },
];

export const useWords = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [sectionName, setSectionName] = useState(SECTIONS[0].name);
    const [page, setPage] = useState(1);
    const [isHasMore, setIsHasMore] = useState(true);

    const isAllWordMode = sectionName === 'All Words';

    const onAcceptWords = async ids => {
        try {
            setLoadingOverlay(true);
            await wordApi.acceptWords({ ids });
            showAlert('Accept words successfully', 'Success');
            setWords(prev => prev.filter(i => !ids.includes(i._id)));
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoadingOverlay(false);
        }
    };

    const onDeleteWords = async ids => {
        try {
            setLoadingOverlay(true);
            await wordApi.deleteWords({ ids });
            showAlert('Delete words successfully', 'Success');
            setWords(prev => prev.filter(i => !ids.includes(i._id)));
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoadingOverlay(false);
        }
    };

    const getWords = async isReset => {
        try {
            setLoading(true);
            const { packList } = await wordApi.getWordList({
                page,
                perPage: Config.LIMIT,
                query: {
                    isChecked: isAllWordMode,
                    sortBy: 'updatedAt',
                    sortType: 'desc',
                },
            });

            setIsHasMore(packList.length === Config.LIMIT);

            setWords(isReset ? packList : [...words, ...packList]);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) {
            getWords(true);
        } else {
            setPage(1);
        }
    }, [sectionName]);

    useEffect(() => {
        getWords(page === 1);
    }, [page]);

    return {
        words,
        loading,
        sectionName,
        setSectionName,
        page,
        setPage,
        isAllWordMode,
        onAcceptWords,
        loadingOverlay,
        isHasMore,
        onDeleteWords,
    };
};

export const WordsScreen = () => {
    const {
        words,
        loading,
        isAllWordMode,
        sectionName,
        setSectionName,
        setPage,
        onAcceptWords,
        loadingOverlay,
        isHasMore,
        onDeleteWords,
    } = useWords();

    const [wordDelete, setWordDelete] = useState(undefined);

    const onGoBack = () => {
        navigate('Home');
    };

    return (
        <StackLayout
            scroll={false}
            navigateFnc={onGoBack}
            textCenter={'Words Management'}
        >
            {loadingOverlay && <LoadingScreen />}
            <DeleteWordConfirm
                visible={!!wordDelete}
                onClose={() => setWordDelete(undefined)}
                word={wordDelete}
                onConfirm={() => onDeleteWords([wordDelete._id])}
            />
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 15,
                        padding: 10,
                        flexDirection: 'row',
                    }}
                >
                    {SECTIONS.map(i => {
                        return (
                            <TouchableOpacity
                                key={i.sceen}
                                onPress={() => setSectionName(i.name)}
                                style={{
                                    backgroundColor:
                                        sectionName === i.name
                                            ? Colors.darkLinear
                                            : 'white',
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <Text>{i.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            {words.length === 0 && !loading && (
                <View centerV centerH marginT-20>
                    <Text white fs16>
                        No words
                    </Text>
                </View>
            )}
            <View marginT-25 marginB-80>
                <FlatList
                    style={{ width: '100%' }}
                    keyExtractor={word => word.id}
                    data={words}
                    renderItem={({ item }) => {
                        return (
                            <Card
                                style={{ position: 'relative' }}
                                padding-20
                                marginB-15
                                paddingB-10
                            >
                                {item.isContributed && (
                                    <TouchableOpacity
                                        onPress={() => setWordDelete(item)}
                                        bg-error
                                        flex
                                        center
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 30,
                                            height: 30,
                                            zIndex: 20,
                                        }}
                                    >
                                        <Text>✖️</Text>
                                    </TouchableOpacity>
                                )}
                                <View row centerV>
                                    <Image
                                        source={{ uri: item.picture }}
                                        style={{ width: 80, height: 80 }}
                                    />
                                    <View
                                        marginL-10
                                        style={{
                                            width: 240,
                                        }}
                                    >
                                        <Text
                                            fs18
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.word} ({item.type}) -{' '}
                                            <Text fs13 wildWatermelonRed>
                                                /{item.phonetic}/
                                            </Text>
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Mean: </Text>
                                            {item.mean}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Example: </Text>
                                            {item.examples
                                                .map(i => i)
                                                .join(', ')}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Note: </Text>
                                            {item.note}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Level: </Text>
                                            {item.level}
                                        </Text>
                                    </View>
                                </View>
                                {!isAllWordMode && (
                                    <Button
                                        onPress={() =>
                                            onAcceptWords([item._id])
                                        }
                                        marginT-10
                                        bg-success
                                        flex-1
                                        marginR-10
                                    >
                                        <Text>✔️</Text>
                                    </Button>
                                )}
                            </Card>
                        );
                    }}
                    // check isHasMore to prevent call api when loading
                    onEndReached={() => isHasMore && setPage(prev => prev + 1)}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loading && (
                            <View style={{ padding: 10 }}>
                                <ActivityIndicator size="large" />
                            </View>
                        )
                    }
                />
            </View>
        </StackLayout>
    );
};
