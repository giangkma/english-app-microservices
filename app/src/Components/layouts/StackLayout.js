import { ArrowLeft } from 'assets/Svg';
import { goBack, navigate } from 'navigators/utils';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { Layout } from 'screens';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 5;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export const StackLayout = ({
    children,
    optionRight,
    navigateTo,
    navigateFnc,
    scroll = true,
    textCenter,
    scrollBottom,
}) => {
    return (
        <Layout bg2>
            <View width="100%" flex paddingB-50 centerH paddingH-18>
                <View width="100%" row centerV spread paddingH-6 paddingB-15>
                    <TouchableOpacity
                        onPress={() =>
                            navigateFnc
                                ? navigateFnc()
                                : navigateTo
                                ? navigate(navigateTo)
                                : goBack()
                        }
                    >
                        <ArrowLeft />
                    </TouchableOpacity>
                    {textCenter && (
                        <Text white fs17 font-semibold>
                            {textCenter}
                        </Text>
                    )}

                    <View>{optionRight}</View>
                </View>
                {scroll ? (
                    <ScrollView
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                scrollBottom && scrollBottom();
                            }
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <View height="100%">{children}</View>
                    </ScrollView>
                ) : (
                    <View>
                        <View height="100%">{children}</View>
                    </View>
                )}
            </View>
        </Layout>
    );
};
