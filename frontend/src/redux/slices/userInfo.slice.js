import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import accountApi from 'apis/accountApi';
import { USER_ROLES } from 'constant';

export const getUserInfo = createAsyncThunk(
  'userInfo/getUserInfo',
  async () => {
    try {
      const apiRes = await accountApi.getUserInfo();
      if (apiRes && apiRes.status === 200) {
        return apiRes.data.user;
      }
      return {};
    } catch (error) {
      throw error;
    }
  },
);

const checkIsContributor = (role) =>
  [USER_ROLES.ADMIN, USER_ROLES.CONTRIBUTOR].includes(role);

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    isAuth: false,
    name: '',
    username: '',
    avt: '',
    favoriteList: [],
    coin: 0,
    role: '',
    isContributor: false,
  },
  reducers: {
    setAddFavorites(state, action) {
      const { word, isAdd = true } = action.payload;

      if (isAdd) {
        state.favoriteList.push(word);
      } else {
        state.favoriteList = state.favoriteList.filter((i) => i !== word);
      }
    },

    setUserCoin(state, action) {
      state.coin = action.payload;
    },

    setUserAvt(state, action) {
      state.avt = action.payload;
    },
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      const { username, name, avt, coin, favoriteList, role } = action.payload;
      if (!username || username === '') {
        state.isAuth = false;
        return;
      }
      return {
        isAuth: true,
        username,
        name,
        avt,
        coin,
        favoriteList,
        role,
        isContributor: checkIsContributor(role),
      };
    },
  },
});

const { reducer, actions } = userInfoSlice;
export const { setAddFavorites, setUserCoin, setUserAvt } = actions;
export default reducer;
