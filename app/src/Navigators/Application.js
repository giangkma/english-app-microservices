import { LoginScreen, SignupScreen, ForgotPasswordScreen } from 'screens/auth';

import {
    HomeScreen,
    FlashCardsScreen,
    FlashCardsDetailScreen,
    UserInfoScreen,
    GamesScreen,
    GameModeScreen,
    PuzzleGameScreen,
    GameOverScreen,
    RankScreen,
    FavoriteWordsScreen,
} from 'screens/main';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { navigationRef } from './utils';
import { useAuth } from 'hooks';
import SplashScreen from 'react-native-splash-screen';
import { DrawerContent } from './DrawerContent';
import SoccerGameScreen from 'screens/main/games/SoccerGameScreen';

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
                    <Drawer.Screen name="Rank" component={RankScreen} />
                    <Drawer.Screen
                        name="FlashCardsDetail"
                        component={FlashCardsDetailScreen}
                    />
                    <Drawer.Screen name="UserInfo" component={UserInfoScreen} />
                    <Drawer.Screen name="Games" component={GamesScreen} />
                    <Drawer.Screen name="Puzzle" component={PuzzleGameScreen} />
                    <Drawer.Screen name="Soccer" component={SoccerGameScreen} />
                    <Drawer.Screen name="GameMode" component={GameModeScreen} />
                    <Drawer.Screen name="GameOver" component={GameOverScreen} />
                    <Drawer.Screen
                        name="FavoriteWords"
                        component={FavoriteWordsScreen}
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
