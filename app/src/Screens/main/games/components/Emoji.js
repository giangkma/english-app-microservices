import { Colors } from 'assets/Colors';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated } from 'react-native';

const scored = ['👍', '👏', '👋', '😎', '💪'];
        const missed = ['😢', '😭', '😔', '😡', '😠'];

class Emoji extends Component {
    render () {
        const randomIndex = Math.floor(Math.random() * 5);
        let emojiChar = '';
        if (this.props.lost === true) {
            emojiChar = missed[randomIndex];
        } else {
            emojiChar = scored[randomIndex];
        }
        const windowWidth = Dimensions.get('window').width;
        const position = {
            width: windowWidth,
            top: this.props.y,
        };
        return (
            <View style={[styles.container, position]}>
                <Text style={styles.emoji}>{emojiChar}</Text>
            </View>
        );
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (
            nextProps.score !== this.props.score ||
            nextProps.lost !== this.props.lost
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    emoji: {
        flex: 1,
        fontSize: 25,
        color: Colors.white,
    },
});

export default Emoji;
