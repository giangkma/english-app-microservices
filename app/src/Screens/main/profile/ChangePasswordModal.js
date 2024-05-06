import { accountApi } from 'apis';
import { ArrowLeft, Code, Email, Lock } from 'assets';
import { navigate } from 'navigators/utils';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import {
    Layout,
    LoadingScreen,
    Modal,
    PrimaryButton,
    StyledTextInput,
} from 'screens';
import { showAlert } from 'utilities';

export const ChangePasswordModal = ({ visible, onClose }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {},
    });

    const [loading, setLoading] = useState(false);

    const onResetPassword = async data => {
        try {
            setLoading(true);
            console.log(data);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingScreen />}
            <Modal
                visible={visible}
                text="Reset successful"
                agreeButton={{
                    text: 'Save',
                    onPress: handleSubmit(onResetPassword),
                }}
                cancelButton={{
                    text: 'Cancel',
                    onPress: onClose,
                }}
                loading={loading}
            >
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledTextInput
                            icon={<Lock />}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Old password"
                            type="password"
                            error={
                                errors.old_password &&
                                errors.old_password.message
                            }
                        />
                    )}
                    name="old_password"
                    rules={{ required: 'Old Password is required' }}
                />
                <View marginT-10>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <StyledTextInput
                                icon={<Lock />}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                placeholder="New password"
                                type="password"
                                error={
                                    errors.new_password &&
                                    errors.new_password.message
                                }
                            />
                        )}
                        name="new_password"
                        rules={{
                            required: 'New Password is required',
                        }}
                    />
                </View>
                <View marginV-10>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <StyledTextInput
                                icon={<Lock />}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                placeholder="Confirm password"
                                type="password"
                                error={
                                    errors.confirm_password &&
                                    errors.confirm_password.message
                                }
                            />
                        )}
                        name="confirm_password"
                        rules={{
                            required: 'Confirm Password is required',
                            validate: value => {
                                if (value !== getValues('new_password')) {
                                    return 'Confirm Password is not match';
                                }
                            },
                        }}
                    />
                </View>
            </Modal>
        </>
    );
};
