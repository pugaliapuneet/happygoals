import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, ToastAndroid, LayoutAnimation} from 'react-native';
import { CheckBox } from 'react-native-elements'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles, listed, maximizedgreen, maximizedblue, minimized, snoozed} from '../../styles.js';
import CLine from './cline.js';
import CardHeader from './cardheader.js';
import CalendarCheckbox from './calendarcheckbox.js';

import model from './model.js';
const dbgoals = model.dbgoals;

var moment = require('moment');

export default class completedgoal extends Component{
	constructor(props) {
		super(props);

		this.state = {
			checked: {},
			expanded: 0,
			snoozed: this.props.data.snoozed,
			scrollPosition: 0,
		};
	}

	toggle = () => {
		// Alert.alert("Yo");
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ expanded: !this.state.expanded})
	}

	snooze = () => {
		let that = this;
		this.setState({ snoozed: !this.state.snoozed}, function(){
			dbgoals.update({_id: that.props.data._id}, {$set: {snoozed: this.state.snoozed}}, {}, function(err, numRows) {
				that.toggle();
			})
		})
	}

	onS = (event) => {
		this.setState({scrollPosition: event.nativeEvent.contentOffset.x});
		console.log(this.state.scrollPosition);
	}

	render() {
		const g = this.props.data;

		g.cardStatus = listed;

		g.stat = <Text style={g.cardStatus.score}>{g.bigScore}<Text style={{color: 'rgba(255, 255, 255, 0.5)'}}>%</Text></Text>

		let optionalCardStyle = {};
		if(g.bigScore < 75)
		{
			optionalCardStyle = {backgroundColor: "hsl(0, 60%, 50%)"}
		}
		optionalCardStyle = {backgroundColor: "hsl(175, 60%, 50%)"}

		let sortedItems = g.items.sort(function(obj1, obj2) {
			if(obj1.points)
				return obj2.logs.length*obj2.points - obj1.logs.length*obj1.points;
			else {
				return obj2.logs.length - obj1.logs.length;
			}
		})

		let tagline;
		if(g.mode == "tasks") {
			tagline = "You scored "+g.totalPoints+" points in "+g.duration+" weeks";
		}
		else {
			tagline = "You consistently did "+g.totalCount+" habits in "+g.duration+" weeks";
		}

		return (
			<View style={[g.cardStatus.card, optionalCardStyle]}>
				<View style={g.cardStatus.headerContainer}>
					<View style={[styles.border, {justifyContent: 'space-between'}]}>

						<Text style={[listed.score, {fontSize: 21}]}>{tagline}</Text>

						<View style={[styles.border, styles.goalTitle, {alignItems: 'flex-end'}]}>
							<View style={[styles.rowwrap]}>
								<Text style={g.cardStatus.goalName}>{g.name}</Text>
							</View>
						</View>

						{
							sortedItems.map((item) => {
								let pointColumn;
								if(item.points) {
									pointColumn = <Text style={{flex: 1}}>{item.points*item.logs.length} points</Text>
								}
								return (
									<View key={item.name} style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
										<Text style={{flex: 2}}>{item.name}</Text>
										<Text style={{flex: 1}}>{item.logs.length} times</Text>
										{pointColumn}
									</View>
								);
							})
						}

					</View>
				</View>
			</View>
		);
	}
}
