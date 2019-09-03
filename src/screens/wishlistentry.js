import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Animated, CheckBox} from 'react-native';
import {styles} from '../../styles.js';

export default class wishlistentry extends Component{
	constructor(props) {
		super(props);
	}

	render(){
		const item = this.props.data;

		additionalStyle = {};
		additionalTextStyle = {};

		if(this.props.data.status)
		{
			additionalStyle = {backgroundColor: 'green'};
			additionalTextStyle = {color: 'white'};
		}

		let bigScore;
		if(item.status && typeof item.goalData !== "undefined") {
			bigScore = item.goalData.bigScore;
			if(bigScore < 75 && item.mode == "habits") {
				additionalStyle = {backgroundColor: 'red'};
			}
		}


		return(
			<View style={[styles.card, styles.smallcard, additionalStyle]}>
				<View style={[styles.border, styles.goalTitle]}>
    				<Text style={[styles.goal, additionalTextStyle]}>{item.name} {bigScore}</Text>
    			</View>
			</View>
		)
	}
}
