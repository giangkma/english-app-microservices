import { Colors } from 'assets/Colors';
import { useAuth } from 'hooks';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
import { getInitials, scaleSize } from 'utilities';
import React from 'react';

export const Avatar = ({ size = 85, uri }) => {
    const { user } = useAuth();
    if (user && (user.avt || uri)) {
        return (
            <Image
                aspectRatio={1}
                source={{ uri: uri ?? user.avt }}
                width={scaleSize(size)}
                height={scaleSize(size)}
                style={style.avatar}
            />
        );
    }
    return (
        <View
            width={scaleSize(size)}
            height={scaleSize(size)}
            style={style.avatar}
            marginV-20
            center
            padding-4
        >
            <Text fs24 font-bold white>
                {user && getInitials(user.name)}
            </Text>
        </View>
    );
};

const style = StyleSheet.create({
    avatar: {
        borderRadius: 100,
        backgroundColor: Colors.pinkLinear,
        borderStyle: 'solid',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});
