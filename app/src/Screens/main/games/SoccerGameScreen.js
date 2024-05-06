import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Score from './components/Score';
import Emoji from './components/Emoji';
import SoccerIcon from '../../../assets/images/soccer.png';
import { Layout, LoadingScreen, PrimaryButton } from 'components';
import { navigate } from 'navigators/utils';
import { showAlert } from 'utilities';
import { rankApi } from 'apis';
import { Colors } from 'assets/Colors';
import Sound from 'react-native-sound';
import audioLost from '../../../assets/audios/lost.mp3';

const LC_IDLE = 0;
const LC_TAPPED = 2;
const GRAVITY = 0.8;
const TAPPED_VELOCITY = 20;
const ROTATION_FACTOR = 7;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const BALL_WIDTH = SCREEN_WIDTH * 0.33;
const BALL_HEIGHT = SCREEN_WIDTH * 0.33;
const FLOOR_Y = SCREEN_HEIGHT - BALL_HEIGHT;
const FLOOR_X = SCREEN_WIDTH / 2;
const SCORE_Y = SCREEN_HEIGHT / 6;
const EMOJI_Y = SCREEN_HEIGHT / 3;

class SoccerGameScreen extends Component {
    constructor (props) {
        super(props);
        this.interval = null;
        this.state = {
            x: FLOOR_X,
            y: FLOOR_Y,
            vx: 0,
            vy: 0,
            lifeCycle: LC_IDLE,
            score: 0,
            lost: false,
            rotate: 0,
            ranks: [],
            rankOfUser: null,
            loading: false,
        };
    }

    sound = new Sound(audioLost);

    playSound = () => {
        this.sound?.play()
    }

    componentDidMount () {
        this.interval = setInterval(this.update.bind(this), 1000 / 60);
        this.getRanks();
    }

    componentWillUnmount () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    onTap (event) {
        this.playSound();
        // this.setState({
        //     scored: false,
        // });
        // const centerX = BALL_WIDTH / 2;
        // const centerY = BALL_HEIGHT / 2;
        // const velocityX =
        //     ((centerX - event.locationX) / SCREEN_WIDTH) * TAPPED_VELOCITY;
        // const velocityY = -TAPPED_VELOCITY;
        // this.setState({
        //     vx: velocityX,
        //     vy: velocityY,
        //     score: this.state.score + 1,
        //     lifeCycle: LC_TAPPED,
        //     lost: false,
        // });
        // return false;
    }

    updatePosition (nextState) {
        nextState.x += nextState.vx;
        nextState.y += nextState.vy;
        nextState.rotate += ROTATION_FACTOR * nextState.vx;
        // Hit the left wall
        if (nextState.x < BALL_WIDTH / 2) {
            nextState.vx = -nextState.vx;
            nextState.x = BALL_WIDTH / 2;
        }

        // Hit the right wall
        if (nextState.x > SCREEN_WIDTH - BALL_WIDTH / 2) {
            nextState.vx = -nextState.vx;
            nextState.x = SCREEN_WIDTH - BALL_WIDTH / 2;
        }

        // Reset after falling down
        if (nextState.y > SCREEN_HEIGHT - BALL_HEIGHT / 2) {
            nextState.y = FLOOR_Y;
            nextState.x = FLOOR_X;
            nextState.lifeCycle = LC_IDLE;
            nextState.score = 0;
            nextState.lost = true;
            nextState.loading = true;
            this.updateScore();
        }
    }

    async getRanks () {
        try {
            this.setState({ loading: true });
            const { ranks, rankOfUser } = await rankApi.getRanks('soccer');
            this.setState({
                ranks,
                rankOfUser,
            });
        } catch (error) {
            showAlert(error.message);
        } finally {
            this.setState({ loading: false });
        }
    }

    async updateScore () {
        try {
            if (this.state.score !== 0) {
                await rankApi.putScore('soccer', this.state.score);
                this.getRanks();
            }
        } catch (error) {
            showAlert(error.message);
        } finally {
            this.setState({ loading: false });
        }
    }

    updateVelocity (nextState) {
        nextState.vy += GRAVITY;
    }

    update () {
        if (this.state.lifeCycle === LC_IDLE) {
            return;
        }

        const nextState = Object.assign({}, this.state);

        this.updatePosition(nextState);
        this.updateVelocity(nextState);

        this.setState(nextState);
    }

    render () {
        const position = {
            left: this.state.x - BALL_WIDTH / 2,
            top: this.state.y - BALL_HEIGHT / 2,
        };
        const rotation = {
            transform: [{ rotate: this.state.rotate + 'deg' }],
        };
        return (
            <Layout bg3>
                <View
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                    }}
                >
                    <Text style={{ color: Colors.white }}>
                        Top 1 : {this.state.ranks?.[0]?.score || 0}
                        {this.state.rankOfUser &&
                            this.state.rankOfUser.rank === 1 && (
                                <Text> (You)</Text>
                            )}
                    </Text>
                    {this.state.rankOfUser &&
                        this.state.rankOfUser.rank !== 1 && (
                            <Text style={{ color: Colors.white }}>
                                You : Top {this.state.rankOfUser.rank}
                            </Text>
                        )}
                </View>
                {this.state.loading && <LoadingScreen />}
                <Score score={this.state.score} y={SCORE_Y} />
                <Emoji
                    score={this.state.score}
                    y={EMOJI_Y}
                    lost={this.state.lost}
                />
                {this.state.lost ? (
                    <View style={[styles.ball, position]}>
                        <PrimaryButton
                            onPress={() =>
                                this.setState({
                                    ...this.state,
                                    lost: false,
                                })
                            }
                            small
                            text="Continue"
                        />
                        <PrimaryButton
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    lost: false,
                                });
                                navigate('Games');
                            }}
                            style={{ marginTop: 10 }}
                            small
                            text="Quit"
                        />
                    </View>
                ) : (
                    <Image
                        source={SoccerIcon}
                        style={[styles.ball, position, rotation]}
                        onStartShouldSetResponder={event =>
                            this.onTap(event.nativeEvent)
                        }
                    />
                )}
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    ball: {
        width: BALL_WIDTH,
        height: BALL_HEIGHT,
    },
});

export default SoccerGameScreen;
