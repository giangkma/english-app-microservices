import { StyleSheet } from 'react-native';
import React from 'react';
import { Modal } from 'components';
import { Image, Button, Text, View } from 'react-native-ui-lib';
import { scaleSize, screenSize } from 'utilities';

export const DeleteWordConfirm = ({ visible, onClose, word, onConfirm }) => {
    if (!visible || !word) return null;
    const { isContributed } = word;
    const isHiddenWord = isContributed && word.status === 'accepted';
    return (
        <Modal
            visible={visible}
            text={
                isHiddenWord ? 'Xác nhận ẩn từ đã đóng góp' : 'Xác nhận xoá từ'
            }
            iconClose
            onClose={onClose}
        >
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
            <Text fs15 white font-semibold marginT-10 center>
                Bạn có chắc chắn muốn {isHiddenWord ? 'ẩn' : 'xoá'} từ này
                không?
            </Text>

            <View row center marginT-10>
                <Button
                    onPress={() => {
                        onConfirm();
                        onClose();
                    }}
                    marginT-10
                    bg-success
                    flex-1
                    marginR-10
                >
                    <Text white fs16>
                        Có
                    </Text>
                </Button>
                <Button onPress={onClose} marginT-10 bg-error flex-1 marginR-10>
                    <Text white fs16>
                        Không
                    </Text>
                </Button>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    image: {
        width: scaleSize(80),
        height: scaleSize(80),
    },
});
