import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity,Image, ScrollView, RefreshControl, ToastAndroid, InteractionManager, SectionList, AsyncStorage, TouchableHighlight} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles, listed, maximizedblue, maximizedgreen, primaryColor} from '../../styles.js';
import { withNavigationFocus } from "react-navigation";
// import Swipeout from 'react-native-swipeout';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';

import { AreaChart, Grid, BarChart, StackedBarChart, StackedAreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

var moment = require('moment');

import model from './model.js';
import { Icon } from 'react-native-elements'
import ChartBottom from '../components/ChartBottom.js';

class JournalScreen extends Component{
	constructor(props) {
		super(props);

		this.state = {};

		this.title = "0 Activities today"
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

	extractHighValueActivites = (logs) => {
		Object.keys(logs).forEach((date) => {
			// console.log(date);
			if(date == this.view_date) {
				logs[date].forEach((log) => {
					if(this.state.pointsTable[log.goalName][log.itemName] >= 4 && !this.achievements['4/5 stars'].includes(log.itemName))
					{
						this.achievements['4/5 stars'].push(log.itemName);
					}
				})
			}
		});
	}

	extractAchievements = (goals) => {
		goals.forEach((goal) => {
			if(goal.mode == "tasks" && goal.bigScore > 0 && goal.totalPointsToday >= goal.bigScore*2) {
				this.achievements['2x'].push(goal.name);
			}
			else {
				//improvements and completions
				if(goal.isCompleted == 1 && goal.totalPointsToday > 0 && goal.mode == "tasks") {
					this.achievements['Improvements'].push(goal.name);
				}

				if(goal.isCompleted == 1 && goal.totalCountToday > 0 && goal.mode == "habits") {
					this.achievements['Checked'].push(goal.name);
				}

				//topDays
				if(goal.mode == "tasks" && goal.totalPointsToday >= goal.topScore) {
					this.achievements['Top Day'].push(goal.name);
				}
			}
		})
	}

	initAchievements = () => {
		this.achievements = {
			'2x': [],
			'Top Day': [],
			'4/5 stars': [],
			'Improvements': [],
			'Checked': [],
		}
	}

	loadJournal = () => {
		const that = this;

		Promise.all([model.getLogs(), model.getPointsTable(), model.getGoals(null, that.view_date)]).then(array => {
			
			that.initAchievements();
			
			that.setState({
				logs: array[0],
				pointsTable: array[1],
				goals: array[2],
				refreshing: false,
			}, function(){
				that.extractAchievements(array[2]);
				that.extractHighValueActivites(array[0]);
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

		this.refreshJournal("yes");
	}

	deleteLogById = (_id) => {
		model.deleteLogById(_id);

		ToastAndroid.show("Deleted: "+_id, ToastAndroid.LONG);
		ReactNativeHapticFeedback.trigger('impactHeavy', true);

		this.refreshJournal("yes");
	}

	refreshJournal = (refreshDashboard) => {
		AsyncStorage.setItem("RefreshDashboard", refreshDashboard);
		this.loadJournal();
	}

	hodStyle = (createdAt) => {
		let hourOfDay = moment.unix(createdAt).format("H");
		let hodStyle = {};
		if(hourOfDay < 12)
			hodStyle = {backgroundColor: 'lightblue'};
		else if(hourOfDay < 17)
			hodStyle = {backgroundColor: 'yellow'};
		else if(hourOfDay < 20)
			hodStyle = {backgroundColor: 'pink'};
		else
			hodStyle = {backgroundColor: 'grey'};

		return hodStyle;
	}

	_renderItem = ({item: l}) => {
		hodStyle = this.hodStyle(l.createdAt);

		//{l.goalName} -
		return(<View key={l.itemName+l.createdAt} style={[styles.rowwrap, {justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 10}]}>
			<View style={styles.rowwrap}>
				{/* <View style={[hodStyle, {borderRadius: 100, marginVertical: 10, marginRight: 8, width: 7, height: 7}]}></View> */}
				<Text
					style={[styles.label, {color: '#484848'}]}
					onPress={() => {this.setState({showDeleteOf: l._id})}}
				>{l.itemName}</Text>
			</View>

			{
				this.state.showDeleteOf == l._id &&
				<View style={[styles.rowwrap, {justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 10, width: 100}]}>
					<TouchableOpacity onPress={() => this.showEditModal(l._id, l.timestamp)}>
						<Text style={{fontSize: 14, color: 'orange'}}>Edit</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onLongPress={() => this.deleteLogById(l._id)}
						onPress={() => ToastAndroid.show("LongPress to delete this entry", ToastAndroid.LONG)}
					>
						<Text style={{fontSize: 14, color: '#999'}}>Delete</Text>
					</TouchableOpacity>
				</View>
			}
		</View>)
	};

	showEditModal = (id, createdAt) => {
		this.setState({
			editModalVisible: true,
			editingJournal: id,
			editingJournalCreatedAt: moment.unix(createdAt).valueOf()
		});
	};

	onChange = (event, date) => {
		this.setState({ editingJournalCreatedAt: date.valueOf(), showDatePicker: false });
	}

	saveDate = () => {
		model.editLogDate(this.state.editingJournal, moment(this.state.editingJournalCreatedAt).unix())
		this.setState({editingJournal: null, editModalVisible: false});
		ToastAndroid.show("Date changed!", ToastAndroid.LONG);
		this.refreshJournal("yes");
	}

	_keyExtractor = (item, index) => item.itemName+item.createdAt;

	calculateNewDate = (direction) => {
		if (direction == 'prev') {
			this.view_date=moment(this.view_date, 'DD/MM/YYYY').subtract(1, 'days').format("DD/MM/YYYY");
			return true;
		}
		else if (direction == 'next' && moment(this.view_date, 'DD/MM/YYYY')<moment().subtract(1, 'days')) {
			this.view_date=moment(this.view_date, 'DD/MM/YYYY').add(1, 'days').format("DD/MM/YYYY");
			return true;
		}
		else 
			return false;
	}

	changeDate = (direction) => {
		if(!this.calculateNewDate(direction))
			return;
		
		this.initAchievements();
		
		this.setState({refreshing: true});
		
		let logs = this.state.logs;
		let that = this;

		this.extractHighValueActivites(logs);

		model.getGoalsJournal().then((allGoals) => {
			let goals = {};

			//TODO: What does this log iteration do? explain
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
			});
			
			this.extractAchievements(Object.values(goals));
			
			that.setState({
				refreshing: false
			});
		}).catch(err => {
			console.log("getGoalsJournal() Error:", err);
		});

		this.getReadableDate();
	}

	getReadableDate = () => {
		if (this.view_date == moment().format("DD/MM/YYYY")) {
			this.readableDate = "Today";
		}
		else if (this.view_date == moment().subtract(1, 'days').format("DD/MM/YYYY")) {
			this.readableDate = "Yesterday";
		}
		else if (this.view_date == moment().subtract(2, 'days').format("DD/MM/YYYY")) {
			this.readableDate = "Day Before Yesterday";
		}
		else
			this.readableDate = this.view_date;
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
					<Text style={{alignItems: 'stretch', textAlign: 'center', padding: 25}}>Log some activities to see data here.</Text>
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
						this.title = logs[date].length+" Activities today";
						this.logsArray = newlogs;
						pointsToday = pointsForTheDay;
					}
					else if(!(this.view_date in logs)) {
						this.title = "0 Activities today";
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
						chartDataObj[date].svg = {fill: primaryColor};
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
				let topScore = chartDataOfPoints.reduce(function(a, b){ return a.value > b.value ? a : b }).value;
				let totalScore = chartDataOfPoints.reduce(function(a, b){ return a + b.value }, 0);
				let agvScore = totalScore/30;
				let recentScore = this.state.goals.reduce(function(total, currentValue, index){ return total + (currentValue.recentScore || 0)}, 0);

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
						x.push(<Text style={[styles.goal, {marginTop: 20, color: primaryColor}]}>{a}</Text>);
						x.push(<View style={{width: 40, borderBottomColor: primaryColor, borderBottomWidth: 1, marginVertical: 10}}></View>);
						that.achievements[a].forEach((item) => {
							x.push(<Text style={[{color: '#484848', marginBottom: 5}]}>{item}</Text>);
						})
					}
				})


					let xyz = [];

					this.logsArray && this.logsArray.forEach((l) => {
						xyz.push(this._renderItem({item: l}));
					})

				body = <View style={{height: '100%'}}>
					{/* <LinearGradient colors={['#37474F', '#78909C']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient> */}

					<View style={[{paddingTop: 20, padding: 0, margin: 0, borderRadius: 0}]}>
						<View style={[styles.rowwrap, {justifyContent: 'space-between', marginBottom: 20}]}>
							<Icon name='arrow-left' type="material-community" color={primaryColor} size={21} containerStyle={{paddingHorizontal: 20}} onPress={() => this.changeDate('prev')}/>
							<Text style={{fontFamily: 'Quicksand-Medium', textAlign: 'center', color: primaryColor}}>{this.readableDate}</Text>
							<Icon name='arrow-right' type="material-community" color={primaryColor} size={21} containerStyle={{paddingHorizontal: 20}} onPress={() => this.changeDate('next')}/>
						</View>
						<Text style={styles.journalScore}>{pointsToday}</Text>
						<BarChart
							style={{ width: '100%', height: 100, borderWidth: 0}}
							data={ chartDataOfPoints }
							contentInset={{ top: 0, bottom: 20, left: 0, right: 0}}
							curve={ shape.curveNatural }
							svg={{ stroke: 'rgba(0,0,0,0)', fill: "#C7EBCA", strokeWidth: 2, strokeOpacity: 1 }}
							yAccessor={({ item }) => item.value}>
						</BarChart>
						<ChartBottom style={{marginHorizontal: 20}} data={{'Top': topScore, 'Avg': agvScore, 'Recent': recentScore, 'Week': 0}}></ChartBottom>
					</View>

					<ScrollView style={{position: 'absolute', top: 250, bottom: 0, left: 0, right: 0, marginBottom: 10}}>
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end'}}>
							<View style={{marginLeft: 10}}>
								<Text style={[styles.goal, {marginTop: 20, color: primaryColor, marginLeft: 10}]}>{this.title}</Text>
								<View style={{width: 40, borderBottomColor: primaryColor, borderBottomWidth: 1, marginVertical: 10, marginLeft: 10}}></View>
								{xyz}
							</View>
							<View style={{/* position: 'absolute', right: 20, top: 0,*/ alignItems: 'flex-end', marginRight: 20}}>
								{x}
							</View>
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
					{/* <LinearGradient colors={['#FFCC80', '#FFE0B2']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient> */}
					<View style1={{position: 'absolute', top: 52, left: 0, right: 0, bottom: 8}}>
						{body}
					</View>
					<Modal
						isVisible={this.state.editModalVisible}
						onBackdropPress={() => this.setState({ editModalVisible: false, showDatePicker: false })}
						onSwipe={() => this.setState({ editModalVisible: false, showDatePicker: false })}
						swipeDirection="down"
						hideModalContentWhileAnimating={true}
						backdropColor='black' useNativeDriver={false}
						backdropOpacity	= {0.85}
					>
						{/* <NewHabit closeModal={this._toggleNHModal} goalName={this.state.editingJournal} postSubmit={this.loadDashboard}/> */}
						<View style={[styles.modal, {padding: 10}]}>
							{/* <LinearGradient colors={['#5D4037', '#795548']} style={{display: 'none', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 5}}></LinearGradient> */}
							<View style={{padding: 10}}>
								<Icon name='close' type="material-community"
									size={21}
									containerStyle={{position: 'absolute', top: 0, right: 0, padding: 10}}
									color="rgba(0,0,0,0.5)"
									onPress={() => this.setState({ editModalVisible: false, showDatePicker: false })}
								/>

								<TouchableHighlight style={{marginTop: 30}} underlayColor={'transparent'}
									onPress={() => this.setState({ showDatePicker: true })}
								>
									<View style={{flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center' }}>
										<View style={[{
											flex: 1,
											height: 40,
											borderWidth: 1,
											borderColor: '#aaa',
											alignItems: 'center',
											justifyContent: 'center'
										}, {marginLeft: 0}]}>
											<Text allowFontScaling={true} style={{color: '#c9c9c9'}}>
												{moment(this.state.editingJournalCreatedAt).format("DD/MM/YYYY")}
											</Text>
										</View>
									</View>
								</TouchableHighlight>

								<View style={{alignItems: 'center', marginTop: 50}}>
									<TouchableHighlight onPress={this.saveDate}>
										<Text style={styles.yellowButton}>Save</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</Modal>
					{this.state.showDatePicker && (
						<DateTimePicker
							testID="dateTimePicker"
							timeZoneOffsetInMinutes={0}
							value={new Date(this.state.editingJournalCreatedAt)}
							mode='date'
							is24Hour={true}
							display="default"
							onChange={this.onChange}
						/>
					)}
				</View>
			)
		}
		else
			return <View style={[styles.body, {height: '100%', alignItems: 'center', justifyContent: 'center'}]}><Text style={{width: '100%', textAlign: 'center', paddingVertical: 25}}>Loading...</Text></View>
	}
}

export default withNavigationFocus(JournalScreen);
