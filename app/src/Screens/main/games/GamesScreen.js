import React, { useState } from 'react';

import { GameCard } from 'screens/main/components/GameCard';
import { Images } from 'assets';
import { StackLayout } from 'components/layouts';
import { View } from 'react-native-ui-lib';
import { navigate } from 'navigators/utils';

export const GamesScreen = () => {
    return (
        <StackLayout textCenter="Play games">
            <View spread height="100%">
                <View marginT-15 width={'100%'} height={'100%'}>
                    <GameCard
                        image={Images.game}
                        name={'Puzzle'}
                        onPress={() =>
                            navigate('GameMode', {
                                game: 'Puzzle',
                            })
                        }
                    />
                    <GameCard
                        image={Images.soccer}
                        name={'Soccer'}
                        onPress={() => navigate('Soccer')}
                    />
                </View>
            </View>
        </StackLayout>
    );
};
