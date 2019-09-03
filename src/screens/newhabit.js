import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, ToastAndroid, AsyncStorage, TouchableHighlight} from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements'
import {styles} from '../../styles.js';

import LinearGradient from 'react-native-linear-gradient';

import model from './model.js';

var moment = require('moment');

export default class newGoal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 2,
		}

		this.updateIndex = this.updateIndex.bind(this);
		this.pushItem = this.pushItem.bind(this);
	}

	buttons = ['2', '4', '8', '12', '24'];

	updateIndex(selectedIndex) {
		this.setState({selectedIndex});
		this.setState({goalDuration: this.buttons[selectedIndex]});
	}

	pushItem() {
		const {goalName} = this.props;
		const {itemName} = this.state;
		const {itemRepetition} = this.state;

		if(typeof itemName == "undefined") {
			ToastAndroid.show("Habit Name not specified", ToastAndroid.LONG);
			return;
		}
		if(typeof itemRepetition == "undefined") {
			ToastAndroid.show("Frequency not specified", ToastAndroid.LONG);
			return;
		}

		var Datastore = require('react-native-local-mongodb');
		var dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		var that = this;
		dbgoals.update(
			{name: goalName, $not: {deleted: 1}},
			{
				$addToSet: {items: {name: itemName, repetition: itemRepetition}},
				$set: {mode: 'habits'}
			},
			{},
			function(err, numReplaced){
				model.dumpDocument(goalName);

				// that.data.postSubmit();
				AsyncStorage.setItem("RefreshDashboard", "yes");

				ToastAndroid.show(goalName+" edited successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
				that.props.closeModal();
				that.props.postSubmit();
			}
		)
	}

	setReps = (selectedIndex) => { this.setState({itemRepetition: selectedIndex+1});}

	render() {
		let that = this;
		const repPicker = [];
		for(var i = 1; i <= 7; i++)
		{
			var label = i+" times/week";
			repPicker.push(<Picker.Item key={i-1} label={label} value={i}/>);
		}

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
						placeholder="Habit Name"
						onChangeText={(inputVal) => this.setState({itemName: inputVal})} />

					<ButtonGroup
						buttons={['1', '2', '3', '4', '5', '6', '7']}
						buttonStyle={{margin: 0, borderWidth: 0, borderColor: '#ccc', borderRadius: 4, padding: 0}}
						containerStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
						textStyle={{fontSize: 25, fontFamily: 'Quicksand-Medium', color: 'rgba(255,255,255,0.5)'}}
						innerBorderStyle={{width: 0, color: 'orange'}}
						selectedTextStyle={{color: 'orange'}}
						selectedButtonStyle={{backgroundColor: 'transparent'}}

						onPress={this.setReps}
						selectedIndex={this.state.itemRepetition-1}
						/>
					<Text style={{color: 'black', opacity: 0.6, textAlign: 'center', padding: 10, marginBottom: 15}}>times per week</Text>

					<View style={{alignItems: 'center', marginTop: 50}}>
						<TouchableHighlight onPress={this.pushItem}>
							<Text style={styles.yellowButton}>Create</Text>
						</TouchableHighlight>
					</View>
				</View>
			</View>
		)
	}
}
