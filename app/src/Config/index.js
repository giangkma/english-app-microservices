export const Config = {
    // API_URL: 'http://10.0.2.2:8000',
    API_URL: 'http://localhost:8000',
    NUM_WORDS_PREVIEW: 5,
    REVIEW_STATUS_LOGS: {
        FINISHED: 'finished',
        UN_FINISHED: 'un-finished',
        CANCELLED: 'cancelled',
    },
    MAX_RANKING_OF_DAY: 1,
    GAMES: {
        PUZZLE: 'puzzle',
    },
    LIMIT: 10,
    MAX_WRONG_ANSWER: 3,
    POINT_OF_RIGHT_ANSWER: 10,
    STRING_REGEX: /^[a-zA-Z0-9]*$/,
    NUMBER_REGEX: /^[0-9]*$/,
    EMAIL_REGEX:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
};
