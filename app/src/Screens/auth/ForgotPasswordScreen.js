import { ArrowLeft, Code, Email, Lock, Person } from 'assets';
import { Controller, useForm } from 'react-hook-form';
import {
    Layout,
    LoadingScreen,
    Modal,
    PrimaryButton,
    StyledTextInput,
} from 'screens';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import { Config } from 'config';
import { accountApi } from 'apis';
import { navigate } from 'navigators/utils';
import { showAlert } from 'utilities';

export const ForgotPasswordScreen = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {},
    });

    const [username, setUsername] = useState('giangdt');
    const [isSendCodeSuccess, setIsSendCodeSuccess] = useState(false);
    const [isResetSuccess, setResetSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSendCode = async () => {
        try {
            setLoading(true);
            const { message } = await accountApi.getSendVerifyCode(username);
            setIsSendCodeSuccess(true);
            showAlert(message, 'Success');
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onResetPassword = async data => {
        try {
            setLoading(true);
            const { code, password } = data;
            await accountApi.postResetPassword({
                username,
                password,
                verifyCode: code,
            });
            setResetSuccess(true);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onLoginWithNewPassword = () => {
        setResetSuccess(false);
        navigate('Login', {
            username,
            password: getValues('password'),
        });
    };

    return (
        <Layout bg2>
            {loading && <LoadingScreen />}
            <Modal
                visible={isResetSuccess}
                text="Reset successful"
                description="You can login now with this new password!"
                agreeButton={{
                    text: 'Login now',
                    onPress: onLoginWithNewPassword,
                }}
                loading={loading}
            />
            <View width="100%" flex paddingB-50 paddingH-32>
                <TouchableOpacity onPress={() => navigate('Login')}>
                    <ArrowLeft />
                </TouchableOpacity>
                <ScrollView>
                    <View paddingH-8 paddingV-24>
                        <Text white fs24 fw9 font-black>
                            Bạn quên mật khẩu?
                        </Text>
                    </View>
                    {isSendCodeSuccess ? (
                        <>
                            <View paddingH-8 marginB-20>
                                <Text white fs15 fw5 font-medium>
                                    Tạo mật khẩu mới cho tài khoản:
                                </Text>
                                <Text wildWatermelonRed fs15 fw7 font-bold>
                                    {username}
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <StyledTextInput
                                        icon={<Lock />}
                                        value={value}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        placeholder="New password"
                                        type="password"
                                        error={
                                            errors.password &&
                                            errors.password.message
                                        }
                                    />
                                )}
                                name="password"
                                rules={{
                                    required: 'Bạn phải điền mật khẩu',
                                    pattern: {
                                        value: Config.STRING_REGEX,
                                        message: 'Mật khẩu không hợp lệ',
                                    },
                                }}
                            />
                            <View marginT-10>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <StyledTextInput
                                            icon={<Lock />}
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            placeholder="Nhập lại mật khẩu"
                                            type="password"
                                            error={
                                                errors.confirm_password &&
                                                errors.confirm_password.message
                                            }
                                        />
                                    )}
                                    name="confirm_password"
                                    rules={{
                                        required: 'Bạn phải điền lại mật khẩu',
                                        pattern: {
                                            value: Config.STRING_REGEX,
                                            message: 'Mật khẩu không hợp lệ',
                                        },
                                        validate: value => {
                                            if (
                                                value !== getValues('password')
                                            ) {
                                                return 'Mật khẩu không khớp';
                                            }
                                        },
                                    }}
                                />
                            </View>
                            <View marginT-10>
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
                                            placeholder="Code"
                                            error={
                                                errors.code &&
                                                errors.code.message
                                            }
                                        />
                                    )}
                                    name="code"
                                    rules={{
                                        required: 'Bạn phải điền mã Code',
                                        pattern: {
                                            value: Config.NUMBER_REGEX,
                                            message: 'Mã Code không hợp lệ',
                                        },
                                    }}
                                />
                            </View>
                            <View row right marginT-15 marginB-26>
                                <Text white fs15 fw3 font-light>
                                    Tôi không nhận được mã Code?
                                </Text>
                                <TouchableOpacity onPress={onSendCode}>
                                    <Text
                                        wildWatermelonRed
                                        fs15
                                        fw7
                                        font-bold
                                        marginL-10
                                    >
                                        Gửi lại
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <StyledTextInput
                            icon={<Person />}
                            value={username}
                            placeholder="Email"
                            onChange={setUsername}
                        />
                    )}
                </ScrollView>
                <View>
                    {isSendCodeSuccess ? (
                        <PrimaryButton
                            onPress={handleSubmit(onResetPassword)}
                            text="Thay đổi mật khẩu"
                        />
                    ) : (
                        <PrimaryButton onPress={onSendCode} text="Gửi Code" />
                    )}
                    <View row center marginT-24>
                        <Text white fs15 fw5 font-medium>
                            Bạn chưa có tài khoản?
                        </Text>
                        <TouchableOpacity onPress={() => navigate('Signup')}>
                            <Text
                                wildWatermelonRed
                                fs15
                                fw7
                                font-bold
                                marginL-10
                            >
                                Đăng Ký
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Layout>
    );
};
