import { useFocusEffect } from '@react-navigation/native';
import { rankApi } from 'apis';
import { Colors } from 'assets/Colors';
import { LoadingScreen, PrimaryButton, StackLayout } from 'components';
import { Config } from 'config';
import { navigate } from 'navigators/utils';
import React, { useEffect, useState, useCallback } from 'react';

import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { randomPersonIcon, scaleSize, screenSize, showAlert } from 'utilities';

export const GameOverScreen = ({ navigation, route }) => {
    const { nRight, game } = route.params;
    const [loading, setLoading] = useState(false);

    const score = nRight * Config.POINT_OF_RIGHT_ANSWER;

    const postScore = async () => {
        try {
            setLoading(true);
            if (score !== 0) {
                await rankApi.putScore(game, score);
            }
            navigate('Games');
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StackLayout scroll={false} textCenter={'Game Over'} navigateTo="Games">
            {loading && <LoadingScreen />}
            <View
                marginT-20
                height={'100%'}
                style={{ justifyContent: 'space-around' }}
            >
                <View row centerV>
                    {randomPersonIcon()}
                    <View
                        style={styles.boxTextMean}
                        padding-10
                        paddingV-15
                        br10
                        maxWidth={screenSize.width - scaleSize(140)}
                    >
                        {score > 0 ? (
                            <>
                                <View row centerV>
                                    <Text white fs15>
                                        👏 With the correct word count:{' '}
                                        <Text
                                            success
                                            fs20
                                            font-extraBold
                                            marginT-2
                                        >
                                            {nRight}
                                        </Text>{' '}
                                    </Text>
                                </View>
                                <View row centerV marginT-15>
                                    <Text white fs15>
                                        You got{' '}
                                        <Text
                                            success
                                            fs20
                                            font-extraBold
                                            marginT-2
                                        >
                                            {score}
                                        </Text>{' '}
                                        points! This score is 20% better than
                                        other players.
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View row centerV>
                                    <Text white fs15>
                                        😢 you have{' '}
                                        <Text
                                            success
                                            fs20
                                            font-extraBold
                                            marginT-2
                                        >
                                            {nRight}
                                        </Text>{' '}
                                        correct answers.
                                    </Text>
                                </View>
                            </>
                        )}
                        <View row centerV marginT-15>
                            <Text white fs15>
                                Come back the next day and try harder!{' '}
                                {score > 0 ? '🎉' : '🙌'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View bottom>
                    <PrimaryButton text="Continue ➡️" onPress={postScore} />
                </View>
            </View>
        </StackLayout>
    );
};

const styles = StyleSheet.create({
    boxTextMean: {
        borderColor: Colors.aluminiumGrey,
        borderWidth: 2,
        padding: scaleSize(20),
    },
});
