import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'flashCards',
    initialState: {
        topics: [],
        settings: {
            speed: 1,
            cardSpeed: 3,
        },
    },
    reducers: {
        setTopics: (state, { payload: topics }) => {
            state.topics = topics;
        },
        setSettings: (state, { payload: settings }) => {
            state.settings = {
                ...state.settings,
                ...settings,
            };
        },
        // update words learned
        learnedWord: (state, { payload: { topicId, wordId } }) => {
            // check if the wordIdsLearned has the wordId
            const wordIdsLearned = state.topics.find(
                topic => topic.topicId === topicId,
            ).wordIdsLearned;
            if (wordIdsLearned.includes(wordId)) {
                return;
            }
            // add the wordId to the wordIdsLearned
            state.topics
                .find(topic => topic.topicId === topicId)
                .wordIdsLearned.push(wordId);
        },
    },
});

export const { setTopics, learnedWord, setSettings } = slice.actions;

export const getFlashCardsTopics = state => state.flashCards.topics;
export const getFlashCardsSettings = state => state.flashCards.settings;

export default slice.reducer;
