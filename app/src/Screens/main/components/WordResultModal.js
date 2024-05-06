import { StyleSheet } from 'react-native';
import React from 'react';
import { Modal } from 'components';
import { Image, Text, View } from 'react-native-ui-lib';
import { scaleSize, screenSize } from 'utilities';

export const WordResultModal = ({ visible, onClose, word }) => {
    return (
        <Modal visible={visible} text={'Answer'} iconClose onClose={onClose}>
            <View row top>
                <View marginR-10>
                    <Image
                        style={styles.image}
                        aspectRatio={1}
                        source={{ uri: word.picture }}
                    />
                </View>
                <View maxWidth={screenSize.width - scaleSize(160)}>
                    <View row centerV>
                        <Text fs20 success font-semibold>
                            {word.word}
                        </Text>
                        <Text fs14 white font-semibold>
                            &nbsp;( {word.type} ) :&nbsp;
                        </Text>
                        <Text fs17 white font-semibold>
                            {word.phonetic}
                        </Text>
                    </View>
                    <Text fs18 white font-semibold marginT-10>
                        {word.mean}
                    </Text>
                </View>
            </View>
            <Text fs15 white font-semibold marginT-10>
                Example:
            </Text>
            <Text fs15 white font-semibold marginT-10>
                {word.examples[0] || ''}
            </Text>
        </Modal>
    );
};

const styles = StyleSheet.create({
    image: {
        width: scaleSize(80),
        height: scaleSize(80),
    },
});
