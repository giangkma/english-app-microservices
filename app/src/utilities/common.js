import {
    Person0,
    Person1,
    Person10,
    Person2,
    Person3,
    Person4,
    Person5,
    Person6,
    Person7,
    Person8,
    Person9,
} from 'assets';

import { Alert } from 'react-native';
import React from 'react';

export const showAlert = (subTitle, title = 'Error') => {
    Alert.alert(title, subTitle);
};

export const getInitials = string => {
    if (!string) return '';
    const names = string.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

export const randomPersonIcon = () => {
    const personIcons = [<Person0 />, <Person1 />, <Person2 />];
    const randomIndex = Math.floor(Math.random() * personIcons.length);
    return personIcons[randomIndex];
};

export const formatDateToDisplay = date => {
    const d = new Date(date);
    // format: 01/01/2021
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};
