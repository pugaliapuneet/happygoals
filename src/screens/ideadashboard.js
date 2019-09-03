import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, Alert, ToastAndroid, RefreshControl, Button, LayoutAnimation, ImageBackground, InteractionManager, AsyncStorage} from 'react-native';
import {styles} from '../../styles.js';
import GoalHabitsEntry from './goalhabitsentry.js';
import GoalTasksEntry from './goaltasksentry.js';
import CompletedGoal from './completedgoal.js';
import StatLine from './statline.js';
import model from './model.js';
import { withNavigationFocus } from "react-navigation";
import Modal from "react-native-modal";
import NewGoal from './newgoal';
import NewHabit from './newhabit';
import NewTask from './newtask';

import LinearGradient from 'react-native-linear-gradient';

import { Icon } from 'react-native-elements'

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

var moment = require('moment');

class IdeaDashboardScreen extends Component{
	constructor(props)
	{
		super(props);

		this.state = {
			index: 1
		}

		this.isLoaded = false;
	}
	//
	componentDidMount() {
		this.goals = model.getIdeas();
		this.isLoaded = true;
	}

	moveLeft = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		if(this.state.index > 1) this.setState({index: --this.state.index});
	}

	moveRight = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		if(this.state.index < this.goals.length) this.setState({index: ++this.state.index});
	}

	onSwipeLeft(gestureState) {
		this.moveRight();
	}

	onSwipeRight(gestureState) {
		this.moveLeft();
	}

	render() {
		if(this.isLoaded)
		{
			goal = this.goals[this.state.index-1];

			if(goal.mode == "tasks")
				item = <GoalTasksEntry data={goal}/>;
			else
				item = <GoalHabitsEntry data={goal}/>;

			const config = {
				velocityThreshold: 0.3,
				directionalOffsetThreshold: 80
		    };

			return (
				<GestureRecognizer
					style={[styles.body, {flexGrow: 1}]}
					onSwipeLeft={(state) => this.onSwipeLeft(state)}
					onSwipeRight={(state) => this.onSwipeRight(state)}
					config={config}
				>
					<ScrollView style={[{flexGrow: 1}]} contentContainerStyle={{flexGrow: 1}}>
						<LinearGradient colors={['#00695C', '#80CBC4']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient>

						<View>
							<View style={[{display: 'none', padding: 15, marginTop: 36, marginBottom: 0, alignItems: 'center', position: 'relative'}]}>
								<View style={{alignItems: 'center'}}>
									<Image source={require('../../assets/images/1786310-200-blue.png')} style={{width: 30, height: 30}}/>
								</View>
								<Text style={{color: '#E0F7FA'}}>HappyGoals</Text>
							</View>
							<View style={[{alignItems: 'center', paddingTop: 30, paddingBottom: 30}]}>
								<View style={{borderColor: "#263238", borderWidth: 0, borderRadius: 50, marginHorizontal: 10}}>
									<Text style={{ fontSize: 26, color: 'white', fontFamily: 'Nunito-Regular', textAlign: 'center', marginBottom: 10}}>{goal.title}</Text>
									<Text style={{fontFamily: 'Quicksand-Bold', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12}}>{goal.tip}</Text>
								</View>
							</View>
						</View>

						{item}

						<View style={{height: 10, display: 'none'}}></View>
					</ScrollView>
					<View style={[styles.rowwrap, {flexDirection: 'row-reverse', alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 30, position: 'absolute', bottom: 0, width: '100%', top: 0, backgroundColor: 'rgba(0,0,0,0)'}]}>
						<View style={[styles.rowwrap, {justifyContent: 'space-between', width: 200, backgroundColor: '#00695C', paddingVertical: 10, borderRadius: 5}]}>
							<Icon name='arrow-left' type="material-community" color="white" size={21} containerStyle={{paddingHorizontal: 20}} onPress={this.moveLeft}/>
							<Text style={{fontFamily: 'Quicksand-Bold', textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontSize: 12}}>{this.state.index}/{this.goals.length}</Text>
							<Icon name='arrow-right' type="material-community" color="white" size={21} containerStyle={{paddingHorizontal: 20}} onPress={this.moveRight}/>
						</View>
					</View>
				</GestureRecognizer>
			);
		}
		else
		{
			return (<View style={[styles.body, {height: '100%', alignItems: 'center', justifyContent: 'center'}]}>

			</View>);
		}
	}
}

export default withNavigationFocus(IdeaDashboardScreen);
