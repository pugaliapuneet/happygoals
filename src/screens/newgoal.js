import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, ToastAndroid, ImageBackground, LayoutAnimation, TouchableHighlight} from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements'
import {styles} from '../../styles.js';
import LinearGradient from 'react-native-linear-gradient';

var moment = require('moment');

export default class newGoal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 0,
			showIdeas: false,
			mode: 'tasks',
		}

		this.updateIndex = this.updateIndex.bind(this);
		this.createGoal = this.createGoal.bind(this);

		this.goals = [
			{name: 'Health & Fitness', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Group Activity', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Rest and relaxation', image: require('../../assets/images/ideas/meditate.jpeg')},
			{name: 'Socialize', image: require('../../assets/images/ideas/friends.jpeg')},
			{name: 'Fun', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Discomfort', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Nutrition', image: require('../../assets/images/ideas/protien.jpeg')},
			{name: 'Social Skills', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Positive life', image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Personal care', image: require('../../assets/images/ideas/Workout.jpeg')},
		];

		this.ideaStyle = {display: 'none'};
	}

	// buttons = ['2', '4', '8', '12', '24'];
	// buttons = ['Earn points', 'Follow a routine'];
	buttons = ['Earn points'];

	updateIndex(selectedIndex) {
		this.setState({selectedIndex});
		// this.setState({goalDuration: this.buttons[selectedIndex]});
		if(this.buttons[selectedIndex] == "Earn points")
			this.setState({mode: 'tasks'})
		else if(this.buttons[selectedIndex] == "Follow a routine")
			this.setState({mode: 'habits'})
	}

	createGoal() {
		const {goalName} = this.state;
		const {goalCategory} = this.state;
		const {goalDuration} = this.state;
		const {mode} = this.state;

		if(typeof goalName == "undefined") {
			ToastAndroid.show("Goal Name not specified", ToastAndroid.LONG);
			return;
		}
		if(typeof mode == "undefined") {
			ToastAndroid.show("Mode not specified", ToastAndroid.LONG);
			return;
		}

		const selectedStatus = 1;
		const goalStartDate = moment().unix();

		var Datastore = require('react-native-local-mongodb');
		var dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		var that = this;
		dbgoals.insert({name: goalName, duration: goalDuration, category: goalCategory, status: selectedStatus, startDate: goalStartDate, mode: mode}, function (err, newDoc) {
			dbgoals.find({}, function(err, docs){
				// that.props.navigation.getParam('postSubmit')();
				that.props.postSubmit();
				// console.log(docs);

				ToastAndroid.show(goalName+" created as a new goal.", ToastAndroid.LONG);
				that.props.closeModal();
				// that.props.navigation.goBack();
			});
		});
	}

	// <Text style={[styles.label, {marginTop: 25, position: 'relative', right: 'auto'}]}>Optional</Text>
	// <TextInput
	// 	style={styles.textInput}
	// 	placeholder="Category"
	// 	onChangeText={(inputVal) => this.setState({goalCategory: inputVal})}
	// 	value={this.state.email} />
	//
	// <Text style={[{marginTop: 25, position: 'relative', right: 'auto'}]}>Weeks</Text>
	// <ButtonGroup
	// 	buttons={this.buttons}
	// 	buttonStyle={{margin: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 3}}
	// 	containerStyle={{borderWidth: 0}}
	// 	textStyle={{fontSize: 12, fontFamily: 'Quicksand-Medium'}}
	// 	innerBorderStyle={{width: 0, color: 'orange'}}
	//
	// 	selectedIndex={this.state.selectedIndex}
	// 	onPress={this.updateIndex} />

	//<Text style={[styles.goal, {fontSize: 25}]}>Create a new goal</Text>


	_renderItem = ({item}) => {
		return(<View key={item.name} style={{marginRight: 20, borderRadius: 5, overflow: 'hidden', width: 200, height: 250}}>
			<ImageBackground source={item.image} style={{width: '100%', height: '100%'}}>
				<View style={{width: '100%', height: '100%', backgroundColor: 'rgba('+Math.random()*100+','+Math.random()*100+','+Math.random()*100+',0.5)', padding: 10, paddingVertical: 6, flexDirection: 'column-reverse'}}>
					<Text style={[{color: 'white', marginBottom: 5, padding: 10, }]}>{item.name}</Text>
				</View>
			</ImageBackground>
		</View>)
	};

	_keyExtractor = (item, index) => item.title;

	// <FlatList
	// 	renderItem={this._renderItem}
	// 	data={this.goals}
	// 	keyExtractor={this._keyExtractor}
	// 	horizontal={true}
	// />

	render() {
		let that = this;
		let tasksStyle = this.state.mode == "tasks" ? {borderColor: 'green', borderWidth: 2} : {}
		let habitsStyle = this.state.mode == "habits" ? {borderColor: 'green', borderWidth: 2} : {}

		return(
			<View style={[styles.modal, {padding: 10}]}>
				<LinearGradient colors={['#5D4037', '#795548']} style={{display: 'none', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 5}}></LinearGradient>
				<View style={{padding: 10}}>
					<Icon name='close' type="material-community"
						size={21}
						containerStyle={{position: 'absolute', top: 0, right: 0, padding: 10}}
						color="rgba(0,0,0,0.5)"
						onPress={() => that.props.closeModal()}
					/>

					<TextInput
						style={[styles.bigTextInput, {marginBottom: 25, textAlign: 'center', marginTop: 20, color: '#FFECB3'}]}
						placeholder="Goal Name"
						onChangeText={(inputVal) => this.setState({goalName: inputVal})}
	                	value={this.state.goalName}
					/>

					<View style={[{marginTop: 0, marginBottom: 20, alignItems: 'center'}]}>
						<TouchableOpacity style={[styles.rowwrap, {marginBottom: 20}]} onPress={function(){
								if(that.state.showIdeas)
									that.ideaStyle = {display: 'none'};
								else
									that.ideaStyle = {};

								// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
								that.setState({showIdeas: !that.state.showIdeas});
							}}>
							<Icon name='flash-circle' type="material-community" size={21} containerStyle={{borderWidth: 3, borderColor: '#FFECB3', borderRadius: 100}} color="#FFC107"/>
							<Text style={{color: "#FFE082", display: 'none'}}>I need ideas</Text>
						</TouchableOpacity>
						<View style={[{flexWrap:'wrap', flexDirection:'row',}, this.ideaStyle]}>
						{
							this.goals.map(item => (<Text
								style={{backgroundColor: '#FFECB3', marginRight: 10, marginBottom: 10, color: '#FF8F00', paddingBottom: 4, borderRadius: 15, borderColor: '#999', paddingHorizontal: 10, fontSize: 14, alignSelf: 'center'}}
								onPress={function(){
									that.ideaStyle = {display: 'none'};
									that.setState({goalName: item.name, showIdeas: false});
								}}>{item.name}</Text>))
						}
						</View>
					</View>

					<ButtonGroup
						buttons={this.buttons}
						buttonStyle={{margin: 3, borderWidth: 0, borderColor: '#ccc', borderRadius: 4, padding: 3, paddingBottom: 5}}
						selectedButtonStyle={{backgroundColor: 'rgba(0,0,0,0.4)'}}
						containerStyle={{borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)', borderRadius: 5, backgroundColor: 'transparent'}}
						textStyle={{fontSize: 14, fontFamily: 'Quicksand-Medium', color: 'white'}}
						innerBorderStyle={{width: 0, color: 'orange'}}

						selectedIndex={this.state.selectedIndex}
						onPress={this.updateIndex} />

					{
					this.state.selectedIndex == 1 &&
					<View style={[styles.rowwrap, {marginBottom: 20, marginTop: 20, alignItems: 'center'}]}>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='sync' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>1x-7x/week</Text>
						</View>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='calendar-check' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>Calendar display</Text>
						</View>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='cash-100' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>Maintain 100% score</Text>
						</View>
					</View>
					}
					{
					this.state.selectedIndex == 0 &&
					<View style={[styles.rowwrap, {marginBottom: 20, marginTop: 20, alignItems: 'center'}]}>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='numeric-5' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>1-5 points per task</Text>
						</View>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='counter' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>Daily average score</Text>
						</View>
						<View style={{flex: 1, padding: 2}}>
							<Icon name='summit' type="material-community" size={35}  color="rgba(255,255,255,0.5)"/>
							<Text style={{textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Medium'}}>Beat your daily average</Text>
						</View>
					</View>
					}

					<View style={{alignItems: 'center', marginTop: 50}}>
						<TouchableHighlight onPress={this.createGoal}>
							<Text style={styles.yellowButton}>Create</Text>
						</TouchableHighlight>
					</View>
				</View>
			</View>
		)
	}
}
