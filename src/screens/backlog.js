import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity,Image, ScrollView, RefreshControl, ToastAndroid, InteractionManager} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles, listed} from '../../styles.js';

import model from './model.js';

import LinearGradient from 'react-native-linear-gradient';

export default class JournalScreen extends Component{
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.loadJournal();
		});
	}

	loadJournal = () => {
		const that = this;

		model.getActiveGoals().then(function(data){
			that.setState({goals: data});
			that.setState({refreshing: false});
		});

	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this.loadJournal();
	}

	render() {
		if(typeof this.state.goals !== 'undefined')
		{
			const navigation = this.props.navigation;
			const goals = this.state.goals;
			let backlogs = 0;
			let backlogsClearedToday = 0;
			let slowdowns = [];
			let acceleration = [];

			goals.map((goal, i) => {
				goal.items && goal.items.map((item, i2) => {
					if(item.lastActivity > 7) // || item.lastActivity == -1
						backlogs++
					if(item.lastActivity == 0 && item.secondLastActivity > 7)
						backlogsClearedToday++
				});
				if (goal.mode == 'tasks') {
					let p = goal.recentScore/goal.bigScore*100;
					if (p < 75) {
						slowdowns.push(<Text style={[styles.label]}>{goal.name}</Text>);
					}
					if (p > 125) {
						acceleration.push(<Text style={[styles.label]}>{goal.name}</Text>);
					}
				}
			});

			// || item.lastActivity == -1
			// <TouchableOpacity onPress={this.props.navigation.toggleDrawer}>
			// 	<Image source={{uri: "https://static.thenounproject.com/png/1166840-200.png"}} style={{width: 32, height: 32, marginLeft: 10, marginTop: 10}} />
			// </TouchableOpacity>
			return (
				<View style={[styles.body, {height: '100%'}]}>
					{/* <LinearGradient colors={['#37474F', '#78909C']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient> */}
					<ScrollView style={[{}]}
						contentContainerStyle={{padding: 15}}
		    			showsVerticalScrollIndicator={false}
		    			refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
					}>
						<Text style={[styles.journalScore, {textAlign: 'left', paddingVertical: 20}]}>Backlogs</Text>
						<Text style={[listed.score, {padding: 8, marginTop: 0, fontSize: 35, lineHeight: 35, color: '#0097A7', display: 'none'}]}>{backlogsClearedToday} cleared today</Text>
	    				<View key="0">
							{
								(() => {
									let x = [];
									let y = [];
									// x.push(<Text key="PT" style={[styles.goal, {marginTop: 20, marginLeft: 10, color: 'pink'}]}>Pending Today:</Text>)
									// y.push(<Text key="CT" style={[styles.goal, {marginTop: 20, marginLeft: 10, color: 'pink'}]}>Cleared Today:</Text>)

									goals.map((goal, i) => {

										let z = [];
										goal.items && goal.items.map((item, i2) => {

											//cleared today
											if(item.lastActivity == 0 && item.secondLastActivity > 7) {
												// y.push(<View key={i2} style={[styles.rowwrap, {justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 10}]}>
												// 	<Text style={styles.label}>{goal.name} - {item.name}</Text>
												// </View>);

												z.push(<View key={i2} style={[styles.rowwrap, {justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 10}]}>
													<Text style={[styles.label, {color: '#0097A7', fontSize: 14}]}>{item.name}</Text>
													<Text style={{fontSize: 14}}>{item.lastActivity}</Text>
												</View>);
											}
											//pending
											else if(item.lastActivity > 7) {
												z.push(<View key={i2} style={[styles.rowwrap, {justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 10}]}>
													<Text style={[styles.label, {fontSize: 14}]}>{item.name}</Text>
													<Text style={{fontSize: 14}}>{item.lastActivity}</Text>
												</View>);
											}
										});

										if(z.length)
										{
											x.push(<Text style={[styles.label, {color: '#0097A7'}]}>{goal.name}</Text>);
											x.push(<View key="0" style={[styles.rowwrap, {marginBottom: 10}]}>{z}</View>);
										}
	    							});
									return y.concat(x);
								})()
	    					}
	    				</View>
						<Text style={[styles.journalScore, {textAlign: 'left', paddingVertical: 20}]}>Slowdowns</Text>
						<View>
							{slowdowns}
						</View>
						<Text style={[styles.journalScore, {textAlign: 'left', paddingVertical: 20}]}>Acceleration</Text>
						<View>
							{acceleration}
						</View>
			    	</ScrollView>
				</View>
			)
		}
		else
			return <View></View>
	}
}
