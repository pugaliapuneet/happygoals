import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, ToastAndroid, LayoutAnimation, ScrollView} from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles, listed, maximizedgreen, maximizedblue, minimized, snoozed} from '../../styles.js';
import CLine from './cline.js';
import CardHeader from './cardheader.js';
import CalendarCheckbox from './calendarcheckbox.js';
import CalendarEntry from './calendarentry.js';
import EditGoal from './editgoal';
import ControlFooter from './controlfooter.js';

import model from './model.js';
const dbgoals = model.dbgoals;

var moment = require('moment');

export default class goalhabitentry extends Component{
	constructor(props) {
		super(props);

		this.state = {
			checked: {},
			expanded: this.props.data.dummy ? 1:0,
			snoozed: this.props.data.snoozed,
			scrollPosition: 0,
	  		showAllWeeks: false,
		};
	}

	toggle = () => {
		this.forceRender = true;

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
		this.forceRender = true;
		// this.setState({scrollPosition: event.nativeEvent.contentOffset.x});
		// console.log(this.state.scrollPosition);
	}

	showAllWeeks = () => {
		// console.log("tas");
		this.forceRender = true;
		this.setState({showAllWeeks: true});
	}

	shouldComponentUpdate(nextProps) {
		return true;
		if(this.forceRender)
		{
			this.forceRender = false;
			return true;
		}
		if(typeof this.props.data.items != "undefined" && this.props.data.items.length != nextProps.data.items.length) {
			return true;
		}
		return (this.props.data.totalCount == nextProps.data.totalCount) ? false : true;
	}

	render() {
		// console.log("rendering again")
		const g = this.props.data;

		if(this.state.snoozed && !this.state.expanded) {
			g.cardStatus = snoozed;
			// g.tickOverride = "bell-slash";
		}
		else if(typeof g.items == "undefined") {
			g.cardStatus = maximizedblue;
		}
		else if(g.isCompleted == 1) {
			if(this.state.expanded)
				g.cardStatus = maximizedgreen;
			else {
				g.cardStatus = this.state.snoozed ? snoozed : minimized;
				g.tickOverride = this.state.snoozed ? "bell-slash" : null;
			}
		}
		else {
			if(this.state.expanded)
				g.cardStatus = maximizedblue;
			else {
				g.cardStatus = this.state.snoozed ? snoozed : listed;
				g.tickOverride = this.state.snoozed ? "bell-slash" : null;
			}

		}

		if(typeof g.bigScore != "undefined")
			g.stat = <Text style={g.cardStatus.score}>{g.bigScore}<Text style={{color: 'rgba(255, 255, 255, 0.5)'}}>%</Text></Text>

		let optionalCardStyle = {};
		if(g.bigScore < 75)
		{
			// optionalCardStyle = {backgroundColor: "hsl(0, 60%, 50%)"}
			optionalCardStyle = {backgroundColor: "#c62828"}
		}

		let colorLayerOpacity = {};
		if(this.state.expanded)
			colorLayerOpacity = {opacity: 1};
		else
			colorLayerOpacity = {opacity: 0};

		return (
			<View style={[g.cardStatus.card, optionalCardStyle]}>
				<CardHeader g={g} onP={this.toggle} dashboardFunctions={this.props.dashboardFunctions}/>
				{
					this.state.expanded == 1 &&
					<View>
						{
							typeof g.items != "undefined" &&
							<View style={[g.cardStatus.bodyVisibility, {paddingBottom: 20, paddingTop: 10}]}>
							{
								<CalendarEntry g={g} dashboardFunctions={this.props.dashboardFunctions} createLog={this.props.createLog} key={Math.random()} showAllWeeks={this.state.showAllWeeks}/>
						    }
						    </View>
						}
						{
							!g.dummy &&
							<ControlFooter dashboardFunctions={this.props.dashboardFunctions} g={g} snooze={this.snooze} showAllWeeks={this.showAllWeeks}/>
						}
					</View>
				}
			</View>
		);
	}
}
