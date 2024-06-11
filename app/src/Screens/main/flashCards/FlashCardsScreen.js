import { Button, Card, Image, Text, View } from 'react-native-ui-lib';
import React, { useEffect } from 'react';

import { StackLayout } from 'components/layouts';
import { wordApi } from 'apis';

export const FlashCardsScreen = () => {
    const [words, setWords] = React.useState([]);

    useEffect(() => {
        (async () => {
            const res = await wordApi.adminGetContributeWordList();
            setWords(res);
        })();
    }, []);

    return (
        <StackLayout textCenter="Duyệt Từ" navigateTo={'Home'}>
            <View marginT-15 width={'100%'} height={'100%'}>
                {words.map((word, index) => {
                    return (
                        <Card padding-20 marginB-15 paddingB-10>
                            <View row centerV>
                                <Image
                                    source={{ uri: word.picture }}
                                    style={{ width: 80, height: 80 }}
                                />
                                <View marginL-10>
                                    <Text fs18>
                                        {word.word} ({word.type}) -{' '}
                                        <Text fs16 wildWatermelonRed>
                                            /{word.phonetic}/
                                        </Text>
                                    </Text>
                                    <Text fs16>
                                        <Text fs12>Mean: </Text>
                                        {word.mean}
                                    </Text>
                                    <Text fs16>
                                        <Text fs12>Example: </Text>
                                        {word.examples.map(i => i).join(', ')}
                                    </Text>
                                    <Text fs16>
                                        <Text fs12>Note: </Text>
                                        {word.note}
                                    </Text>
                                    <Text fs16>
                                        <Text fs12>Level: </Text>
                                        {word.level}
                                    </Text>
                                </View>
                            </View>
                            <View marginT-10 row>
                                <Button bg-success flex-1 marginR-10>
                                    <Text>✔️</Text>
                                </Button>
                                <Button bg-error flex-1>
                                    <Text>✖️</Text>
                                </Button>
                            </View>
                        </Card>
                    );
                })}
            </View>
        </StackLayout>
    );
};
