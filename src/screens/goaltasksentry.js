import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, TouchableHighlight, Alert, TouchableWithoutFeedback, ToastAndroid, LayoutAnimation, AsyncStorage} from 'react-native';
import {styles, listed, maximizedgreen, maximizedblue, minimized, snoozed, golden} from '../../styles.js';
import CLine from './cline.js';
import CardHeader from './cardheader.js';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ControlFooter from './controlfooter.js';
import { Icon } from 'react-native-elements'

import model from './model.js';
const dbgoals = model.dbgoals;
var moment = require('moment');

import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { AreaChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

export default class goaltaskentry extends Component{
	viewGoal = null;
	constructor(props) {
		super(props);

		this.state = {
			expanded: this.props.data.dummy ? 1:0,
			snoozed: this.props.data.snoozed,
			editMode: false,
		}
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
	/*
	_toggleEditMode = () => {

		let that = this;
		this.forceRender = true;
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({editMode: !this.state.editMode}, function(){
			// console.log(this.state.editMode);
		})
	}
	*/
	shouldComponentUpdate(nextProps) {
		if(this.forceRender)
		{
			this.forceRender = false;
			return true;
		}
		if(typeof this.props.data.items != "undefined" && this.props.data.items.length != nextProps.data.items.length) {
			return true;
		}
		if (this.props.forceRender && this.props.forceRender == this.props.data.name) {
			return true;
		}
		return this.props.data.totalCount == nextProps.data.totalCount ? false : true;
		// return true;
	}

	render(){
		let that = this;

		var moment = require('moment');
		const g = this.props.data;
		g.statLabel = null;

		const data = g.chartData;
		let chartData = [ 50, 10, 40, 95, 85, 91, 35, 53, 24, 50];
		if(typeof g.chartData !== 'undefined') {
			chartData = Object.values(g.chartData); // console.log("CHARTDATA2", chartData);
		}

		if(g.name == "5 Star" && false) {
			g.cardStatus = golden;
		}
		else if(this.state.snoozed && !this.state.expanded) {
			g.cardStatus = snoozed;
		}
		else if(typeof g.items == "undefined") {
			g.cardStatus = maximizedblue;
		}
		else if(g.isCompleted == 1) {
			if(this.state.expanded)
				g.cardStatus = maximizedgreen;
			else
				g.cardStatus = minimized;
		}
		else {
			if(this.state.expanded)
				g.cardStatus = maximizedblue;
			else
				g.cardStatus = listed;
		}

		g.stat = <Text style={[styles.stat, {lineHeight: 48}]}>{g.totalPointsToday}</Text>;

		let optionalCardStyle = {};
		let p = g.recentScore/g.bigScore*100;
		
		if (p < 75) {
			// optionalCardStyle = {borderColor: '#c62828', borderWidth: 2};
			// g.statLegend = <Text style={{position: 'absolute', bottom:-11, alignSelf:'center', textAlign:'center', fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 12, lineHeight: 17, backgroundColor: '#c62828', paddingBottom: 3, paddingHorizontal: 8, borderRadius: 10, overflow: 'hidden'}}>Slowdown</Text>
			g.statLabel = <Text style={{fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 12, lineHeight: 17, backgroundColor: "#c62828", paddingHorizontal: 8, paddingBottom: 2, borderRadius: 5, overflow: 'hidden'}}>Slowdown</Text>
		}
		/*
		else if (p > 125) {
			optionalCardStyle = {borderColor: '#3DA848', borderWidth: 2};
			g.statLegend = <Text style={{position: 'absolute', bottom:-11, alignSelf:'center', textAlign:'center', fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 12, lineHeight: 17, backgroundColor: 'green', paddingBottom: 3, paddingHorizontal: 8, borderRadius: 10, overflow: 'hidden'}}>Acceleration</Text>
		}
		if (g.totalPointsToday >= g.topScore) {
			optionalCardStyle = { borderColor: '#3DA848', borderWidth: 2};
			g.statLegend = <Text style={{position: 'absolute', bottom:-11, alignSelf:'center', textAlign:'center', fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 12, lineHeight: 17, backgroundColor: 'green', paddingBottom: 3, paddingHorizontal: 8, borderRadius: 10, overflow: 'hidden'}}>Top Day</Text>
		}
		*/
		// Override cards' color to a fixed color
		// optionalCardStyle = {backgroundColor: '#37474F'};
		// sortedItems = g.items.sort(function(obj1, obj2) {
		// 	return obj2.points - obj1.points;
		// })

		// <AreaChart
		// 	style={{ bottom: 0, width: '100%', height: 200, position: 'absolute', left: 0, zIndex: 0 }}
		// 	data={ chartData }
		// 	contentInset={{ top: 5, bottom: 0, left: 0, right: -3 }}
		// 	curve={ shape.curveNatural }
		// 	svg={{ fill: 'rgba(0,0,0,0.05)', stroke: "rgba(0,0,0,0.1)", strokeWidth: 1, strokeOpacity: 1 }}>
		//
		// </AreaChart>
		
		// Set goal data at re render
		if (g.name == this.viewGoal)
			this.props.dashboardFunctions.setModalGoalData(g);

		let editIconStyle;
		if(that.state.editMode)
			editIconStyle = {};
		else
			editIconStyle = {display: 'none'};
		
		const Gradient = ({ index }) => (
            <Defs key={index}>
                <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset={'0%'} stopColor={'#8DBF88'} stopOpacity={0.9}/>
                    <Stop offset={'100%'} stopColor={'#FFF'} stopOpacity={0.1}/>
                </LinearGradient>
            </Defs>
        )
		return(
			<TouchableWithoutFeedback onPress={() => { this.viewGoal = g.name; this.props.dashboardFunctions._toggleGCModal(g); }}>
				<View style={[{margin: 10, backgroundColor: '#FFF', borderRadius: 10}, /*g.cardStatus.card,*/ styles.cardShadow, optionalCardStyle]}>
					{g.statLegend}
					<View style={{display: 'flex', flexDirection: 'column', padding: 15, paddingBottom: 70}} >
						<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
							<Text style={{textAlignVertical: 'top'}}>{g.name}</Text>
							{/* <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
								<Icon name='arrow-up' type="material-community" color="green" size={19}/>
								<Icon name='arrow-up' type="material-community" color="green" size={19}/>
							</View> */}
						</View>
						<Text style={[styles.stat]}>{g.totalPointsToday}</Text>
					</View>
					<View style={{position:'absolute', bottom:0, left:0, right:0}}>
						<AreaChart
							style={{ height: 100 }}
							data={chartData}
							contentInset={{ top: 30, bottom: 5 }}
							curve={shape.curveNatural}
							svg={{ fill: 'url(#gradient)' }}
						>
							<Gradient/>
						</AreaChart>
					</View>
					{/* <CardHeader g={g} onP={this.toggle}/> */}
				</View>
			</TouchableWithoutFeedback>
			/*
			<View style={[g.cardStatus.card, styles.cardShadow, optionalCardStyle]}>
				<CardHeader g={g} onP={this.toggle}/>
				{
					this.state.expanded == 1 &&
					<View>
						{
						typeof g.items != "undefined" &&
						<View>
						    <View style={[{flexDirection: 'row', flexWrap: 'wrap', padding: 25, zIndex: 1, paddingBottom: 15}]}>
						    {
						    	g.items.map((t, index1) => {
						    		let counter = <Text></Text>;
						    		styles.optional = {};

						    		if(t.countToday > 0)
						    			styles.optional = {color: 'hsla(100, 70%, 60%, 1)', fontFamily: 'Quicksand-Bold'}

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
											if(!that.state.editMode)
							    				this.props.createLog(goalName, t.name, moment().unix());
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
											<Icon name='circle-edit-outline' type="material-community" color="white" size={18} iconStyle={[editIconStyle, {marginRight: 5, lineHeight: 26}]}/>
							    			<Text style={[styles.border, {fontFamily: 'Quicksand-Bold', fontSize: 15, color: '#fff', marginRight: 0}, styles.optional]}>{taskName}</Text>
											<Icon name='medal' type="material-community" color="white" size={19}/>
							    			{counter}
							    		</View>
						    		</TouchableWithoutFeedback>
						    	})
						    }
						    </View>
						</View>
						}
						{
							!g.dummy &&
							<ControlFooter dashboardFunctions={this.props.dashboardFunctions} g={g} snooze={this.snooze} _toggleEditMode={this._toggleEditMode}/>
						}
					</View>
				}
			</View>
			*/
		)
	}
}
