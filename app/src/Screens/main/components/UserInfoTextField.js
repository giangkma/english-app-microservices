import { Text, TextField, View } from 'react-native-ui-lib';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from 'assets/Colors';

export const UserInfoTextField = ({
    value,
    onBlur,
    onChange,
    label,
    type,
    placeholder,
    error,
    editable = true,
}) => {
    return (
        <>
            <View
                marginB-5
                marginT-5
                row
                center
                paddingV-5
                paddingH-20
                style={[styles.container, !editable && styles.disabled]}
            >
                <View flex-1>
                    <Text fs-16 style={styles.label}>
                        {label}
                    </Text>
                </View>
                <View flex-2>
                    <TextField
                        fs-16
                        secureTextEntry={type === 'password'}
                        hideUnderline
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        style={[
                            styles.input,
                            !editable && styles.disabledInput,
                        ]}
                        editable={editable}
                    />
                </View>
            </View>
            {error && (
                <Text error marginT-2 marginB-5>
                    {error}
                </Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.greyLinear,
        width: '100%',
        position: 'relative',
    },
    label: {
        fontWeight: '300',
        fontSize: 16,
        color: Colors.greyChateau,
    },
    input: {
        marginBottom: -15,
        marginTop: 15,
        width: '100%',
        color: '#FFF',
        fontWeight: '500',
        height: '100%',
    },
    disabled: {
        backgroundColor: '#34495e',
    },
    disabledInput: {
        color: '#FFFFFF50',
    },
});
