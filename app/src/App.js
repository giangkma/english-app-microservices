import 'react-native-gesture-handler';
import './translations';
// ui config
import './theme/FoundationConfig';
import './theme/ComponentsConfig';

import { persistor, store } from 'store';

import { ApplicationNavigator } from 'navigators/Application';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
export const App = () => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ApplicationNavigator />
        </PersistGate>
    </Provider>
);
