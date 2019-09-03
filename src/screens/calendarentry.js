import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Alert, ScrollView, FlatList, ToastAndroid, AsyncStorage} from 'react-native';
import {styles} from '../../styles.js';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import model from './model.js';

var moment = require('moment');

export default class calendarcheckbox extends Component{

	constructor(props) {
	  super(props);

	  this.g = this.props.g;
	  this.startWeekDay = typeof this.g.startDate !== 'undefined' ? moment.unix(this.g.startDate).isoWeekday() : "";
	  this.week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	  this.counterArray = [];
	  // this.counterArray.push(-this.g.completed.weeks);
	  let start = (this.g.completed.weeks-1)*7;
	  if(this.props.showAllWeeks)
	  	start = 0;

	  for(i = start; i < this.g.completed.weeks*7; i++) {
		  this.counterArray.push(i);

		  if((i+1) % 7 == 0 && i != 0 && (i+1) != this.g.completed.weeks*7) {
			this.counterArray.push(-(i+1)/7);
			// console.log(-(i+1)/7);
		  }

	  }

	  this.state = {};

	  this.counterArray = this.counterArray.reverse();
	  // console.log("COUNTERARRAY", this.counterArray);
	}

	render() {
		// console.log("rendering calendar");
		let that = this;
		const fillStyle = {opacity: 1, backgroundColor: 'white'};

		//generate label column
		let itemlabels = [];
		this.g.items.map((h, index) => {
			let scoreStyle = {opacity: 1};
			if(parseFloat(h.bigScore) < 75) {
				scoreStyle = {};
			}
			itemlabels.push(
				<View key={h.name} style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
					<Text style={styles.calendarItemlabel}>{h.repetition}x {h.name}</Text>
					<Text style={[styles.calendarItemlabel, scoreStyle]}>{h.bigScore}</Text>
				</View>
			);
		})

		//generate the calendar
		let calendar = this.generateCalender();
		// console.log("CALENDAR", calendar);

		//checkboxes
		let checkboxColumns = [];
		for(i = 0; i < this.g.completed.weeks*7; i++) {
			let checkboxes = [];

			// if(i%7 == 0) {
			// 	checkboxColumns.push(<View style={{transform: [{ rotate: "-90deg" }], marginTop: 30}} key={"Week"+i/7}><Text style={{color: 'rgba(255, 255, 255, 0.65)'}}>Week {i/7}</Text></View>);
			// }

		}

		// checkboxColumns.push(<View style={{transform: [{ rotate: "-90deg" }], marginTop: 30}} key={"Week"+this.g.completed.weeks}><Text style={{color: 'rgba(255, 255, 255, 0.65)'}}>Week {i/7}</Text></View>);
		checkboxColumns = checkboxColumns.reverse();

		return (
			<View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'relative'}}>
				<View style={{width: '100%', paddingHorizontal: 25}}>
					{itemlabels}
				</View>
				<FlatList
					style={styles.calendarFlatList}
					contentContainerStyle={{flexDirection: 'row', justifyContent: 'space-between'}}
					data={this.counterArray}
					keyExtractor={(item, index) => index.toString()}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					renderItem={({item}) => {
						let i = item;
						// console.log("III", i)
						if(i >= 0)
						{
							let checkboxColumns = [];

							that.g.items.map((h, index) => {
								// console.log(h.name);
								//check if the date is already ticked
								let apply = {};
								let reverse;
								h.logs.map((log) => {
									let date = moment(log.timestamp*1000).format("D/M");
									// console.log("CHECKING", i, calendar.realDateTimestamp[i], log.itemName, calendar.weekDates[i], date);

									if(that.state[h.name+calendar.weekDates[i]] === false) {
										apply = {};
									}
									else if(calendar.weekDates[i] == date || that.state[h.name+calendar.weekDates[i]]) {
										apply = [fillStyle, this.g.cardStatus.coloredText];
										reverse = log._id;
									}
								})

								//highlight today
								// console.log(calendar.weekDates[i]+" == "+moment().format("D/M"));
								if(calendar.weekDates[i] == moment().format("D/M"))
									todayStyle = {backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5};
								else {
									todayStyle = {};
								}

								//push the checkbox in the column
								checkboxColumns.push(
									<TouchableOpacity
										key={h.name+calendar.realDateTimestamp[i]}
										style={[styles.checkboxContainerStyle, todayStyle]}
										onPress={() => {
											ReactNativeHapticFeedback.trigger('impactHeavy', true);
											// console.log(that.g.name, h.name, calendar.realDateTimestamp[i-1]);
											if(reverse)
											{
												that.setState({[h.name+calendar.weekDates[i]]: false})
												model.deleteLogById(reverse);

												ToastAndroid.show("Entry deleted", ToastAndroid.LONG);
												that.props.dashboardFunctions.loadDashboard();
												AsyncStorage.setItem("RefreshJournal", "yes");
											}
											else
											{
												that.setState({[h.name+calendar.weekDates[i]]: true})
												that.props.createLog(that.g.name, h.name, calendar.realDateTimestamp[i]);
											}

										}}
									>
										<Text style={[styles.checkboxStyle, apply]} date={calendar.weekDates[i]}>
											{that.week[(that.startWeekDay+i)%7][0]}
										</Text>
									</TouchableOpacity>);
							});

							return(<View key={i}>{checkboxColumns}</View>);
						}
						else {
							return(<View key={i}>
								<Text style={{color: 'rgba(255,255,255,0.2)', padding: 6}}>#{i.toString().replace("-", "")}</Text>
							</View>);
						}
					}}
				/>
			</View>
		);
	}

	generateCalender = () => {
		const startWeekDay = typeof this.g.startDate !== 'undefined' ? moment.unix(this.g.startDate).isoWeekday() : "";
		const todayWeekDay = moment().isoWeekday();

		const weekDates = [];
		const realDateTimestamp = [];

		const weekAdjust = 0;
		const showDays = (this.g.completed.weeks)*7;
		// console.log(this.g.completed.weeks, "weeks completed for", this.g.name)

		let gap = 0;
		if(startWeekDay > todayWeekDay) {
			gap = startWeekDay-showDays-todayWeekDay;
		}
		else {
			gap = startWeekDay-(showDays-7)-todayWeekDay;
		}
		// console.log("GAP", gap);
		// console.log(this.g.name, "GAP", gap+showDays);
		for(let i = gap; i < gap+showDays; i++)
		{
			// console.log("III", i);
			if(i < 0)
			{
				weekDates.push(moment().subtract(Math.abs(i)+weekAdjust,'d').format('D/M'));
				realDateTimestamp.push(moment().subtract(Math.abs(i),'d').unix());
			}
			else
			{
				weekDates.push(moment().add(Math.abs(i)-weekAdjust,'d').format('D/M'));
				realDateTimestamp.push(moment().add(Math.abs(i),'d').unix());
			}
		}

		let obj = {
			weekDates: weekDates,
			realDateTimestamp: realDateTimestamp,
		}
		// console.log(obj.weekDates);
		return obj;
	}
}
