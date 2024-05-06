import { Image, Text, View } from 'react-native-ui-lib';
import { Images } from 'assets';
import { getInitials, scaleSize } from 'utilities';
import { StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from 'assets/Colors';
import { images } from 'assets/Images';

export const PlayerRankCard = ({ isYou, item }) => {
    if (!item) return null;
    return (
        <View
            row
            centerV
            spread
            paddingH-15
            paddingV-5
            style={isYou ? styles.container : {}}
        >
            <View row centerV>
                <Text fs20 font-semiBold white>
                    {item.rank}.
                </Text>
                {item.avatar ? (
                    <Image
                        aspectRatio={1}
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                        marginH-15
                    />
                ) : (
                    <View marginH-15>
                        <View
                            flex
                            centerV
                            centerH
                            width={scaleSize(40)}
                            height={scaleSize(40)}
                            style={{
                                borderRadius: 100,
                                backgroundColor: '#3F60B2',
                            }}
                        >
                            <Text white fs13 font-bold>
                                {getInitials(item.name)}
                            </Text>
                        </View>
                    </View>
                )}
                <View row centerV>
                    <Text fs15 font-semiBold white>
                        {item.name}
                    </Text>
                    {isYou && (
                        <Text fs10 font-semiBold white>
                            &nbsp;(You)
                        </Text>
                    )}
                </View>
            </View>
            <Text fs20 font-semiBold white>
                {item.score}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: scaleSize(40),
        height: scaleSize(40),
        borderRadius: 100,
    },
    container: {
        backgroundColor: Colors.darkLinear,
        borderRadius: 20,
    },
});
