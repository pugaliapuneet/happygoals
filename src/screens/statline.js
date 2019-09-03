import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import styles from '../../styles.js';

export default class statline extends Component{	
	render() {
		return (
			<View style={styles.dashboardStat}>
				<Text style={[styles.dashboardStatFigure]}>{this.props.figure}</Text>
				<Text style={[styles.dashboardStatLabel]}>{this.props.label}</Text>
			</View>
		);
	}
}