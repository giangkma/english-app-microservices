import { Modal } from 'components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Slider, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { getFlashCardsSettings, setSettings } from 'store/flashCards';
import { scaleSize } from 'utilities';
import Tts from 'react-native-tts';

export const FlashCardSettings = ({ visible, onClose }) => {
    const settings = useSelector(getFlashCardsSettings);
    const { speed, cardSpeed } = settings;

    const dispatch = useDispatch();

    const onChangeRate = newValue => {
        Tts.setDefaultRate(newValue);
        dispatch(setSettings(newValue));
    };
    const onChangeSpeed = newValue => {
        dispatch(setSettings(newValue));
    };

    return (
        <Modal visible={visible} text={'Settings'} iconClose onClose={onClose}>
            <Text fs15 font-semibold white>
                Sound rate: {speed}
            </Text>
            <Slider
                minimumTrackTintColor={'#fff'}
                maximumTrackTintColor={'#303030'}
                thumbStyle={styles.thumb}
                value={speed}
                minimumValue={0.25}
                step={0.5}
                maximumValue={2}
                onValueChange={val => onChangeRate({ speed: val })}
            />
            <Text fs15 font-semibold white marginT-15>
                Card transfer speed: {cardSpeed}s
            </Text>
            <Slider
                minimumTrackTintColor={'#fff'}
                maximumTrackTintColor={'#303030'}
                thumbStyle={styles.thumb}
                value={cardSpeed}
                minimumValue={2}
                step={0.5}
                maximumValue={10}
                onValueChange={val => onChangeSpeed({ cardSpeed: Number(val) })}
            />
            <View marginB-20 />
        </Modal>
    );
};

const styles = StyleSheet.create({
    thumb: {
        width: scaleSize(8),
        height: scaleSize(8),
        backgroundColor: '#fff',
        color: '#fff',
    },
});
