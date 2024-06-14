import { ArrowLeft, Code, Email, Lock } from 'assets';
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

import { accountApi } from 'apis';
import { navigate } from 'navigators/utils';
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
                text="Thay đổi mật khẩu"
                agreeButton={{
                    text: 'Lưu',
                    onPress: handleSubmit(onResetPassword),
                }}
                cancelButton={{
                    text: 'Đóng',
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
                            placeholder="Mật khẩu cũ"
                            type="password"
                            error={
                                errors.old_password &&
                                errors.old_password.message
                            }
                        />
                    )}
                    name="old_password"
                    rules={{ required: 'Bạn phải nhập mật khẩu cũ' }}
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
                                placeholder="Mật khẩu mới"
                                type="password"
                                error={
                                    errors.new_password &&
                                    errors.new_password.message
                                }
                            />
                        )}
                        name="new_password"
                        rules={{
                            required: 'Bạn phải nhập mật khẩu mới',
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
                                placeholder="Nhập lại mật khẩu mới"
                                type="password"
                                error={
                                    errors.confirm_password &&
                                    errors.confirm_password.message
                                }
                            />
                        )}
                        name="confirm_password"
                        rules={{
                            required: 'Bạn phải nhập lại mật khẩu mới',
                            validate: value => {
                                if (value !== getValues('new_password')) {
                                    return 'Mật khẩu không khớp';
                                }
                            },
                        }}
                    />
                </View>
            </Modal>
        </>
    );
};
