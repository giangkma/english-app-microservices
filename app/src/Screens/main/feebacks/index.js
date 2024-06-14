import { LoadingScreen, StackLayout } from 'components';
import { Card, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import React, { useState, useEffect, useCallback } from 'react';

import { navigate } from 'navigators/utils';
import { feedbackApi } from 'apis/feedbackApi';
import { showAlert } from 'utilities';
import { useFocusEffect } from '@react-navigation/native';

export const FeedbackScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const onGetData = async () => {
        try {
            setLoading(true);
            const res = await feedbackApi.getList();
            console.log(res);
            setData(res);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async id => {
        try {
            setLoading(true);
            await feedbackApi.delete(id);
            onGetData();
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            onGetData();
        }, []),
    );

    const onGoBack = () => {
        navigate('Home');
    };

    return (
        <StackLayout
            scroll={false}
            navigateFnc={onGoBack}
            textCenter={'Ý kiến đóng góp'}
        >
            {loading && <LoadingScreen />}
            <View marginT-25 marginB-80>
                {data?.length === 0 ? (
                    <View centerV centerH marginT-20>
                        <Text white fs16>
                            Không có ý kiến nào
                        </Text>
                    </View>
                ) : (
                    data.map((item, index) => (
                        <Card
                            key={index}
                            style={{ position: 'relative' }}
                            padding-20
                            marginB-15
                        >
                            <TouchableOpacity
                                onPress={() => onDelete(item._id)}
                                bg-error
                                flex
                                center
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 30,
                                    height: 30,
                                    zIndex: 20,
                                }}
                            >
                                <Text>✖️</Text>
                            </TouchableOpacity>
                            <View marginL-10>
                                <Text fs15>{item.feedback}</Text>
                            </View>
                        </Card>
                    ))
                )}
            </View>
        </StackLayout>
    );
};
