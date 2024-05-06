import { StackLayout } from 'components/layouts';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { getFlashCardsTopics } from 'store/flashCards';
import { FlashCardInfo } from '../components';

export const FlashCardsScreen = () => {
    const topics = useSelector(getFlashCardsTopics);

    return (
        <StackLayout navigateTo={'Home'}>
            <View marginT-15 width={'100%'} height={'100%'}>
                {topics.map((topic, index) => {
                    return <FlashCardInfo key={index} topic={topic} />;
                })}
            </View>
        </StackLayout>
    );
};
