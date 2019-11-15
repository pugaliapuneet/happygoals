import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity,Image, ScrollView, RefreshControl, ToastAndroid, InteractionManager, SectionList, AsyncStorage} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles, listed, maximizedblue, maximizedgreen} from '../../styles.js';
import { withNavigationFocus } from "react-navigation";
// import Swipeout from 'react-native-swipeout';
import LinearGradient from 'react-native-linear-gradient';

import { AreaChart, Grid, BarChart, StackedBarChart, StackedAreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

var moment = require('moment');

import model from './model.js';
import { Icon } from 'react-native-elements'

class JournalScreen extends Component{
	constructor(props) {
		super(props);

		this.state = {};

		this.title = "0 Activities"
		this.view_date = moment().format("DD/MM/YYYY")
		this.readableDate = "Today"
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			// console.log("Loading Journal");
			this.loadJournal();
		});
	}

	componentDidUpdate(prevProps) {
		let that = this;

		if (prevProps.isFocused !== this.props.isFocused) {
			AsyncStorage.getItem("RefreshJournal").then(function(value) {
				if(value == "yes")
				{
					AsyncStorage.setItem("RefreshJournal", "");
					that.loadJournal();
				}
			});
		}
	}

	loadJournal = () => {
		const that = this;

		Promise.all([model.getLogs(), model.getPointsTable(), model.getActiveGoals(null, this.view_date)]).then(function(array){

			let logs = array[0];
			let pointsTable = array[1];
			let goals = array[2];

			that.achievements = {
				'2x': [],
				'Top Day': [],
				'4/5 stars': [],
				'Improvements': [],
				'Checked': [],
			}
			// console.log("GOALSSSS", goals);

			//loop over logs to check 5star achievements
			Object.keys(logs).forEach((date) => {
				// console.log(date);
				if(date == moment().format("DD/MM/YYYY")) {
					logs[date].forEach((log) => {
						if(array[1][log.goalName][log.itemName] >= 4)
						{
							that.achievements['4/5 stars'].push(log.itemName);
						}
					})
				}
			});

			//loop over goals
			goals.forEach((goal) => {
				// console.log("GOALSSS", goal);

				//2x
				if(goal.mode == "tasks" && goal.totalPointsToday >= goal.bigScore*2) {
					that.achievements['2x'].push(goal.name);
				}
				else {
					//improvements and completions
					if(goal.isCompleted == 1 && goal.totalPointsToday > 0 && goal.mode == "tasks") {
						that.achievements['Improvements'].push(goal.name);
					}

					if(goal.isCompleted == 1 && goal.totalCountToday > 0 && goal.mode == "habits") {
						that.achievements['Checked'].push(goal.name);
					}

					//topDays
					if(goal.mode == "tasks" && goal.totalPointsToday >= goal.topScore) {
						that.achievements['Top Day'].push(goal.name);
					}
				}
			})

			// console.log(that.achievements);

			that.setState({
				logs: logs,
				pointsTable: pointsTable,
				goals: goals,
				refreshing: false,
			});

		}).catch(err => {
			console.log("EEEEE", err);
		})
	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this.loadJournal();
	}

	deleteLog = (goalName, itemName, timestamp, createdAt) => {
		model.deleteLog(goalName, itemName, timestamp, createdAt);

		ToastAndroid.show("Deleted: "+goalName+", "+itemName+", "+timestamp, ToastAndroid.LONG);
		ReactNativeHapticFeedback.trigger('impactHeavy', true);

		AsyncStorage.setItem("RefreshDashboard", "yes");
		this.loadJournal();
	}
	deleteLogById = (_id) => {
		model.deleteLogById(_id);

		ToastAndroid.show("Deleted: "+_id, ToastAndroid.LONG);
		ReactNativeHapticFeedback.trigger('impactHeavy', true);

		AsyncStorage.setItem("RefreshDashboard", "yes");
		this.loadJournal();
	}

	_renderItem = ({item: l}) => {
		console.log("LLLL", l);
		let hourOfDay = moment.unix(l.createdAt).format("H");
		let hodStyle = {};
		if(hourOfDay < 12)
			hodStyle = {backgroundColor: 'lightblue'};
		else if(hourOfDay < 17)
			hodStyle = {backgroundColor: 'yellow'};
		else if(hourOfDay < 20)
			hodStyle = {backgroundColor: 'pink'};
		else
			hodStyle = {backgroundColor: 'grey'};

		//{l.goalName} -
		return(<View key={l.itemName+l.createdAt} style={[styles.rowwrap, {justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 10}]}>
			<View style={styles.rowwrap}>
				<View style={[hodStyle, {borderRadius: 100, marginVertical: 10, marginRight: 8, width: 7, height: 7}]}></View>
				<Text
					style={[styles.label, {color: '#FFF'}]}
					onPress={() => {this.setState({showDeleteOf: l._id})}}
				>{l.itemName}</Text>
			</View>

			{
				this.state.showDeleteOf == l._id &&
				<TouchableOpacity
					onLongPress={() => this.deleteLogById(l._id)}
					onPress={() => ToastAndroid.show("LongPress to delete this entry", ToastAndroid.LONG)}
				>
					<Text style={{fontSize: 14, color: '#999'}}>Delete</Text>
				</TouchableOpacity>
			}
		</View>)
	};

	_keyExtractor = (item, index) => item.itemName+item.createdAt;

	changeDate = (direction) => {
		if (direction == 'prev') {
			this.view_date=moment(this.view_date, 'DD/MM/YYYY').subtract(1, 'days').format("DD/MM/YYYY");
		}
		else if (direction == 'next' && moment(this.view_date, 'DD/MM/YYYY')<moment().subtract(1, 'days')) {
			this.view_date=moment(this.view_date, 'DD/MM/YYYY').add(1, 'days').format("DD/MM/YYYY");
		}
		else
			return;
		this.achievements = {
			'2x': [],
			'Top Day': [],
			'4/5 stars': [],
			'Improvements': [],
			'Checked': [],
		}
		this.setState({refreshing: true});
		let logs = this.state.logs;
		let that = this;
		model.getGoalsJournal().then((allGoals) => {
			let goals = {};
			Object.keys(logs).map((date) => {
				let topScore = {};
				logs[date].map((log) => {
					if (goals[log.goalName] === undefined) {
						goals[log.goalName] = {name:log.goalName, mode:allGoals[log.goalName].mode, totalCountToday:0, totalPointsToday:0, isCompleted:0, bigScore:0, topScore:0, totalPoints:0, totalCount:0};
						goals[log.goalName].daysSpent = model.calculateCompletion(allGoals[log.goalName].startDate).totalDays;
					}
					if (date == that.view_date) {
						goals[log.goalName]['totalPointsToday'] += that.state.pointsTable[log.goalName][log.itemName] ? that.state.pointsTable[log.goalName][log.itemName]:0;
						goals[log.goalName]['totalCountToday'] += 1;
					}
					goals[log.goalName]['totalPoints'] += that.state.pointsTable[log.goalName][log.itemName] ? that.state.pointsTable[log.goalName][log.itemName]:0;
					goals[log.goalName]['totalCount'] += 1;
					if (topScore[log.goalName] === undefined) {
						topScore[log.goalName] = 0;
					}
					topScore[log.goalName] += that.state.pointsTable[log.goalName][log.itemName] ? that.state.pointsTable[log.goalName][log.itemName]:0;
					if (topScore[log.goalName]>goals[log.goalName]['topScore']) {
						goals[log.goalName]['topScore'] = topScore[log.goalName];
					}
				});
			});
			Object.values(goals).map((goal) => {
				if(goal.mode == "tasks") {
					goal.bigScore = Math.round(goal.totalPoints/goal.daysSpent*10)/10;
					goal.isCompleted = goal.totalPointsToday/goal.bigScore >= 1 ? 1 : 0;
				}
				else if(goal.mode == "habits") {
					goal.bigScore = Math.round(goal.totalCount/(goal.totalDailyRepetitionTarget*goal.daysSpent)*100);
					goal.isCompleted = goal.bigScore >= 100 ? 1 : 0;
					if(goal.bigScore > 100)
						goal.bigScore = 100;
				}
				
				if(goal.mode == "tasks" && goal.totalPointsToday >= goal.bigScore*2) {
					that.achievements['2x'].push(goal.name);
				}
				else {
					//improvements and completions
					if(goal.isCompleted == 1 && goal.totalPointsToday > 0 && goal.mode == "tasks") {
						that.achievements['Improvements'].push(goal.name);
					}

					if(goal.isCompleted == 1 && goal.totalCountToday > 0 && goal.mode == "habits") {
						that.achievements['Checked'].push(goal.name);
					}

					//topDays
					if(goal.mode == "tasks" && goal.totalPointsToday >= goal.topScore) {
						that.achievements['Top Day'].push(goal.name);
					}
				}
			});
			that.setState({
				refreshing: false
			});
		}).catch(err => {
			console.log("getGoalsJournal() Error:", err);
		});
		// model.getActiveGoals(null, this.view_date).then(function (goals) {
		// 	goals.forEach((goal) => {
		// 		//2x
		// 		if(goal.mode == "tasks" && goal.totalPointsToday >= goal.bigScore*2) {
		// 			that.achievements['2x'].push(goal.name);
		// 		}
		// 		else {
		// 			//improvements and completions
		// 			if(goal.isCompleted == 1 && goal.totalPointsToday > 0 && goal.mode == "tasks") {
		// 				that.achievements['Improvements'].push(goal.name);
		// 			}

		// 			if(goal.isCompleted == 1 && goal.totalCountToday > 0 && goal.mode == "habits") {
		// 				that.achievements['Checked'].push(goal.name);
		// 			}

		// 			//topDays
		// 			if(goal.mode == "tasks" && goal.totalPointsToday >= goal.topScore) {
		// 				that.achievements['Top Day'].push(goal.name);
		// 			}
		// 		}
		// 	})

		// 	that.setState({
		// 		goals: goals,
		// 		refreshing: false
		// 	});
		// }).catch(err => {
		// 	console.log("getActiveGoals() Error:", err);
		// })
		// this.loadJournal();
		if (this.view_date == moment().format("DD/MM/YYYY")) {
			this.readableDate = "Today";
		}
		else if (this.view_date == moment().subtract(1, 'days').format("DD/MM/YYYY")) {
			this.readableDate = "Yesterday";
		}
		else
			this.readableDate = this.view_date;
		ToastAndroid.show(this.view_date, ToastAndroid.LONG);
	}

	render() {
		let that = this;
		let pointsToday = 0;

		if(typeof this.state.logs !== 'undefined')
		{
			const navigation = this.props.navigation;
			const logs = this.state.logs;
			// console.log(logs);

			let body;
			if(!Object.keys(logs).length) {
				body = <View style={[styles.body, {height: '100%', alignItems: 'center', justifyContent: 'center'}]}>
					<Text style={{alignItems: 'stretch', textAlign: 'center', padding: 25, color: 'white'}}>Log some activities or habits to see data here.</Text>
				</View>
			}
			else {
				let chartData = [];
				let stackChartData = [];

				//breakdown full log into daily sections, and generate chart data
				let sectionLogs = [];
				let chartDataOfPoints = [];
				let chartDataObj = {};
				Array(30).fill().map((_,i) => {
					let date = moment().subtract(i, 'days').format("DD/MM/YYYY");
					chartDataObj[date] = {value:0};
				});
				Object.keys(logs).map((date) => {
					let newlogs = [];
					let pointsForTheDay = 0;
					morning = 0; evening = 0; afternoon = 0; night = 0;

					logs[date].map((log) => {
						newlogs.push(log);

						pointsForTheDay += that.state.pointsTable[log.goalName][log.itemName] ? that.state.pointsTable[log.goalName][log.itemName]:0;

						// let hourOfDay = moment.unix(log.createdAt).format("H");
						//
						// if(hourOfDay < 12)
						// 	morning++;
						// else if(hourOfDay < 17)
						// 	evening++;
						// else if(hourOfDay < 20)
						// 	afternoon++;
						// else
						// 	night++;

					});

					let readableDate;
					if(date == moment().format("DD/MM/YYYY"))
					{
						pointsToday = pointsForTheDay;
						readableDate = "Today";
					}
					else {
						readableDate = date;
					}

					// - "+logs[date].length+" activities
					if(date == this.view_date) {
						// sectionLogs.push({title: logs[date].length+" Activities", data: newlogs});
						this.title = logs[date].length+" Activities";
						this.logsArray = newlogs;
						pointsToday = pointsForTheDay;
					}
					else if(!(this.view_date in logs)) {
						this.title = "0 Activities";
						this.logsArray = [];
						pointsToday = 0;
					}

					//generate chart data
					chartData.unshift(logs[date].length);
					if (date == this.view_date && chartDataObj[date] !== undefined) {
						// chartDataOfPoints.unshift({
						// 	value: pointsForTheDay,
						// 	svg: {
						// 		fill: 'green',
						// 	},
						// });
						chartDataObj[date].value = pointsForTheDay;
						chartDataObj[date].svg = {fill: 'green'};
					}
					else if(chartDataObj[date] !== undefined){
						// chartDataOfPoints.unshift({
						// 	value: pointsForTheDay,
						// });
						chartDataObj[date].value = pointsForTheDay;
					}
					stackChartData.unshift({
						date: date,
						morning: morning,
						afternoon: afternoon,
						evening: evening,
						night: night,
					});
				});
				chartDataOfPoints = Object.values(chartDataObj).reverse();

				if(chartData.length > 30){
					chartData = chartData.slice(Math.max(chartData.length - 30, 1));
					chartDataOfPoints = chartDataOfPoints.slice(Math.max(chartDataOfPoints.length - 30, 1));
				}

				stackChartData = stackChartData.slice(Math.max(stackChartData.length - 30, 1));

				colors = ['lightblue', 'yellow', 'pink', 'grey'];
				keys = ['morning', 'afternoon', 'evening', 'night'];

				// <BarChart
				// 	style={{ width: '100%', height: 100, borderWidth: 0}}
				// 	data={ chartData }
				// 	contentInset={{ top: 5, bottom: 25, left: 0, right: 0}}
				// 	curve={ shape.curveNatural }
				// 	svg={{ stroke: 'rgba(0,0,0,0)', fill: "rgba(0,0,0,0.5)", strokeWidth: 2, strokeOpacity: 1 }}>
				//
				// </BarChart>

				let x = [];
				Object.keys(that.achievements).forEach((a) => {
					if(that.achievements[a].length) {
						x.push(<Text style={[styles.goal, {marginTop: 20, color: '#FFD1F2'}]}>{a}</Text>);
						x.push(<View style={{width: 40, borderBottomColor: '#FFD1F2', borderBottomWidth: 1, marginVertical: 10}}></View>);
						that.achievements[a].forEach((item) => {
							x.push(<Text style={[{color: '#FFF', marginBottom: 5}]}>{item}</Text>);
						})
					}
				})


					let xyz = [];

					this.logsArray && this.logsArray.forEach((l) => {
						xyz.push(this._renderItem({item: l}));
					})

				body = <View style={{height: '100%'}}>
					<LinearGradient colors={['#37474F', '#78909C']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient>

					<View style={[maximizedblue.card, {paddingTop: 20, padding: 0, margin: 0, borderRadius: 0}]}>
						<View style={[styles.rowwrap, {justifyContent: 'space-between', marginBottom: 20}]}>
							<Icon name='arrow-left' type="material-community" color="white" size={21} containerStyle={{paddingHorizontal: 20}} onPress={() => this.changeDate('prev')}/>
							<Text style={{fontFamily: 'Quicksand-Medium', textAlign: 'center', color: 'white'}}>{this.readableDate}</Text>
							<Icon name='arrow-right' type="material-community" color="white" size={21} containerStyle={{paddingHorizontal: 20}} onPress={() => this.changeDate('next')}/>
						</View>
						<Text style={styles.journalScore}>{pointsToday}</Text>
						<BarChart
							style={{ width: '100%', height: 100, borderWidth: 0}}
							data={ chartDataOfPoints }
							contentInset={{ top: 0, bottom: 10, left: 0, right: 0}}
							curve={ shape.curveNatural }
							svg={{ stroke: 'rgba(0,0,0,0)', fill1: "rgba(0,0,0,0.25)", fill2: "#006064", fill: "rgba(0,0,0,0.3)",strokeWidth: 2, strokeOpacity: 1 }}
							yAccessor={({ item }) => item.value}>
						</BarChart>
					</View>

					<ScrollView style={{position: 'absolute', top: 225, bottom: 0, left: 0, right: 0, marginBottom: 10}}>
						<View style={{position: 'absolute', right: 20, top: 0, alignItems: 'flex-end'}}>
							{x}
						</View>
						<View style={{marginLeft: 10}}>
							<Text style={[styles.goal, {marginTop: 20, color: '#FFD1F2', marginLeft: 10}]}>{this.title}</Text>
							<View style={{width: 40, borderBottomColor: '#FFD1F2', borderBottomWidth: 1, marginVertical: 10, marginLeft: 10}}></View>
							{xyz}
						</View>
					</ScrollView>


				</View>;
			}

			// <SectionList
			// 	style={{marginLeft: 10}}
			// 	renderItem={this._renderItem}
			// 	keyExtractor={this._keyExtractor}
			// 	sections={sectionLogs}
			// 	renderSectionHeader={({section: {title}}) => (
			// 		<View style={{marginLeft: 10}}>
			// 			<Text style={[styles.goal, {marginTop: 20, color: '#FFD1F2'}]}>{title}</Text>
			// 			<View style={{width: 40, borderBottomColor: '#FFD1F2', borderBottomWidth: 1, marginVertical: 10}}></View>
			// 		</View>
			// 	)}
			// />

			// <TouchableOpacity onPress={this.props.navigation.toggleDrawer}>
			// 	<Image source={{uri: "https://static.thenounproject.com/png/1166840-200.png"}} style={{width: 32, height: 32, marginLeft: 10, marginTop: 10}} />
			// </TouchableOpacity>
			return (
				<View style={[styles.body, {position: 'relative', height: '100%'}]}>
					<LinearGradient colors={['#FFCC80', '#FFE0B2']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient>
					<View style1={{position: 'absolute', top: 52, left: 0, right: 0, bottom: 8}}>
						{body}
					</View>
				</View>
			)
		}
		else
			return <View style={[styles.body, {height: '100%', alignItems: 'center', justifyContent: 'center'}]}><Text style={{width: '100%', textAlign: 'center', paddingVertical: 25}}>Loading...</Text></View>
	}
}

export default withNavigationFocus(JournalScreen);
