import { Code } from 'assets';
import { Controller, useForm } from 'react-hook-form';
import { Modal, StyledTextInput } from 'screens';
import { showAlert } from 'utilities';
import React, { useState, useEffect } from 'react';
import { Config } from 'config';
import { twoFAApi } from 'apis';
import { useDispatch } from 'react-redux';

export const Disable2FAModal = ({ visible, onClose, onDisabled }) => {
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {},
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async ({ otpToken }) => {
        try {
            setLoading(true);
            await twoFAApi.disable(otpToken);
            showAlert(
                'You have disabled Two-Factor Authentication !',
                'Success',
            );
            onDisabled();
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                visible={visible}
                text="Disable 2FA"
                description="Please enter OTP code here !"
                agreeButton={{
                    text: 'Submit',
                    onPress: handleSubmit(onSubmit),
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
                            icon={<Code />}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="OTP Code"
                            error={errors.otpToken && errors.otpToken.message}
                        />
                    )}
                    name="otpToken"
                    rules={{
                        required: 'OTP Code is required',
                        pattern: {
                            value: Config.NUMBER_REGEX,
                            message: 'OPT Code is invalid',
                        },
                    }}
                />
            </Modal>
        </>
    );
};
