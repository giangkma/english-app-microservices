import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from './auth';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import flashCards from './flashCards';
import theme from './theme';

const reducers = combineReducers({
    theme,
    auth,
    flashCards,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'flashCards'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        });

        if (__DEV__ && !process.env.JEST_WORKER_ID) {
            const createDebugger = require('redux-flipper').default;
            middlewares.push(createDebugger());
        }

        return middlewares;
    },
});

const persistor = persistStore(store);

export { store, persistor };
