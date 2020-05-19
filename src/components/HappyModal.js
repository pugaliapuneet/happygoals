import React, { Component } from 'react';
import Modal from "react-native-modal";
import NewGoal from '../screens/newgoal.js';
import {View} from 'react-native';

class HappyModal extends Component {
    render() {
        return (
            <View>
                <Modal
                    isVisible={this.props.isVisible}
                    onBackdropPress={() => this.props.closeHandle()}
                    onSwipe={() => this.props.closeHandle()}
                    swipeDirection="down"
                    hideModalContentWhileAnimating={true}
                    backdropColor='black' useNativeDriver={false}
                    backdropOpacity	= {0.85}
                >
                    {this.props.children}
                </Modal>
            </View>
        );
    }
}

export default HappyModal;