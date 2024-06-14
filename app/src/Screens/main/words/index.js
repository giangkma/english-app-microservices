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

const WORD_STATUS = [
    {
        sceen: 'ContributeWords',
        name: 'Chờ Duyệt',
        status: 'pending',
    },
    {
        sceen: 'AllWords',
        name: 'Đã Duyệt',
        status: 'accepted',
    },
    {
        sceen: 'RejectedWords',
        name: 'Đã Từ Chối',
        status: 'rejected',
    },
];

export const useWords = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [statusObj, setStatusObj] = useState(WORD_STATUS[0]);
    const [page, setPage] = useState(1);
    const [isHasMore, setIsHasMore] = useState(true);
    const [wordDelete, setWordDelete] = useState(undefined);

    const onAcceptWords = async ids => {
        try {
            setLoadingOverlay(true);
            await wordApi.acceptWords({ ids });
            showAlert('', 'Thành Công');
            setWords(prev => prev.filter(i => !ids.includes(i._id)));
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoadingOverlay(false);
        }
    };

    const onDeleteWords = async () => {
        try {
            setLoadingOverlay(true);
            const ids = [wordDelete._id];
            await wordApi.deleteWords({ ids });
            showAlert('', 'Thành Công');
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
                    status: statusObj.status,
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
    }, [statusObj.status]);

    useEffect(() => {
        getWords(page === 1);
    }, [page]);

    return {
        words,
        setWords,
        loading,
        statusObj,
        setStatusObj,
        page,
        setPage,
        onAcceptWords,
        loadingOverlay,
        isHasMore,
        onDeleteWords,
        wordDelete,
        setWordDelete,
    };
};

export const WordsScreen = () => {
    const {
        words,
        setWords,
        loading,
        statusObj,
        setStatusObj,
        setPage,
        onAcceptWords,
        loadingOverlay,
        isHasMore,
        onDeleteWords,
        wordDelete,
        setWordDelete,
    } = useWords();

    const onGoBack = () => {
        navigate('Home');
    };

    return (
        <StackLayout
            scroll={false}
            navigateFnc={onGoBack}
            textCenter={'Từ Vựng'}
        >
            {loadingOverlay && <LoadingScreen />}
            <DeleteWordConfirm
                visible={!!wordDelete}
                onClose={() => setWordDelete(undefined)}
                word={wordDelete}
                onConfirm={onDeleteWords}
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
                    {WORD_STATUS.map(i => {
                        return (
                            <TouchableOpacity
                                key={i.sceen}
                                onPress={() => {
                                    setWords([]);
                                    setStatusObj(i);
                                }}
                                style={{
                                    backgroundColor:
                                        statusObj.name === i.name
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
                        Không có từ nào
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
                                            <Text fs12>Nghĩa: </Text>
                                            {item.mean}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Ví dụ: </Text>
                                            {item.examples
                                                .map(i => i)
                                                .join(', ')}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Ghi chú: </Text>
                                            {item.note}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Cấp độ: </Text>
                                            {item.level}
                                        </Text>
                                        {item.contributedBy && (
                                            <Text fs13>
                                                <Text fs12>
                                                    Người đóng góp:{' '}
                                                </Text>
                                                {item.contributedBy}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {statusObj.status !== 'accepted' && (
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
