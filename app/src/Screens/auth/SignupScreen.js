import { accountApi } from 'apis';
import { Code, Email, Lock, Person } from 'assets';
import { navigate } from 'navigators/utils';
import { LoadingScreen, PrimaryButton, StyledTextInput } from 'screens';
import { showAlert } from 'utilities';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native-ui-lib';
import { AuthLayout } from './components';
import { Config } from 'config';

export const SignupScreen = () => {
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        try {
            setLoading(true);
            await accountApi.postRegisterAccount({
                email: data.email.toLowerCase(),
                name: data.name,
                password: data.password,
                username: data.username.toLowerCase(),
            });
            navigate('Login', {
                username: data.username.toLowerCase(),
                password: data.password,
            });
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout text="Register">
            {loading && <LoadingScreen />}
            <View marginB-27>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledTextInput
                            icon={<Person />}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Full Name"
                            error={errors.name && errors.name.message}
                        />
                    )}
                    name="name"
                    rules={{ required: 'Full Name is required' }}
                />
                <View marginV-10>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <StyledTextInput
                                icon={<Code />}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                placeholder="Username"
                                error={
                                    errors.username && errors.username.message
                                }
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
                </View>
                <View marginB-10>
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
                            required: 'Email is required',
                            pattern: {
                                value: Config.EMAIL_REGEX,
                                message: 'Email is invalid',
                            },
                        }}
                    />
                </View>
                <View marginB-10>
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
            </View>
            <PrimaryButton onPress={handleSubmit(onSubmit)} text="Register" />
        </AuthLayout>
    );
};
