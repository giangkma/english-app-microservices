import { Image, Text, View } from 'react-native-ui-lib';
import { scaleSize } from 'utilities';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { navigate } from 'navigators/utils';
import { Colors } from 'assets/Colors';

export const HomeCard = ({ imgSrc, title, iconSrc, navigateTo }) => {
    return (
        <TouchableOpacity onPress={() => navigate(navigateTo)}>
            <View style={styles.container}>
                <Image style={styles.background} source={imgSrc} aspectRatio={0.866}/>
                <View abs padding-10>
                    <Text white fs17 font-bold style={{ lineHeight: 32 }}>{title}</Text>
                </View>
                <View center style={styles.iconContainer}>
                    <Image style={styles.cardIcon} aspectRatio={1} source={iconSrc}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 0.866,
        borderRadius: Colors.borderRadius,
        height: scaleSize(178),
        overflow: 'hidden'
    },
    iconContainer: {
        height: scaleSize(70),
        width: scaleSize(70),
        borderRadius: 100,
        backgroundColor: '#578397',
        position: 'absolute',
        bottom: -7,
        left: -7,
    },
    cardIcon: {
        zIndex: 5,
        height: scaleSize(30)
    },
    background: {
        height: scaleSize(178),
        opacity: 0.5,
    }
});
