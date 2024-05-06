import { StackLayout } from 'components/layouts';
import { View } from 'react-native-ui-lib';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FavoriteWordCard } from '../components';
import { showAlert } from 'utilities';
import { accountApi, wordApi } from 'apis';
import { LoadingScreen } from 'components';
import { useAuth } from 'hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
    getFavoriteList,
    removeWordFromFavoriteList,
    setFavoriteList,
} from 'store/auth';

export const FavoriteWordsScreen = () => {
    const { data, total } = useSelector(getFavoriteList);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const dispatch = useDispatch();
    const per = useRef(10);

    const onUnFavoriteWord = async word => {
        try {
            setLoading(true);
            await accountApi.putToggleWordFavorite({
                username: user.username,
                word,
            });
            dispatch(removeWordFromFavoriteList(word));
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getFavoriteWords = useCallback(async () => {
        try {
            setLoading(true);
            if (per.current >= total) return;
            per.current = per.current + 10;
            const { packList, total: t } = await wordApi.getUserFavoriteList(
                1,
                per.current,
            );
            dispatch(setFavoriteList({ packList, total: t }));
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            per.current = data.length;
        }
    }, [data])

    return (
        <StackLayout
            scrollBottom={getFavoriteWords}
            textCenter="Your favorite words"
            navigateTo={'Home'}
        >
            {loading && <LoadingScreen />}
            <View marginT-15 width={'100%'} height={'100%'}>
                {data?.map((word, index) => {
                    return (
                        <FavoriteWordCard
                            key={index}
                            favoriteWord={word}
                            onUnFavoriteWord={onUnFavoriteWord}
                        />
                    );
                })}
            </View>
        </StackLayout>
    );
};
