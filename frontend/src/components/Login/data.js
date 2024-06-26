import accountApi from 'apis/accountApi';
import { UX } from 'constant';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import Login from './index';
import { tokenStorage } from 'configs/token';

function LoginData() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (account) => {
    try {
      setLoading(true);
      const { email, password } = account;

      const apiRes = await accountApi.postLogin(email.toLowerCase(), password);
      if (apiRes && apiRes.status === 200) {
        const { data } = apiRes;
        tokenStorage.set(data.token);
        dispatch(
          setMessage({ message: 'Đăng nhập thành công', type: 'success' }),
        );

        setTimeout(() => {
          window.location.href = '/';
        }, UX.DELAY_TIME);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Thất bại, thử lại !';
      console.log(error);
      dispatch(setMessage({ message, type: 'error' }));
      setLoading(false);
    }
  };

  return <Login onLogin={handleLogin} loading={loading} />;
}

export default LoginData;
