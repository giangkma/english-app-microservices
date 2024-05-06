import { getUser, onLogout } from 'store/auth';
import { useDispatch, useSelector } from 'react-redux';
import { tokenStorage } from 'utilities';
import { useEffect } from 'react';

export const useAuth = () => {
    const user = useSelector(getUser);
    const token = tokenStorage.get();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user || !token) {
            dispatch(onLogout());
        }
    }, [token, user]);

    return {
        isLogged: !!token && !!user,
        user,
    };
};
