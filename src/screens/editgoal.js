import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, AsyncStorage, ToastAndroid} from 'react-native';
import { ButtonGroup } from 'react-native-elements'
import {styles} from '../../styles.js';
import DatePicker from 'react-native-datepicker';

import model from './model.js';

var moment = require('moment');

export default class editGoal extends Component {
	constructor(props) {
		super(props);

		var Datastore = require('react-native-local-mongodb');
		this.dbgoals = new Datastore({ filename: 'goals1', autoload: true });
		this.dblogs = new Datastore({ filename: 'logs2', autoload: true });

		this.durationButtons = [2, 4, 8, 12, 24];
		this.modeButtons = ['habits', 'tasks'];
		this.statusButtons = ['Inactive', 'Active'];

		this.data = this.props.navigation.getParam('data');

		let startDateLabel;
		if(this.data.g.startDate) {
			startDateLabel = moment.unix(this.data.g.startDate).format("DD-MM-YYYY");
		}
		else {
			startDateLabel = moment().format("DD-MM-YYYY");
		}

		this.state = {
			selectedDuration: this.durationButtons.indexOf(this.data.g.duration),
			selectedMode: this.modeButtons.indexOf(this.data.g.mode),
			selectedStatus: this.data.g.status,

			goalName: this.data.g.name,

			startDateLabel: startDateLabel,

			tasks: [],
			habits: [],
		}

		this.updateDuration = this.updateDuration.bind(this);
		this.updateMode = this.updateMode.bind(this);
		this.updateStatus = this.updateStatus.bind(this);

		this.editGoal = this.editGoal.bind(this);
		this.deleteGoal = this.deleteGoal.bind(this);
		// this.getGoalTasks = this.getGoalTasks.bind(this);

		// this.cwm = this.cwm.bind(this);
		// this.cwm();
	}

	componentDidMount(){
		let that = this;

		model.getGoalItems(this.data.g.name).then(function(data){
			that.setState({items: data});
		})
	}

	updateDuration(selectedIndex) { this.setState({selectedDuration: selectedIndex}); }
	updateMode(selectedIndex) {
		this.setState({selectedMode: selectedIndex}, function(){
			let that = this;

			model.getGoalItems(this.data.g.name).then(function(data){
				that.setState({items: data});
			})
		});

	}
	updateStatus(selectedIndex) { this.setState({selectedStatus: selectedIndex}); }

	deleteGoal() {
		const goalName = this.data.g.name;
		const goalId = this.data.g._id;

		const that = this;

		var Datastore = require('react-native-local-mongodb');
		dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		dbgoals.update(
			{_id: goalId},
			{$set: {deleted: 1}},
			{},
			function(err, numReplaced){
				that.data.postSubmit();
				AsyncStorage.setItem("RefreshDashboard", "yes");

				ToastAndroid.show(goalName+" deleted successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
				that.props.navigation.goBack();
			}
		);
	}

	editGoal() {
		var Datastore = require('react-native-local-mongodb');
		dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		const goalId = this.data.g._id;
		const goalName = this.state.goalName;
		// console.log(this.data.g);

		const selectedDuration = this.durationButtons[this.state.selectedDuration];
		const selectedMode = this.modeButtons[this.state.selectedMode];
		const {selectedStatus} = this.state;
		const goalStartDate = moment(this.state.startDateLabel, "DD-MM-YYYY").unix();

		//habits/tasks
		const items = [];
		for(let i = 0; i < 20; i++)
		{
			item = {}

			if(selectedMode == "tasks" && typeof this.state.items[i] !== 'undefined')
			{
				item.name = this.state.items[i].name;
				item.points = this.state.items[i].points;
			}
			else if(selectedMode == "habits" && typeof this.state.items[i] !== 'undefined')
			{
				item.name = this.state.items[i].name;
				item.repetition = this.state.items[i].repetition;
			}

			if(item.name)
				items.push(item);
		}
		// console.log("SAVING ITEMS", items);
		const that = this;

		// console.log("SAVING THIS FOR EDIT", {_id: goalId, name: goalName, duration: selectedDuration, mode: selectedMode, status: selectedStatus, startDate: goalStartDate, items: items});
		dbgoals.update(
			{_id: goalId},
			{$set: {name: goalName, duration: selectedDuration, mode: selectedMode, status: selectedStatus, startDate: goalStartDate, items: items}},
			{},
			function(err, numReplaced){
				model.dumpDocument(goalName);

				//TODO: should only happen if the name has actually changed
				//TODO: shouldn't happen at all, use ID so that goal name in logs don't have to be synced all the time with goal name changes
				that.dblogs.update(
					{goalName: that.data.g.name},
					{$set: {goalName: goalName}},
					{multi: true},
					function(err, numReplaced){
						// ToastAndroid.show(numReplaced+" logs upated.", ToastAndroid.LONG);
					}
				)

				that.data.postSubmit();
				AsyncStorage.setItem("RefreshDashboard", "yes");

				ToastAndroid.show(goalName+" edited successfully. "+numReplaced+" row upated.", ToastAndroid.LONG);
				that.props.navigation.goBack();
			}
		)
	}

	/* deprecated 25th march 2019
	cwm() {
		let self = this;
		if(this.modeButtons[this.state.selectedMode] == "tasks")
		{
			this.getGoalTasks(this.data.g.id).then(function(data){
				self.setState({tasks: data});
			});
		}
		else if(this.modeButtons[this.state.selectedMode] == "habits")
		{

		}
	}
	*/

	render() {
		var rtf = <Text>Select mode to start...</Text>;
		if(this.modeButtons[this.state.selectedMode] == "tasks")
		{
			console.log("RENDER", "tasks");
			rtf = this._renderTaskForm();
		}
		else if(this.modeButtons[this.state.selectedMode] == "habits")
		{
			console.log("RENDER", "habits", this.state.items);
			rtf = this._renderHabitForm();
		}

		return(
			<ScrollView style={{margin: 16}}>
				<TextInput
					style={styles.textInput}
					onChangeText={(inputVal) => { this.setState({goalName: inputVal}); }}
					value={this.state.goalName} />
				<Text>{this.data.g.name}</Text>
				<DatePicker
					style={{width: 200}}
					date={this.state.startDateLabel}
					mode="date"
					placeholder="select date"
					format="DD-MM-YYYY" minDate="01-01-2018" maxDate="01-12-2100"
					confirmBtnText="Confirm" cancelBtnText="Cancel"
					onDateChange={(date) => {this.setState({startDateLabel: date})}} />

				<ButtonGroup
					buttons={this.statusButtons}
					buttonStyle={{margin: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 3}}
					containerStyle={{borderWidth: 0}}
					textStyle={{fontSize: 12, fontFamily: 'Quicksand-Medium'}}
					innerBorderStyle={{width: 0, color: 'orange'}}

					selectedIndex={this.state.selectedStatus}
					onPress={this.updateStatus} />

				<Text style={[{marginTop: 25, position: 'relative', right: 'auto'}]}>Mode</Text>
				<ButtonGroup
					buttons={this.modeButtons}
					buttonStyle={{margin: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 3}}
					containerStyle={{borderWidth: 0}}
					textStyle={{fontSize: 12, fontFamily: 'Quicksand-Medium'}}
					innerBorderStyle={{width: 0, color: 'orange'}}

					selectedIndex={this.state.selectedMode}
					onPress={this.updateMode} />

				{rtf}

				<Text style={[{marginTop: 25, position: 'relative', right: 'auto'}]}>Weeks</Text>
				<ButtonGroup
					buttons={this.durationButtons}
					buttonStyle={{margin: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 3}}
					selectedButtonStyle={{backgroundColor: 'green'}}
					containerStyle={{borderWidth: 0}}
					textStyle={{fontSize: 12, fontFamily: 'Quicksand-Medium'}}
					innerBorderStyle={{width: 0, color: 'orange'}}

					selectedIndex={this.state.selectedDuration}
					onPress={this.updateDuration} />

				<Button onPress={this.editGoal} title="Edit" color="#841584" accessibilityLabel="Learn more about this purple button" />
				<Button onPress={this.deleteGoal} title="Delete" color="#ff6600" accessibilityLabel="Learn more about this purple button" />
			</ScrollView>
		)
	}

	_renderTaskForm() {
		let tasks = this.state.items;

		const pointPicker = [];
		for(let i = 1; i <= 5; i++)
		{
			let label = i+" points";
			pointPicker.push(<Picker.Item key={i-1} label={label} value={i} />);
		}

		let x = [];
		// let entries = Math.max(tasks.length, 10);
		for(let i2 = 1; i2 <= 20; i2++) {

			let key = "task"+i2;
			let pickerKey = "task"+i2+"points";
			let currentName = "";
			let currentPoints = "";
			if(typeof tasks !== 'undefined' && typeof tasks[i2-1] !== 'undefined' && tasks[i2-1].name)
			{
				currentName = this.state.items[i2-1].name;
				currentPoints = this.state.items[i2-1].points;
			}
			x.push(
				<View style={styles.horizontal} key={i2-1}>
					<TextInput style={[styles.textInput, {flex: 1}]} placeholder={"Task "+i2}
						onChangeText={(inputVal) => {
							let t = this.state.items ? this.state.items : [];
							t[i2-1] = (typeof t[i2-1] === 'undefined') ? {} : t[i2-1];
							t[i2-1].name = inputVal;
							this.setState({items: t});
						}}
            		value={currentName} />
					<Picker
						style={[styles.picker, {flex: 1}]}
						textStyle={styles.pickerItem}
						itemTextStyle={styles.pickerItem}
						onValueChange={(inputVal) => {
							let t = this.state.items ? this.state.items : [];
							t[i2-1] = (typeof t[i2-1] === 'undefined') ? {} : t[i2-1];
							t[i2-1].points = inputVal;
							this.setState({items: t});
						}}
						selectedValue={currentPoints}>
						{pointPicker}
					</Picker>
				</View>
			);
		}
		return x;

	}

	_renderHabitForm() {
		let habits = this.state.items;

		const repPicker = [];
		for(var i = 1; i <= 7; i++)
		{
			var label = i+" times/week";
			repPicker.push(<Picker.Item key={i-1} label={label} value={i}/>);
		}
		let x = [];

		// console.log("1");
		for(let i2 = 1; i2 <= 10; i2++)
		{
			// console.log("2");
			let currentName = "";
			let currentRepetition = "";
			if(typeof habits !== 'undefined' && typeof habits[i2-1] !== 'undefined' && habits[i2-1].name)
			{
				// console.log("3");
				currentName = this.state.items[i2-1].name;
				currentRepetition = this.state.items[i2-1].repetition;
			}
			x.push(
				<View key={i2}>
					<View style={styles.horizontal}>
						<TextInput style={[styles.textInput, {flex: 1}]} placeholder={"Habit "+i2}  value={currentName}
							onChangeText={(inputVal) => {
								let h = this.state.items ? this.state.items : [];
								h[i2-1] = (typeof h[i2-1] === 'undefined') ? {} : h[i2-1];
								h[i2-1].name = inputVal;
								this.setState({items: h});
							}} />
						<Picker
							style={[styles.picker, {flex: 1}]}
							textStyle={styles.pickerItem}
							itemTextStyle={styles.pickerItem}

							onValueChange={(inputVal) => {
								let h = this.state.items ? this.state.items : [];
								h[i2-1] = (typeof h[i2-1] === 'undefined') ? {} : h[i2-1];
								h[i2-1].repetition = inputVal;
								this.setState({items: h});
							}}
							selectedValue={currentRepetition} >
							{repPicker}
						</Picker>
					</View>
				</View>
			);
		}

		return x;
	}
}
