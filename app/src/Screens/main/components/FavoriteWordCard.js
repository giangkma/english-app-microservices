import { StyleSheet } from 'react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { scaleSize, screenSize } from 'utilities';
import React from 'react';
import { Heart } from 'assets';

export const FavoriteWordCard = ({ favoriteWord, onUnFavoriteWord }) => {
    return (
        <View
            flexS={false}
            marginV-5
            padding-6
            flex
            centerV
            row
            style={styles.container}
        >
            <Image
                aspectRatio={1}
                source={{ uri: favoriteWord.picture }}
                style={styles.image}
            />

            <View paddingL-16 maxWidth={screenSize.width - scaleSize(100)}>
                <View row centerV width={'100%'} paddingR-10 style={{ justifyContent: 'space-between' }}>
                    <View>
                        <Text padding-10 font-light white fs15>
                            {favoriteWord.word} ({favoriteWord.type})
                        </Text>
                        <Text padding-10 font-light white fs15>
                            [ &nbsp;
                            {favoriteWord.phonetic}&nbsp;]
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => onUnFavoriteWord(favoriteWord.word)}>
                        <Text>❌</Text>
                    </TouchableOpacity>
                </View>
                <Text padding-10 font-semibold greyChateau marginT-6 fs13>
                    {favoriteWord.mean}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 136.43%)',
        borderRadius: 20,
        position: 'relative',
        width: '100%',
    },
    image: {
        width: scaleSize(56),
        borderRadius: 16,
    },
});
