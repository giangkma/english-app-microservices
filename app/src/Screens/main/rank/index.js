import { LoadingScreen, StackLayout } from 'components';
import { Text, View } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { PlayerRankCard } from 'screens/main/components';
import { showAlert } from 'utilities';
import { rankApi } from 'apis';
import { useFocusEffect } from '@react-navigation/native';
import { Images } from 'assets';
import { GameCard } from 'screens/main/components/GameCard';
import { navigate } from 'navigators/utils';

export const RankScreen = () => {
    const [ranks, setRanks] = useState([]);
    const [rankOfUser, setRankOfUser] = useState();
    const [loading, setLoading] = useState(false);
    const [game, setGame] = useState();

    const getRanksOfGame = async () => {
        try {
            if (!game) return;
            setLoading(true);
            const { ranks, rankOfUser } = await rankApi.getRanks(
                game.toLowerCase(),
            );
            setRankOfUser(rankOfUser);
            setRanks(ranks);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getRanksOfGame(game);
        }, [game]),
    );

    const onGoBack = () => {
        if (game) {
            setGame(undefined);
            setRanks([]);
        } else navigate('Home');
    };

    return (
        <StackLayout navigateFnc={onGoBack} textCenter={game ?? 'Rank'}>
            {loading && <LoadingScreen />}
            {game ? (
                <>
                    <Text fs15 font-semiBold white>
                        Top 10 best player
                    </Text>
                    <View paddingT-10>
                        <View>
                            {ranks &&
                                ranks.slice(0, 10).map((item, index) => {
                                    const isYou =
                                        rankOfUser &&
                                        rankOfUser.accountId === item.accountId;
                                    return (
                                        <PlayerRankCard
                                            isYou={isYou}
                                            key={index}
                                            item={item}
                                        />
                                    );
                                })}
                        </View>
                        {rankOfUser && rankOfUser.rank > 10 && (
                            <View>
                                <Text
                                    fs15
                                    font-semiBold
                                    white
                                    center
                                    marginB-10
                                >
                                    .......
                                </Text>
                                <PlayerRankCard isYou item={rankOfUser} />
                            </View>
                        )}
                    </View>
                </>
            ) : (
                <View spread height="100%">
                    <View marginT-15 width={'100%'} height={'100%'}>
                        <GameCard
                            image={Images.game}
                            name={'Puzzle'}
                            onPress={() => setGame('Puzzle')}
                        />
                        <GameCard
                            image={Images.soccer}
                            name={'Soccer'}
                            onPress={() => setGame('Soccer')}
                        />
                    </View>
                </View>
            )}
        </StackLayout>
    );
};
