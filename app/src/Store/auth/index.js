import { tokenStorage } from 'utilities';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { accountApi } from 'apis';

const slice = createSlice({
    name: 'auth',
    initialState: { user: undefined, favoriteList: [], totalFavorites: 0 },
    reducers: {
        onLogout: state => {
            tokenStorage.clear();
            state.user = undefined;
            state.favoriteList = [];
            state.totalFavorites = 0;
        },
        setUser: (state, { payload: user }) => {
            state.user = {
                ...state.user,
                ...user,
            };
        },
        setFavoriteList: (state, { payload: { packList, total } }) => {
            state.favoriteList = packList;
            state.totalFavorites = total;
        },
        addWordToFavoriteList: (state, { payload: word }) => {
            state.favoriteList.unshift(word);
            state.totalFavorites += 1;
        },
        removeWordFromFavoriteList: (state, { payload: word }) => {
            state.favoriteList = state.favoriteList.filter(
                w => w.word !== word,
            );
            state.totalFavorites -= 1;
        },
    },
});

export const {
    onLogout,
    setUser,
    setFavoriteList,
    addWordToFavoriteList,
    removeWordFromFavoriteList,
} = slice.actions;

export const getUser = state => state.auth.user;
export const getFavoriteList = state => ({
    data: state.auth.favoriteList,
    total: state.auth.totalFavorites,
});

export const getUserThunk = createAsyncThunk(
    'users/getUserThunk',
    async (_, thunkAPI) => {
        const { user } = await accountApi.getUserInfo();
        const account = await accountApi.getUserProfile();
        thunkAPI.dispatch(
            setUser({
                ...user,
                ...account,
            }),
        );
    },
);

export default slice.reducer;
