import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, FlatList} from 'react-native';
import {styles} from '../../styles.js';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

var moment = require('moment');

export default class calendarcheckbox extends Component{
	componentDidUpdate() {
		this.myScroll.scrollTo({x: this.props.scrollPosition, y: 0})
	}

	// componentDidMount() {
	// 	// this.myScroll.scrollToEnd({animated: false})
	// }

	render() {
		const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		const startWeekDay = this.props.start;
		const todayWeekDay = moment().isoWeekday();

		const weekDates = [];
		const realDateTimestamp = [];

		const weekAdjust = 0;
		const showDays = (this.props.g.completed.weeks)*7;
		// console.log(this.props.g.completed.weeks, "weeks completed for", this.props.g.name)

		let gap = 0;
		if(startWeekDay > todayWeekDay) {
			gap = startWeekDay-showDays-todayWeekDay;
		}
		else {
			gap = startWeekDay-(showDays-7)-todayWeekDay;
		}
		// console.log("GAP", gap);
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

		// console.log("WeekDates", this.props.g.name, weekDates);

		const style = {fontFamily: 'Quicksand-Bold', backgroundColor: 'transparent', width: 20, height: 20, color: 'white', textAlign: 'center', borderRadius: 10, fontSize: 12, opacity: 1};
		const highlightStyle = {opacity: 1};
		const fillStyle = {opacity: 1, backgroundColor: 'white'};
		let todayStyle = {};

		const array = [];
		for(let i = 0; i < showDays; i++)
		{
			let apply = {};
			if(i+1 <= this.props.highlight)
				apply = highlightStyle;


			//check if the date is already ticked
			this.props.fill.map((log) => {
				let date = moment(log.timestamp*1000).format("D/M");
				// console.log("DDDATE", weekDates[i], "==", date);
				if(weekDates[i] == date)
					apply = [fillStyle, this.props.g.cardStatus.coloredText];
			})

			//highlight today
			if(weekDates[i] == moment().format("D/M"))
				todayStyle = {borderWidth: 2, borderColor: 'white'};
			else {
				todayStyle = {};
			}

			//add week markers
			if(i%7 == 0)
			{
				array.push(
					<TouchableOpacity key={"Week"+i/7} style={{flex: 1}}>
						<Text style={[style, {backgroundColor: 'transparent', opacity: 0.3, color: 'black'}]} date={weekDates[i]}>
							#{i/7+1}
						</Text>
					</TouchableOpacity>
				);
			}

			//calendar marker
			array.push(
				<TouchableOpacity key={realDateTimestamp[i]} style={{ flex: 1}}>
					<Text style={[style, apply, todayStyle]} date={weekDates[i]} onLongPress={() => {
						ReactNativeHapticFeedback.trigger('impactHeavy', true);

						// console.log(this.props.goalName, this.props.habitName, realDateTimestamp[i]);
						this.props.createLog(this.props.goalName, this.props.habitName, realDateTimestamp[i]);
					}}>
						{week[(startWeekDay+i)%7][0]}
					</Text>
				</TouchableOpacity>
			);

		}

		// <ScrollView
		// 	style={[styles.border]}
		// 	contentContainerStyle={{flexDirection: 'row', width: this.props.g.completed.weeks*100 + "%", justifyContent: 'space-between'}}
		// 	horizontal={true}
		// 	showsHorizontalScrollIndicator={false}
		// 	pagingEnabled={true}
		// 	onMomentumScrollEnd={event => this.props.onS(event)}
		// 	ref={(ref) => this.myScroll = ref}
		// 	onContentSizeChange={(contentWidth, contentHeight)=>{
		// 		this.myScroll.scrollToEnd({animation: false});
		// 	}}>
		// 	{array}
		// </ScrollView>

		// width: this.props.g.completed.weeks*100 + "%",

		return (
			<FlatList
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				data={array}
				styles={{width: 12000}}
				renderItem={({item}) =>
					<View style={{width: 50}}>
						{item}
					</View>
				}
			/>
		);
	}
}
