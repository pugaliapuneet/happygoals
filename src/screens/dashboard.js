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
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';

var moment = require('moment');

class DashboardScreen extends Component{
	constructor(props)
	{
		super(props);

		this.state = {
			activeSections: [],
			headerPositions: {},
			isNGModalVisible: false,
		}

		this.isLoaded = false;
		this.refreshing = false;

		// this.quotes = [
		// 	"Discipline is the bridge between goals and accomplishment \n\n \n\n Jim Rohn",
		// 	"Your goals are the road maps that guide you and show you what is possible for your life \n\n \n\n Les Brown",
		// 	"The game has its ups and downs, but you can never lose focus of your individual goals and you can't let yourself be beat because of lack of effort \n\n \n\n Michael Jordan",
		// 	"If you want to accomplish the goals of your life, you have to begin with the spirit \n\n \n\n Oprah Winfrey",
		// 	"What keeps me going is goals - Muhammad Ali",
		// ]

		this.createLog = this.createLog.bind(this);
		this.loadDashboard = this.loadDashboard.bind(this);

		this.headerDisplayed = false;
	}

	createLog(goalName, habitName, timestamp, reverse = false) {
		let that = this;
		if(reverse) {
			let _id = model.getLogId(goalName, habitName, timestamp);
			model.deleteLogById(_id);
		}
		else {
			model.createLog(goalName, habitName, timestamp).then(function(data){
				// console.log(data);
				let dateLabel = moment.unix(timestamp).format("DD-MM-YYYY");
				ToastAndroid.show("Entry logged: "+goalName+", "+habitName+", "+timestamp+", "+dateLabel, ToastAndroid.LONG);
				// console.log("loading dashboard");
				that.loadDashboard();
				AsyncStorage.setItem("RefreshJournal", "yes");
			});
		}
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.loadDashboard();
		});
	}

	loadDashboard() {
		const that = this;
		this.renderGoal = null; // Resset force rendering a goal card after update of item of goal
		// console.log("getting active goals");
		model.getActiveGoals().then(function(goals){
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

			that.isLoaded = true;
			that.refreshing = false;
			model.getTotalPointsToday().then(function(totalPointsToday){
				that.setState({goals: goals, totalPointsToday: totalPointsToday});
			})
		});
	}

	_onRefresh = () => {
		this.refreshing = true;
		this.loadDashboard();
	}

	shouldComponentUpdate(nextProps, nextState) {
		// console.log('shouldComponentUpdate', !this.refreshing);
		return !this.refreshing;
		// return true;
	}

	componentDidUpdate(prevProps, prevState) {

		let that = this;

		if (prevProps.isFocused !== this.props.isFocused) {
			AsyncStorage.getItem("RefreshDashboard").then(function(value) {
				if(value == "yes")
				{
					AsyncStorage.setItem("RefreshDashboard", "");
					that._onRefresh();
				}
			});
		}


		Object.entries(this.props).forEach(([key, val]) =>
			prevProps[key] !== val && console.log(`Prop '${key}' changed`)
		);
		Object.entries(this.state).forEach(([key, val]) =>
			prevState[key] !== val && console.log(`State '${key}' changed`)
		);
	}

	_toggleNGModal = () => this.setState({ isNGModalVisible: !this.state.isNGModalVisible });
	_toggleNHModal = (editingGoal) => {
		this.setState({
			isNHModalVisible: !this.state.isNHModalVisible,
			editingGoal: editingGoal,
		});
	};
	_toggleNTModal = (editingGoal, editingTask, renderGoal) => {
		if (renderGoal) {
			this.renderGoal = renderGoal;
		}
		this.setState({
			isNTModalVisible: !this.state.isNTModalVisible,
			editingGoal: editingGoal,
			editingTask: editingTask
		});
	};

	deleteGoal = (id, name) => {
		const goalId = id;
		const goalName = name;

		const that = this;

		var Datastore = require('react-native-local-mongodb');
		dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		dbgoals.update(
			{_id: goalId, name: goalName},
			{$set: {deleted: 1}},
			{},
			function(err, numReplaced){
				AsyncStorage.setItem("RefreshDashboard", "");
				that._onRefresh();
				ToastAndroid.show(goalName+" deleted successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
			}
		);
	}

	closeGoal = (id, name) => {
		const goalId = id;
		const goalName = name;

		const that = this;

		var Datastore = require('react-native-local-mongodb');
		dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		dbgoals.update(
			{_id: goalId, name: goalName},
			{$set: {closed: 1}},
			{},
			function(err, numReplaced){
				AsyncStorage.setItem("RefreshDashboard", "");
				that._onRefresh();
				ToastAndroid.show(goalName+" closed successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
			}
		);
	}

	render() {
		if(this.isLoaded)
		{
			//unpack goals
			let {goals} = this.state;

			//create listing array
			// const listing = [];
			const counterArray = [];

			//Add heading title
			// listing.push(<Text key="title1" style={{fontSize: 18, marginBottom: 60, marginTop: 60, color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Bold', opacity: 0.75}}>HAPPYGOALS</Text>)

			let firstIndex = false;
			//loop over all the ongoing goals
			goals.map((g, index) => {
				counterArray.push(index);
				if(firstIndex === false)
					firstIndex = index;
			});

			//loop over all the completed goals
			let totalGoals = 0;
			goals.map((g, index) => {
				if(g.duration > g.completed.weeks || !g.duration) {
					// listing.push(<CompletedGoal key={g.name} data={g} />);
					totalGoals++;
				}
			});

			let body;

			headerContent = <View>
				<View style={[{padding: 15, marginTop: 36, marginBottom: 0, alignItems: 'center', position: 'relative'}]}>
					<View style={{alignItems: 'center'}}>
						<Image source={require('../../assets/images/1786310-200-blue.png')} style={{width: 30, height: 30}}/>
					</View>
					<Text style={{color: '#E0F7FA'}}>HappyGoals</Text>
				</View>
				<View style={[styles.rowwrap, {justifyContent: 'space-between', alignItems: 'center', padding: 15}]}>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('ideas')}>
						<Icon name='flash-circle' type="material-community" color="white" size={21} containerStyle={{paddingTop: 10, marginTop: 16, paddingBottom: 5}}/>
						<Text style={{borderRadius: 5, color: 'white', paddingVertical: 3, paddingBottom: 5, color: '#FF9100', fontSize: 12, width: 80, textAlign: 'center'}}>Ideas</Text>
					</TouchableOpacity>
					<View style={{borderColor: "#263238", borderWidth: 0, borderRadius: 50, marginHorizontal: 10}}>
						<Text style={{ paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 0, fontSize: 32, color: 'white', fontFamily: 'Nunito-Regular', textAlign: 'center'}}>{this.state.totalPointsToday}</Text>
						<Text style={{fontFamily: 'Quicksand-Bold', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12}}>Points Today</Text>
					</View>
					<TouchableOpacity onPress={this._toggleNGModal} onPress1={() => this.props.navigation.navigate("newGoal", {postSubmit: this.loadDashboard})}>
						<Icon name='plus-circle-outline' type="material-community" color="white" size={21} containerStyle={{paddingTop: 10, marginTop: 16, paddingBottom: 5}}/>
						<Text style={{borderRadius: 5, color: 'white', paddingVertical: 3, paddingBottom: 5, color: '#76FF03', fontSize: 12, width: 80, textAlign: 'center'}}>New Goal</Text>
					</TouchableOpacity>
				</View>
			</View>;

			if(counterArray.length) {
				this.headerDisplayed = false; // console.log("Falsifying header");
				body = <FlatList
					style={{}}
					data={counterArray}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item}) => {
						let i = item;
						// console.log(i, goals[i].name)
						let header;
						if(i == firstIndex) {
							header = headerContent;
							this.headerDisplayed = true;
						}

						let dashboardFunctions = {
							_toggleNHModal: this._toggleNHModal,
							_toggleEHModal: this._toggleEHModal,
							_toggleNTModal: this._toggleNTModal,
							createLog: this.createLog,
							deleteGoal: this.deleteGoal,
							closeGoal: this.closeGoal,
							loadDashboard: this.loadDashboard,
						}

						if(goals[i].mode == "tasks")
							return(<View>{header}<GoalTasksEntry navigation={this.props.navigation} key={goals[i].name} data={goals[i]} createLog={this.createLog} dashboardFunctions={dashboardFunctions} forceRender={this.renderGoal}/></View>);
						else
							return(<View>{header}<GoalHabitsEntry navigation={this.props.navigation} key={goals[i].name} data={goals[i]} createLog={this.createLog} dashboardFunctions={dashboardFunctions}/></View>);
					}}
				/>
			}
			else {
				body =
				<View>
					{headerContent}
					<Text style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 200}}>You don't have any goals</Text>
					<Text style={{color: 'rgba(255,255,150,0.75)', textAlign: 'center', marginTop: 20}} onPress={() => this.props.navigation.navigate('onboarding')}>How does it work?</Text>
				</View>
			}


			return (
				<View style={[styles.body, {position: 'relative', height: '100%'}]}>
					<LinearGradient colors={['#37474F', '#78909C']} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}></LinearGradient>

					{body}

					<View style={{height: 10, display: 'none'}}></View>

					<Modal
						isVisible={this.state.isNGModalVisible}
						onBackdropPress={() => this.setState({ isNGModalVisible: false })}
						onSwipe={() => this.setState({ isNGModalVisible: false })}
						swipeDirection="down"
						hideModalContentWhileAnimating={true}
						backdropColor='black' useNativeDriver={false}
						backdropOpacity	= {0.85}
					>
						<NewGoal closeModal={this._toggleNGModal} postSubmit={this.loadDashboard}/>
					</Modal>

					<Modal
						isVisible={this.state.isNHModalVisible}
						onBackdropPress={() => this.setState({ isNHModalVisible: false })}
						onSwipe={() => this.setState({ isNHModalVisible: false })}
						swipeDirection="down"
						hideModalContentWhileAnimating={true}
						backdropColor='black' useNativeDriver={false}
						backdropOpacity	= {0.85}
					>
						<NewHabit closeModal={this._toggleNHModal} goalName={this.state.editingGoal} postSubmit={this.loadDashboard}/>
					</Modal>

					<Modal
						isVisible={this.state.isNTModalVisible}
						onBackdropPress={() => this.setState({ isNTModalVisible: false })}
						onSwipe={() => this.setState({ isNTModalVisible: false })}
						swipeDirection="down"
						hideModalContentWhileAnimating={true}
						backdropColor='black' useNativeDriver={false}
						backdropOpacity	= {0.85}
					>
						<NewTask closeModal={this._toggleNTModal} goalName={this.state.editingGoal} taskName={this.state.editingTask} postSubmit={this.loadDashboard}/>
					</Modal>
					<BannerAd
						unitId={TestIds.BANNER}
						size={BannerAdSize.SMART_BANNER}
						requestOptions={{
						requestNonPersonalizedAdsOnly: true,}}
						onAdLoaded={() => {
						console.log('Advert loaded');}}
						onAdFailedToLoad={(error) => {
						console.error('Advert failed to load: ', error);}}
					/>
				</View>
			);
		}
		else
		{
			//<Text style={{alignItems: 'stretch', textAlign: 'center', padding: 25, color: 'white'}}>{this.quotes[Math.floor(Math.random()*this.quotes.length)]}</Text>
			return (<View style={[styles.body, {height: '100%', alignItems: 'center', justifyContent: 'center'}]}>

			</View>);
		}
	}
}

export default withNavigationFocus(DashboardScreen);
