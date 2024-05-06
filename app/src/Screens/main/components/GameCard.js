import { Image, Text, View } from 'react-native-ui-lib';
import { images } from 'assets/Images';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { scaleSize } from 'utilities';
import { navigate } from 'navigators/utils';
import { Config } from 'config';

export const GameCard = ({
    name,
    image,
    uri,
    description,
    textRight,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                flexS={false}
                marginV-5
                padding-6
                flex
                centerV
                row
                style={styles.container}
            >
                {uri ? (
                    <Image
                        aspectRatio={1}
                        source={{ uri }}
                        style={styles.image}
                    />
                ) : image ? (
                    <Image
                        aspectRatio={1}
                        source={image}
                        style={styles.image}
                    />
                ) : (
                    <Image
                        aspectRatio={1}
                        source={images.game}
                        style={styles.image}
                    />
                )}

                <View paddingL-16>
                    <Text padding-10 font-light white fs15 font-bold>
                        {name}
                    </Text>
                    {description && (
                        <Text
                            padding-10
                            font-semibold
                            greyChateau
                            marginT-6
                            fs12
                        >
                            {description}
                        </Text>
                    )}
                </View>
                {textRight && (
                    <View right flex-1 marginR-10>
                        <Text fs15 font-light white>
                            {textRight}
                        </Text>
                    </View>
                )}
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
