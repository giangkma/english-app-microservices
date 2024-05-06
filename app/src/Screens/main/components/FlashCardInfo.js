import { Image, Text, View } from 'react-native-ui-lib';
import { images } from 'assets/Images';
import CircularProgress from 'react-native-circular-progress-indicator';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { scaleSize } from 'utilities';
import { navigate } from 'navigators/utils';

export const FlashCardInfo = ({ topic }) => {
    const { name, image, total, wordIdsLearned } = topic;
    const learned = wordIdsLearned.length;
    const percent = (learned / total) * 100 || 0;
    return (
        <TouchableOpacity
            onPress={() =>
                navigate('FlashCardsDetail', {
                    topic,
                })
            }
        >
            <View
                flexS={false}
                marginV-5
                padding-6
                flex
                centerV
                row
                style={styles.container}
            >
                {image ? (
                    <Image
                        aspectRatio={1}
                        source={{ uri: image }}
                        style={styles.image}
                    />
                ) : (
                    <Image
                        aspectRatio={1}
                        source={images.flashcard}
                        style={styles.image}
                    />
                )}

                <View paddingL-16>
                    <Text padding-10 font-light white fs15>
                        {name}
                    </Text>
                    <Text padding-10 font-semibold greyChateau marginT-6 fs13>
                        {learned}/{total} cards learned
                    </Text>
                </View>
                <View right flex-1 marginR-10>
                    <CircularProgress
                        radius={25}
                        value={percent}
                        maxValue={100}
                        valueSuffix={'%'}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 136.43%)',
        height: scaleSize(68),
        borderRadius: 20,
        position: 'relative',
        width: '100%',
    },
    image: {
        width: scaleSize(56),
        borderRadius: 16,
    },
});
