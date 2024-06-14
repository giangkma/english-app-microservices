import { Code, Email, Lock } from 'assets';
import { Controller, useForm } from 'react-hook-form';
import { LoadingScreen, PrimaryButton, StyledTextInput } from 'screens';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { showAlert, tokenStorage } from 'utilities';

import { AuthLayout } from './components';
import { Config } from 'config';
import { TouchableOpacity } from 'react-native';
import { accountApi } from 'apis';
import { navigate } from 'navigators/utils';
import { setUser } from 'store/auth';
import { useDispatch } from 'react-redux';

export const LoginScreen = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            email: 'admin@gmail.com',
            password: 'admin@gmail.com',
        },
    });

    const onSubmit = async data => {
        try {
            setLoading(true);
            const res = await accountApi.postLogin({
                email: data.email,
                password: data.password,
                otpToken: data.otpToken,
                isAdmin: true,
            });
            if (res.token) {
                tokenStorage.set(res.token);
                const { user } = await accountApi.getUserInfo();
                dispatch(setUser(user));
            }
            if (res.isNeedOTP) {
                return setIs2FAEnabled(true);
            }
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (route.params) {
            setValue('email', route.params.email);
            setValue('password', route.params.password);
        }
    }, [route.params]);

    return (
        <AuthLayout text="Đăng Nhập">
            {loading && <LoadingScreen />}
            <View>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledTextInput
                            icon={<Email />}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Email"
                            error={errors.email && errors.email.message}
                        />
                    )}
                    name="email"
                    rules={{
                        required: 'Bạn phải điền email',
                        pattern: {
                            value: Config.EMAIL_REGEX,
                            message: 'Email không hợp lệ',
                        },
                    }}
                />

                <View marginV-10>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <StyledTextInput
                                type="password"
                                icon={<Lock />}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                placeholder="Mật Khẩu"
                                error={
                                    errors.password && errors.password.message
                                }
                            />
                        )}
                        name="password"
                    />
                </View>
                {is2FAEnabled && (
                    <View marginB-10>
                        <Controller
                            control={control}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <StyledTextInput
                                    icon={<Code />}
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    placeholder="OPT Code"
                                    error={
                                        errors.otpToken &&
                                        errors.otpToken.message
                                    }
                                />
                            )}
                            name="otpToken"
                            rules={{
                                required: 'OPT Code is required',
                                pattern: {
                                    value: Config.NUMBER_REGEX,
                                    message: 'OPT Code is invalid',
                                },
                            }}
                        />
                    </View>
                )}
            </View>
            <View row right marginB-36>
                <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                    <Text white fs15 fw5 font-medium>
                        Bạn quên mật khẩu?
                    </Text>
                </TouchableOpacity>
            </View>
            <PrimaryButton onPress={handleSubmit(onSubmit)} text="Đăng nhập" />
        </AuthLayout>
    );
};
