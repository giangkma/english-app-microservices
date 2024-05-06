import { useFocusEffect } from '@react-navigation/native';
import { accountApi } from 'apis';
import { twoFAApi } from 'apis/twoFAApi';
import { Colors } from 'assets/Colors';
import { LoadingScreen, PrimaryButton, StackLayout } from 'components';
import { Config } from 'config';
import { useAuth } from 'hooks';
import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { Checkbox, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Avatar, UserInfoTextField } from 'screens/main/components';
import { getUserThunk, setUser } from 'store/auth';
import { showAlert } from 'utilities';
import { ChangePasswordModal } from './ChangePasswordModal';
import { Disable2FAModal } from './Disable2FAModal';
import { QRCodeModal } from './QRCodeModal';

export const UserInfoScreen = () => {
    const [loading, setLoading] = useState(false);
    const [isWantToDisable2FA, setIsWantToDisable2FA] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [photo, setPhoto] = useState(null);
    const [qr2FAUrl, setQr2FaUrl] = useState(null);

    const handleChoosePhoto = () => {
        launchImageLibrary({ noData: true }, response => {
            if (response) {
                setPhoto({
                    uri: response.assets[0].uri,
                    type: `test/${response.assets[0].uri.split('.')[1]}`,
                    name: `test/${response.assets[0].uri.split('.')[0]}`,
                });
            }
        });
    };

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            is2FAEnabled: user?.is2FAEnabled,
        },
    });
    const is2FAEnabled = watch('is2FAEnabled');

    useEffect(() => {
        // user want to enable 2FA
        if (!user.is2FAEnabled && is2FAEnabled) {
            postEnable2FaFactor();
        } else if (user.is2FAEnabled && !is2FAEnabled) {
            setIsWantToDisable2FA(true);
        }
    }, [is2FAEnabled]);

    const getUserInfo = async () => {
        try {
            setLoading(true);
            dispatch(getUserThunk());
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const postEnable2FaFactor = async () => {
        try {
            setLoading(true);
            const urlQr2Fa = await twoFAApi.enable();
            setQr2FaUrl(urlQr2Fa);
            getUserInfo();
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onSaveInfo = async user => {
        try {
            setLoading(true);
            await accountApi.putUpdateProfile(user);
            getUserInfo();
            showAlert('Update profile successfully', 'success');
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user]);

    return (
        <StackLayout
            optionRight={
                <PrimaryButton
                    onPress={handleSubmit(onSaveInfo)}
                    text="Save"
                    small
                />
            }
        >
            {loading && <LoadingScreen />}
            {isWantToDisable2FA && (
                <Disable2FAModal
                    visible={true}
                    onClose={() => {
                        setIsWantToDisable2FA(false);
                        setValue('is2FAEnabled', true);
                    }}
                    onDisabled={() => {
                        setIsWantToDisable2FA(false);
                        getUserInfo();
                    }}
                />
            )}
            <ChangePasswordModal
                visible={changePassword}
                onClose={() => setChangePassword(false)}
            />
            <QRCodeModal
                visible={!!qr2FAUrl}
                onClose={() => setQr2FaUrl(null)}
                url={qr2FAUrl}
            />
            <View marginB-30 center>
                <Avatar uri={photo?.uri} />
                <TouchableOpacity marginT-10 onPress={handleChoosePhoto}>
                    <Text
                        color={Colors.wildWatermelonRed}
                        font-bold
                        fs17
                        center
                    >
                        Change profile photo
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <UserInfoTextField
                            label={'Full name'}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={errors.name && errors.name.message}
                        />
                    )}
                    name="name"
                    rules={{
                        required: 'Full name is required!',
                        pattern: {
                            value: Config.STRING_REGEX,
                            message: 'Full name is invalid',
                        },
                    }}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <UserInfoTextField
                            label={'Email'}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={errors.email && errors.email.message}
                        />
                    )}
                    name="email"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: Config.EMAIL_REGEX,
                            message: 'Email is invalid',
                        },
                    }}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <UserInfoTextField
                            label={'Username'}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            editable={false}
                            error={errors.username && errors.username.message}
                        />
                    )}
                    name="username"
                    rules={{ required: 'User Name is required' }}
                />
                <View row centerV marginT-10>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                value={value}
                                onValueChange={onChange}
                                color="#16a085"
                            />
                        )}
                        name="is2FAEnabled"
                    />
                    <Text
                        style={{
                            marginLeft: 10,
                            color: Colors.white,
                            fontSize: 16,
                        }}
                    >
                        Turn on two-factor authentication
                    </Text>
                </View>
                <View marginT-20>
                    <PrimaryButton
                        onPress={() => setChangePassword(true)}
                        text="Change Password"
                    />
                </View>
            </View>
        </StackLayout>
    );
};
