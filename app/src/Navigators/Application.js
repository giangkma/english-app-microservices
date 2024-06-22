import { ForgotPasswordScreen, LoginScreen, SignupScreen } from 'screens/auth';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from 'hooks';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
    FlashCardsScreen,
    HomeScreen,
    WordsScreen,
    UserInfoScreen,
    AccountsScreen,
    FeedbackScreen,
} from 'screens/main';
import { DrawerContent } from './DrawerContent';
import { navigationRef } from './utils';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// @refresh reset
export const ApplicationNavigator = () => {
    const { isLogged } = useAuth();
    console.disableYellowBox = true;
    useEffect(() => {
        SplashScreen.hide();
    });

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle="light-content" />

            {isLogged ? (
                <Drawer.Navigator
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: {
                            backgroundColor: '#505161',
                            width: 240,
                        },
                    }}
                    drawerContent={props => <DrawerContent {...props} />}
                >
                    <Drawer.Screen name="Home" component={HomeScreen} />
                    <Drawer.Screen
                        name="FlashCards"
                        component={FlashCardsScreen}
                    />
                    <Drawer.Screen name="Works" component={WordsScreen} />
                    <Drawer.Screen name="Accounts" component={AccountsScreen} />
                    <Drawer.Screen name="UserInfo" component={UserInfoScreen} />
                    <Drawer.Screen
                        name="Feedbacks"
                        component={FeedbackScreen}
                    />
                </Drawer.Navigator>
            ) : (
                <Stack.Navigator
                    initialRouteName={'Login'}
                    screenOptions={{ headerShown: false }}
                >
                    <React.Fragment>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPasswordScreen}
                        />
                    </React.Fragment>
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};
