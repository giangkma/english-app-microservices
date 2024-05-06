import { Image, View } from 'react-native-ui-lib';
import { Modal } from 'screens';
import React from 'react';
import { scaleSize } from 'utilities';

export const QRCodeModal = ({ visible, onClose, url }) => {
    if (!url) return null;
    return (
        <>
            <Modal
                visible={visible}
                onClose={onClose}
                text="Enable 2FA"
                description="You can use Google Authenticator or Auth to scan this QRCode"
                iconClose
            >
                <View marginT-10 row centerH>
                    <Image
                        source={{
                            uri: url,
                        }}
                        style={{
                            width: scaleSize(150),
                            height: scaleSize(150),
                        }}
                    />
                </View>
            </Modal>
        </>
    );
};
