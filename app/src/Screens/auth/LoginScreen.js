import { accountApi } from 'apis';
import { Code, Email, Lock } from 'assets';
import { Config } from 'config';
import { navigate } from 'navigators/utils';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { LoadingScreen, PrimaryButton, StyledTextInput } from 'screens';
import { setUser } from 'store/auth';
import { showAlert, tokenStorage } from 'utilities';
import { AuthLayout } from './components';

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
            username: __DEV__ ? 'giangdt' : '',
            password: __DEV__ ? '123' : '',
        },
    });

    const onSubmit = async data => {
        try {
            setLoading(true);
            const res = await accountApi.postLogin({
                username: data.username,
                password: data.password,
                otpToken: data.otpToken,
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
            setValue('username', route.params.username);
            setValue('password', route.params.password);
        }
    }, [route.params]);

    return (
        <AuthLayout text="Log In">
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
                            placeholder="Username"
                            error={errors.username && errors.username.message}
                        />
                    )}
                    name="username"
                    rules={{
                        required: 'Username is required',
                        pattern: {
                            value: Config.STRING_REGEX,
                            message: 'Username is invalid',
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
                                placeholder="Password"
                                error={
                                    errors.password && errors.password.message
                                }
                            />
                        )}
                        name="password"
                        rules={{
                            required: 'Password is required',
                            pattern: {
                                value: Config.STRING_REGEX,
                                message: 'Password is invalid',
                            },
                        }}
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
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>
            <PrimaryButton onPress={handleSubmit(onSubmit)} text="Log In" />
        </AuthLayout>
    );
};
