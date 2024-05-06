import { Images } from 'assets';
import { StackLayout, LoadingScreen } from 'components';
import { navigate, navigateAndReset } from 'navigators/utils';
import { Text, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { FlashCardInfo, GameCard } from 'screens/main/components';
import { getFlashCardsTopics, setTopics } from 'store/flashCards';
import React, { useEffect, useState, useCallback } from 'react';
import { rankApi } from 'apis';
import { showAlert } from 'utilities';
import { Config } from 'config';
import { useFocusEffect } from '@react-navigation/native';

export const GameModeScreen = ({ navigation, route }) => {
    const { game } = route.params;
    const topics = useSelector(getFlashCardsTopics);
    const [isShowTopics, setIsShowTopics] = useState(false);
    const [loading, setLoading] = useState(false);

    const [rankingNumberInDay, setRankingNumberInDay] = useState(0);

    const getRankingLogsInDay = async game => {
        try {
            setLoading(true);
            const logs = await rankApi.getRankingLogsInDay(game);
            if (logs.length > Config.MAX_RANKING_OF_DAY) {
                setRankingNumberInDay(Config.MAX_RANKING_OF_DAY);
            } else {
                setRankingNumberInDay(logs.length);
            }
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const tryToRankingMode = () => {
        if (rankingNumberInDay === Config.MAX_RANKING_OF_DAY) {
            showAlert(
                'You have been to the maximum number of play in day !',
                'Please continue tomorrow',
            );
            return;
        }
        navigate(game, {
            mode: 'Ranking mode',
        });
    };

    useFocusEffect(
        useCallback(() => {
            getRankingLogsInDay(game.toLowerCase());
        }, []),
    );

    return (
        <StackLayout
            navigateFnc={() => {
                isShowTopics
                    ? setIsShowTopics(false)
                    : navigation.navigate('Games');
            }}
            textCenter={game}
        >
            {loading && <LoadingScreen />}
            <View marginT-15>
                {isShowTopics ? (
                    <>
                        {topics.map((topic, index) => {
                            return (
                                <GameCard
                                    key={index}
                                    uri={topic.image}
                                    name={topic.name}
                                    description={`${topic.total} words`}
                                    onPress={() => {
                                        navigate(game, {
                                            mode: 'Exercise mode',
                                            topic,
                                        });
                                        setIsShowTopics(false);
                                    }}
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        <GameCard
                            image={Images.gamePractice}
                            name={'Exercise mode'}
                            description={
                                'You can choose topics, and play unlimited.'
                            }
                            onPress={() => setIsShowTopics(true)}
                        />
                        <GameCard
                            image={Images.gameRanking}
                            name={'Ranking mode'}
                            description={
                                'You will play with all existing topics'
                            }
                            textRight={`${rankingNumberInDay}/${Config.MAX_RANKING_OF_DAY}`}
                            onPress={tryToRankingMode}
                        />
                        <Text fs13 font-light white marginT-15>
                            Note : The system only calculates points when you
                            choose ranking mode. and every day you only have{' '}
                            {Config.MAX_RANKING_OF_DAY} turn to play ranking
                            mode !
                        </Text>
                    </>
                )}
            </View>
        </StackLayout>
    );
};
