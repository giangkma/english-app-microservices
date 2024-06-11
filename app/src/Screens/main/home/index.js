import { accountApi } from 'apis';
import { Icons, Images, Menu } from 'assets';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { setUser } from 'store/auth';
import { scaleSize, showAlert } from 'utilities';

import { useTranslation } from 'react-i18next';
import { Layout } from 'screens';
import { HomeCard } from '../components';

export const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const getProfile = async () => {
        try {
            const { user } = await accountApi.getUserInfo();
            const account = await accountApi.getUserProfile();
            dispatch(
                setUser({
                    ...user,
                    ...account,
                }),
            );
        } catch (error) {
            showAlert(error.message);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);
    return (
        <Layout bg2 isScroll={true}>
            <View width="100%" flex paddingB-10 paddingH-18>
                <View width="100%" row centerV spread paddingH-6 paddingB-15>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Menu />
                    </TouchableOpacity>
                    <Text white fs17 font-semibold>
                        Home
                    </Text>
                    <View></View>
                </View>
                <ScrollView width="100%" height="100%">
                    <View spread height="100%">
                        <View marginV-20>
                            <Image
                                style={{
                                    height: scaleSize(145),
                                    opacity: 0.3,
                                    borderRadius: 20,
                                }}
                                source={Images.banner}
                                aspectRatio={2.18}
                            />
                            <View abs paddingV-10 paddingH-20>
                                <Text white fs17 font-bold marginV-10>
                                    I Can Help You
                                </Text>
                                <Text white fs15>
                                    Here will be description of banner. Here
                                    will be description of banner. Here will be
                                    description of banner.{' '}
                                </Text>
                            </View>
                        </View>
                        <View row spread marginB-20>
                            <HomeCard
                                title={'Words Management'}
                                imgSrc={Images.flashcard}
                                iconSrc={Icons.flashcardIcon}
                                navigateTo={'Works'}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Layout>
    );
};
