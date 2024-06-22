import { LoadingScreen, StackLayout } from 'components';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import { StyledTextInput } from 'screens';

import { accountApi } from 'apis';
import { Colors } from 'assets/Colors';
import { navigate } from 'navigators/utils';
import { formatDateToDisplay, showAlert } from 'utilities';

import { ActivityIndicator, Image, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { images } from 'assets/Images';
import { Search } from 'assets';
import { useDebounce } from 'hooks';

const ACCOUNT_ROLES = {
    USER: 'Người dùng',
    CONTRIBUTOR: 'Người đóng góp',
};

const ACCOUNT_TABS = [
    {
        sceen: 'Users',
        name: ACCOUNT_ROLES.USER,
    },
    {
        sceen: 'Contributors',
        name: ACCOUNT_ROLES.CONTRIBUTOR,
    },
];

const useAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountDelete, setAccountDelete] = useState(undefined);
    const [tabSelected, setTabSelected] = useState(ACCOUNT_ROLES.USER);
    const { control, watch } = useForm();

    const searchValue = watch('search');
    const searchDebounce = useDebounce(searchValue, 500);

    const getUsers = async () => {
        try {
            setLoading(true);
            const accounts = await accountApi.getAllAccounts(
                tabSelected === ACCOUNT_ROLES.CONTRIBUTOR,
                searchDebounce,
            );
            setAccounts(accounts);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onUpdateStatus = async (accountId, active) => {
        try {
            setLoading(true);
            await accountApi.updateStatus(accountId, active);
            setAccounts(
                accounts.map(i =>
                    i.accountId === accountId ? { ...i, active } : i,
                ),
            );
            showAlert(
                'Đã thay đổi trạng thái của tài khoản',
                'Cập nhật thành công',
            );
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onUpdateContributorList = async (accountId, isContributor) => {
        try {
            setLoading(true);
            await accountApi.updateContributorList(accountId, isContributor);
            setAccounts(accounts.filter(i => i.accountId !== accountId));
            showAlert(
                'Đã thay đổi trạng thái của tài khoản',
                'Cập nhật thành công',
            );
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, [tabSelected, searchDebounce]);

    return {
        accounts,
        loading,
        accountDelete,
        setAccountDelete,
        tabSelected,
        setTabSelected,
        onUpdateStatus,
        onUpdateContributorList,
        control,
    };
};

export const AccountsScreen = () => {
    const {
        control,
        accounts,
        loading,
        accountDelete,
        setAccountDelete,
        tabSelected,
        setTabSelected,
        onUpdateStatus,
        onUpdateContributorList,
    } = useAccounts();

    const onGoBack = () => {
        navigate('Home');
    };

    return (
        <StackLayout
            scroll={false}
            navigateFnc={onGoBack}
            textCenter={'Quản lý người dùng'}
        >
            {loading && <LoadingScreen />}
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 15,
                        padding: 10,
                        flexDirection: 'row',
                    }}
                >
                    {ACCOUNT_TABS.map(i => {
                        return (
                            <TouchableOpacity
                                style={{
                                    backgroundColor:
                                        tabSelected === i.name
                                            ? Colors.darkLinear
                                            : 'white',
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                                key={i.sceen}
                                onPress={() => {
                                    setTabSelected(i.name);
                                }}
                            >
                                <Text>{i.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <View marginT-20>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledTextInput
                            value={value}
                            icon={<Search />}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Tìm kiếm người dùng"
                        />
                    )}
                    name="search"
                />
            </View>
            {accounts.length === 0 && !loading && (
                <View centerV centerH marginT-20>
                    <Text white fs16>
                        Không có dữ liệu
                    </Text>
                </View>
            )}
            <ScrollView>
                <View marginT-25 marginB-20>
                    {accounts?.map(item => {
                        const isContributor = item.role === 'contributor';
                        return (
                            <Card
                                style={{ position: 'relative' }}
                                padding-20
                                marginB-15
                                paddingB-10
                            >
                                <TouchableOpacity
                                    flex
                                    center
                                    style={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 5,
                                        zIndex: 20,
                                    }}
                                >
                                    <Switch
                                        onColor={'green'}
                                        value={item.active}
                                        onValueChange={value => {
                                            onUpdateStatus(
                                                item.accountId,
                                                value,
                                            );
                                        }}
                                    />
                                </TouchableOpacity>
                                <View row centerV>
                                    <Image
                                        defaultSource={images.defaultAvatar}
                                        source={{ uri: item.avt }}
                                        style={{ width: 80, height: 80 }}
                                        loader={<ActivityIndicator />}
                                    />
                                    <View
                                        marginL-10
                                        style={{
                                            width: 240,
                                        }}
                                    >
                                        <Text
                                            fs18
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.name}
                                        </Text>
                                        <Text fs13 wildWatermelonRed>
                                            {item.username}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Email: </Text>
                                            {item.email}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Số coin: </Text>
                                            {item.coin}
                                        </Text>
                                        <Text fs13>
                                            <Text fs12>Tham gia vào: </Text>
                                            {formatDateToDisplay(
                                                item.createdDate,
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <Button
                                    marginT-10
                                    flex-1
                                    onPress={() => {
                                        onUpdateContributorList(
                                            item.accountId,
                                            !isContributor, // toggle value
                                        );
                                    }}
                                    {...(isContributor
                                        ? { 'bg-error': true }
                                        : { 'bg-success': true })}
                                >
                                    <Text white>
                                        {isContributor
                                            ? 'Xoá khỏi danh sách người đóng góp'
                                            : 'Cho phép là người đóng góp'}
                                    </Text>
                                </Button>
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>
        </StackLayout>
    );
};
