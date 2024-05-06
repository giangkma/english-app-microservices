import { Colors } from 'assets/Colors';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

class Score extends Component {
    render () {
        const windowWidth = Dimensions.get('window').width;
        const containerPosition = {
            top: this.props.y,
            width: windowWidth,
        };

        return (
            <View style={[styles.container, containerPosition]}>
                <Text style={styles.score}>{this.props.score}</Text>
            </View>
        );
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (
            nextProps.score !== this.props.score
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    score: {
        fontSize: 100,
        fontWeight: '100',
        flex: 1,
        color: Colors.white
    },
});

export default Score;
