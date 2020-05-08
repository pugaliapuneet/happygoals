import React, {Component} from 'react';
import {View} from 'react-native';
import {styles} from '../../styles.js';
import LinearGradient from 'react-native-linear-gradient';

export default class AccomplishmentScreen extends Component {
    render() {
        return (
            <View style={[styles.body, {position: 'relative', height: '100%'}]}>
				<LinearGradient colors={['#FFCC80', '#FFE0B2']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient>
            </View>
        );
    }
}