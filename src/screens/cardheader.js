import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableNativeFeedback, Alert, TouchableOpacity, ToastAndroid, AsyncStorage, InteractionManager, LayoutAnimation} from 'react-native';
import { CheckBox, Divider, Icon } from 'react-native-elements'
import {styles, primaryColor} from '../../styles.js';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import model from './model.js';
import ControlFooter from './controlfooter.js';
import { BarChart } from 'react-native-svg-charts';
import ChartBottom from '../components/ChartBottom.js';

const moment = require('moment');

export default class cardheader extends Component{
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			editMode: false,
		}
	}

	_toggleEditMode = () => {

		let that = this;
		// this.forceRender = true;
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({editMode: !this.state.editMode}, function(){
			// console.log(this.state.editMode);
		})
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.renderChart(this.props.g.name);
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.g.totalPoints < this.props.g.totalPoints) {
			if ((this.props.g.recentScore/this.props.g.bigScore*100) > 125)
					ToastAndroid.show("You have improved today", ToastAndroid.LONG);
		}
		if (prevProps.g.totalPoints !== this.props.g.totalPoints) {
			InteractionManager.runAfterInteractions(() => {
				this.renderChart(this.props.g.name);
			});
		}
	}

	renderChart = (goalName) => {
		var that = this;
		Promise.all([model.getLogs(goalName), model.getPointsTable()]).then(function(array){
			let logs = array[0];
			let pointsTable = array[1];
			let chartDataOfPoints = [];
			let chartDataObj = {};
			Array(30).fill().map((_,i) => {
				let date = moment().subtract(i, 'days').format("DD/MM/YYYY");
				chartDataObj[date] = {value:0};
			});
			Object.keys(chartDataObj).reverse().map((date) => {
				// let newlogs = [];
				let pointsForTheDay = 0;
				if (logs[date] !== undefined) {
					logs[date].map((log) => {
						// newlogs.push(log);
						pointsForTheDay += pointsTable[log.goalName][log.itemName] ? pointsTable[log.goalName][log.itemName]:0;
					});
				}

				if (date == moment().format("DD/MM/YYYY")) {
					chartDataOfPoints.push({
						value: pointsForTheDay,
						svg: {
							fill: primaryColor,
						},
					});
					chartDataObj[date].value = pointsForTheDay;
					chartDataObj[date].svg = {fill: primaryColor};
				}
				else if(chartDataObj[date] !== undefined){
					chartDataOfPoints.push({
						value: pointsForTheDay,
					});
					chartDataObj[date].value = pointsForTheDay;
				}
			});
			// chartDataOfPoints = Object.values(chartDataObj).reverse();
			console.log(chartDataOfPoints)
			let totalScore = chartDataOfPoints.reduce(function(a, b){ return a + b.value }, 0);
			that.setState({
				chartData:chartDataOfPoints,
				agvScore: totalScore/30
			})
		}).catch(err => {
			console.log("EEEEE", err);
		});
	}

	render() {
		let that = this;
		const g = this.props.g;

		let tick = g.tickOverride ? g.tickOverride : "check";
		checkedColor = tick == "check" ? "green" : "grey";

		let editIconStyle;
		if(this.state.editMode)
			editIconStyle = {};
		else
			editIconStyle = {display: 'none'};

		return (
			// <TouchableWithoutFeedback onPress={() => { this.props.onP(); }}>
				<View style={[styles.modal]}>
					<View style={g.cardStatus.headerContainer}>
						<View style={[styles.border, styles.rowwrap, {justifyContent: 'space-between'}]}>
							<View style={[styles.border, styles.goalTitle]}>
								<View style={[styles.rowwrap, {marginBottom: 5}]}>
									<Text style={{fontSize: 18, textTransform: 'uppercase'}}>{g.name}</Text>
								</View>
								{g.statLabel}
							</View>
							{
							typeof g.items != "undefined" &&
							<View style={{}}>{g.stat}</View>
							}
						</View>
					</View>
					<Divider style={{ backgroundColor: '#E3E3E3', height: 1.5 }} />
					<View>
						<View style={{padding: 25}}>
						    <View style={[{flexDirection: 'row', flexWrap: 'wrap', zIndex: 1, paddingBottom: 15}]}>
						    {
								typeof g.items != "undefined" &&
						    	g.items.map((t, index1) => {
						    		let counter = <Text></Text>;
						    		styles.optional = {};

						    		if(t.countToday > 0)
						    			styles.optional = {color: primaryColor, fontFamily: 'Quicksand-Bold'}

						    		if(t.countToday > 1)
						    			counter = <Text style={{fontFamily: 'Quicksand-Bold', color: 'white', fontSize: 12, lineHeight: 17, backgroundColor: 'green', paddingHorizontal: 8, borderRadius: 8, overflow: 'hidden'}}>{t.countToday}</Text>;

									let taskName = t.name;
									let goalName = g.name;
									if(g.name == "5 Star" && false) {
										taskName = t.prefix+"/"+t.name;
										goalName = t.prefix;
									}

						    		return <TouchableWithoutFeedback
										key={index1}
										onPress={() => {
							    			ReactNativeHapticFeedback.trigger('impactHeavy', true);
											if(!this.state.editMode) {
												this.props.dashboardFunctions.createLog(goalName, t.name, moment().unix());
												this.setState({ state: this.state });
											}
											else {
												this.props.dashboardFunctions._toggleNTModal(goalName, taskName);
											}
										}}
										onLongPress={() => {
											let reverse = model.getLatestEntryOfToday(goalName, taskName).then(function(reverse){
												console.log("REVERSE", reverse)
												model.deleteLogById(reverse);

												ToastAndroid.show("Entry deleted "+reverse, ToastAndroid.LONG);
												that.props.dashboardFunctions.loadDashboard();
												AsyncStorage.setItem("RefreshJournal", "yes");
											});
										}}
						    		>
						    			<View style={[styles.rowwrap, {marginRight: 15, marginBottom: 10, alignItems: 'center'}]}>
											<Icon name='circle-edit-outline' type="material-community" size={18} iconStyle={[editIconStyle, {marginRight: 5, lineHeight: 26}]}/>
							    			<Text style={[styles.border, {fontFamily: 'Quicksand-Bold', fontSize: 15, marginRight: 0}, styles.optional]}>{taskName}</Text>
							    			{counter}
							    		</View>
						    		</TouchableWithoutFeedback>
						    	})
						    }
							<TouchableWithoutFeedback  onPress={() => {this.props.dashboardFunctions._toggleNTModal(g.name);}} >
								<View style={[styles.rowwrap, {alignItems: 'center'}]}>
									<Icon name="plus-circle-outline" color="grey" type="material-community" size={19}/>
									<Text style={[ {fontFamily: 'Quicksand-Bold', fontSize: 15, marginLeft: 5, color: "grey"}]}>Add activity</Text>
								</View>
							</TouchableWithoutFeedback>
						    </View>
							<View style={{height: 100}}>
								{ this.state.chartData && <BarChart
									style={{ width: '100%', height: 100, borderWidth: 0}}
									data={ this.state.chartData }
									contentInset={{ top: 0, bottom: 20, left: 0, right: 0}}
									// curve={ shape.curveNatural }
									svg={{ stroke: 'rgba(0,0,0,0)', fill: "#C7EBCA", strokeWidth: 2, strokeOpacity: 1 }}
									yAccessor={({ item }) => item.value}
								>
								</BarChart>}
							</View>
							<ChartBottom data={{'Top': g.topScore, 'Avg': this.state.agvScore, 'Recent': g.recentScore, 'Week': g.completed.weeks}}></ChartBottom>
							<Icon 
								name="settings-outline"
								color="grey"
								type="material-community"
								size={28}
								containerStyle={{marginTop: 30, alignItems: 'flex-end'}}
								onPress={() => {this.setState({expanded: !this.state.expanded})}}
							/>
						</View>
						{
							this.state.expanded &&
							<ControlFooter dashboardFunctions={this.props.dashboardFunctions} g={g} snooze={this.snooze} _toggleEditMode={this._toggleEditMode}/>
						}
					</View>
					{/*
					//<Text style={{color: 'rgba(255,255,255,.5)'}}> / {g.duration}</Text>
					typeof g.items != "undefined" &&
					<View style={[styles.rowwrap, styles.border, g.cardStatus.metadata]}>
						<View style={{flex: 1}}>
							<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Week</Text>
							<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.completed.weeks}</Text>
						</View>
						{/* <View style={{flex: 1}}>
							<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Day</Text>
							<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.completed.days}</Text>
						</View> */}
						{/* <View style={{flex: 1}}> */}
						{/*
							(() => {
								if(g.recentScore > 0)
								{
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Recent Score</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.recentScore}</Text>
									</View>);
								}
							})()
						}
						</View>
						<View style={{flex: 1}}>
						{
							(() => {
								if(g.topScore > 0)
								{
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Top Score</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.topScore}</Text>
									</View>);
								}
							})()
						}
						</View>
						<View style={{flex: 1}}>
						{
							(() => {
								if(g.totalPointsToday > 0) {
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Today</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.totalPointsToday}</Text>
									</View>);
								}
							})()
						}
						</View>
					</View>
					*/}

				</View>
			// </TouchableWithoutFeedback>
		);
	}
}
