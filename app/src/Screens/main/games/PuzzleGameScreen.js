import { useFocusEffect } from '@react-navigation/native';
import { gameApi, rankApi } from 'apis';
import { LoadingScreen, StackLayout } from 'components';
import { Config } from 'config';
import { navigate } from 'navigators/utils';
import React, { useEffect, useState, useCallback } from 'react';

import { showAlert } from 'utilities';
import { SplitWord } from '../components';

export const PuzzleGameScreen = ({ route }) => {
    const { mode, topic } = route.params;
    const isRankingMode = mode === 'Ranking mode';

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState();
    const [state, setState] = useState({
        current: 0,
        nRight: 0,
        nWrong: 0,
    });

    const { current, nRight, nWrong } = state;

    const handleCorrect = () => {
        setState({
            ...state,
            nRight: nRight + 1,
        });
    };

    const handleWrong = () => {
        setState({ ...state, nWrong: nWrong + 1 });
    };

    const handleNextWord = () => {
        setState({
            ...state,
            current: current + 1,
        });
    };

    const postRankingLogsInDay = async () => {
        try {
            if (!isRankingMode) return;
            rankApi.postRankLog(Config.GAMES.PUZZLE);
        } catch (error) {
            showAlert(error.message);
        }
    };

    const getWordPack = async () => {
        try {
            setLoading(true);
            let listWords;
            if (isRankingMode) {
                const { wordPack } = await gameApi.getWordPackWordMatch({
                    topics: [3],
                });
                listWords = wordPack;
            } else {
                const { wordPack } = await gameApi.getWordPackWordMatch({
                    topics: [topic?.topicId],
                });
                listWords = wordPack;
            }
            setList(listWords);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getWordPack();
            postRankingLogsInDay();
            setList([]);
            setState({
                current: 0,
                nRight: 0,
                nWrong: 0,
            });
        }, [mode]),
    );

    return (
        <StackLayout navigateTo="Games" scroll={false} textCenter={mode}>
            {loading && <LoadingScreen />}
            {list && list.length > 0 ? (
                isRankingMode ? (
                    <SplitWord
                        mean={list[current].mean}
                        word={list[current].word}
                        onCorrect={handleCorrect}
                        onWrong={handleWrong}
                        onNext={handleNextWord}
                        nRight={nRight}
                        nWrong={nWrong}
                        isRankingMode
                    />
                ) : (
                    <SplitWord
                        mean={list[current].mean}
                        word={list[current].word}
                        onCorrect={handleCorrect}
                        onWrong={handleWrong}
                        onNext={handleNextWord}
                        nRight={nRight}
                        nWrong={nWrong}
                    />
                )
            ) : null}
        </StackLayout>
    );
};
