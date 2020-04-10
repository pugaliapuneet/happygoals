import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, ToastAndroid, AsyncStorage, TouchableHighlight} from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements'
import {styles} from '../../styles.js';

import LinearGradient from 'react-native-linear-gradient';

import model from './model.js';

var moment = require('moment');
var Datastore = require('react-native-local-mongodb');
var dbgoals = new Datastore({ filename: 'goals1', autoload: true });

export default class newGoal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 2,
			// itemPoints: 1,
		}

		this.updateIndex = this.updateIndex.bind(this);
		this.pushItem = this.pushItem.bind(this);
		var that = this;
		this.taskIndex = null;
		if (props.taskName) {
			const {goalName, taskName} = props;
			dbgoals.findAsync(
				{name: goalName, "items.name": taskName},
			).then(function(docs) {
				docs[0].items.forEach((task, index) => {
					if (task.name == taskName) {
						that.taskIndex = index;
						that.setState({itemName: task.name})
						that.setState({itemPoints: task.points});
					}
				});
			})
		}
	}

	buttons = ['2', '4', '8', '12', '24'];

	updateIndex(selectedIndex) {
		this.setState({selectedIndex});
		this.setState({goalDuration: this.buttons[selectedIndex]});
	}

	pushItem() {
		const {goalName} = this.props;
		const {itemName} = this.state;
		const {itemPoints} = this.state;

		if(typeof itemName == "undefined") {
			ToastAndroid.show("Task Name not specified", ToastAndroid.LONG);
			return;
		}
		if(typeof itemPoints == "undefined") {
			ToastAndroid.show("Points not specified", ToastAndroid.LONG);
			return;
		}

		var Datastore = require('react-native-local-mongodb');
		var dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		var that = this;
		dbgoals.update(
			{name: goalName, $not: {deleted: 1}},
			{
				$addToSet: {items: {name: itemName, points: itemPoints}},
				$set: {mode: 'tasks'}
			},
			{},
			function(err, numReplaced){
				// model.dumpDocument(goalName);

				// that.data.postSubmit();
				AsyncStorage.setItem("RefreshDashboard", "yes");

				ToastAndroid.show(goalName+" edited successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
				that.props.closeModal();
				that.props.postSubmit();
			}
		)
	}

	updateItem = () => {
		const {goalName} = this.props;
		const {itemName, itemPoints} = this.state;

		if(typeof itemName == "undefined") {
			ToastAndroid.show("Task Name not specified", ToastAndroid.LONG);
			return;
		}
		if(typeof itemPoints == "undefined") {
			ToastAndroid.show("Points not specified", ToastAndroid.LONG);
			return;
		}

		var that = this;
		dbgoals.update(
			{name: goalName, "items.name": this.props.taskName, $not: {deleted: 1}},
			{
				$set: {
					["items."+this.taskIndex+".name"]: itemName,
					["items."+this.taskIndex+".points"]: itemPoints
				}
			},
			{},
			function(err, numReplaced){console.log(goalName, itemName, that.props.taskName)
				let dblogs = new Datastore({ filename: 'logs2', autoload: true });
				dblogs.update(
					{"goalName": goalName, "itemName": that.props.taskName},
					{
						$set: {"itemName": itemName}
					},
					{multi:true},
					function(error, numAffected, affectedDocuments, upsert){model.dumpCollection("dblogs");
						AsyncStorage.setItem("RefreshDashboard", "yes");
		
						ToastAndroid.show(goalName+" edited successfully. "+numAffected+" log row upated.", ToastAndroid.LONG);
						that.props.closeModal(undefined,undefined,goalName);
						that.props.postSubmit();
					}
				)
			}

		)
	}

	setPoints = (selectedIndex) => { this.setState({itemPoints: selectedIndex+1});}

	render() {
		let that = this;
		const pointPicker = [];
		for(let i = 1; i <= 5; i++)
		{
			let label = i+" points";
			pointPicker.push(<Picker.Item key={i-1} label={label} value={i} />);
		}

		//<Text style={styles.goal}>New task for {this.props.goalName}</Text>
		// <Picker
		// 	style={[styles.picker, {marginBottom: 25}]}
		// 	textStyle={styles.pickerItem}
		// 	itemTextStyle={styles.pickerItem}
		// 	onValueChange={(inputVal) => this.setState({itemPoints: inputVal})}
		// 	selectedValue={this.state.itemPoints}>
		// 	{pointPicker}
		// </Picker>
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
						placeholder="Task Name"
						value={this.state.itemName}
						onChangeText={(inputVal) => this.setState({itemName: inputVal})} />
					<ButtonGroup
						buttons={['1', '2', '3', '4', '5']}
						buttonStyle={{margin: 0, borderWidth: 0, borderColor: '#ccc', borderRadius: 4, padding: 0}}
						containerStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
						textStyle={{fontSize: 25, fontFamily: 'Quicksand-Medium', color: 'rgba(255,255,255,0.5)'}}
						innerBorderStyle={{width: 0, color: 'orange'}}
						selectedTextStyle={{color: 'orange'}}
						selectedButtonStyle={{backgroundColor: 'transparent'}}

						onPress={this.setPoints}
						selectedIndex={this.state.itemPoints-1}
						/>
					<Text style={{color: 'black', opacity: 0.6, textAlign: 'center', padding: 10, marginBottom: 15}}>points</Text>
					<View style={{alignItems: 'center', marginTop: 50}}>
						{
						(this.props.taskName &&
						<TouchableHighlight onPress={this.updateItem}>
							<Text style={styles.yellowButton}>Update</Text>
						</TouchableHighlight>) ||
						<TouchableHighlight onPress={this.pushItem}>
							<Text style={styles.yellowButton}>Create</Text>
						</TouchableHighlight>
						}
					</View>
				</View>
			</View>
		)
	}
}
