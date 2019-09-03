import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import styles from '../../styles.js';

export default class cline extends Component{
	render() {
		return (
			<View style={[styles.horizontal, {flexDirection: 'row'}]}>
			{
				(() => {
					const xyz = [];
					var customStyle = {};
					var previousWeekStyle = {};
					for(let i = 1; i <= this.props.duration; i++) {
						if(i == this.props.completed)
							customStyle = {backgroundColor: 'hsl(0, 40%, 50%)'};
						else
							customStyle = {};

						if(i <= this.props.completed)
							previousWeekStyle = {backgroundColor: 'hsl(100, 40%, 50%)'};
						else
							previousWeekStyle = {}

						if(this.props.type == "tasks")
						{
							xyz.push(
								<View key={i} style={[styles.weeklyProgress, previousWeekStyle, customStyle]}>
									<Text style={[{fontSize: 12, fontFamily: 'Quicksand-Medium'}]}>
										{Math.round(Math.random()*250)}
									</Text>
								</View>);
						}
						else
						{
							xyz.push(<Text key={i} style={[styles.weeklyProgress, previousWeekStyle, customStyle]}></Text>);
						}
					}
					return xyz;
				})()
			}
			</View>
		);
	}
}
