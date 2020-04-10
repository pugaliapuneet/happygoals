import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableWithoutFeedback, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import {styles} from '../../styles.js';

export default class ControlFooter extends Component{
	// <TouchableWithoutFeedback onPress={() => this.props._toggleEditMode()}>
	// 	<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
	// 		<Icon name='circle-edit-outline' type="material-community" color="white" size={21}/>
	// 		<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Edit Habit</Text>
	// 	</View>
	// </TouchableWithoutFeedback>
	// <TouchableWithoutFeedback onPress={() => this.props._toggleEditMode()}>
	// 	<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
	// 		<Icon name='circle-edit-outline' type="material-community" color="white" size={21}/>
	// 		<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Edit Task</Text>
	// 	</View>
	// </TouchableWithoutFeedback>


	// <TouchableWithoutFeedback onPress={() => this.props.snooze()}>
	// 	<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
	// 		<Icon name='alarm-snooze' type="material-community" color="white" size={21}/>
	// 		<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Snooze</Text>
	// 	</View>
	// </TouchableWithoutFeedback>
	render() {
		const g = this.props.g;
		return (
			<ScrollView style={[styles.rowwrap, {borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10}]} horizontal={true}>
				{
				g.mode == "habits" &&
				<View style={styles.rowwrap}>
					<TouchableWithoutFeedback onPress={() => {this.props.dashboardFunctions._toggleNHModal(g.name);}}>
						<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
							<Icon name='plus-circle-outline' type="material-community" color="white" size={21}/>
							<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Add Habit</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => {this.props.showAllWeeks();}}>
						<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
							<Icon name='all-inclusive' type="material-community" color="white" size={21}/>
							<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Show all weeks</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				}
				{
				g.mode == "tasks" &&
				<View style={styles.rowwrap}>
					<TouchableWithoutFeedback onPress={() => {this.props.dashboardFunctions._toggleNTModal(g.name);}}>
						<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
							<Icon name='plus-circle-outline' type="material-community" color="white" size={21}/>
							<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Add Task</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => this.props._toggleEditMode()}>
						<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
							<Icon name='circle-edit-outline' type="material-community" color="white" size={21}/>
							<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Edit Task</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				}
				<TouchableWithoutFeedback onPress={() => {
					Alert.alert("Sure?", 'Are you sure you want to close '+g.name+'?',
					[
						{
							text: 'Cancel',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
						{text: 'OK', onPress: () => this.props.dashboardFunctions.closeGoal(g._id, g.name)},
					],
					{cancelable: false},
					);
				}}>
					<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
						<Icon name='check-all' type="material-community" color="white" size={21}/>
						<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Close Goal</Text>
					</View>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => {
					Alert.alert("Sure?", 'Are you sure you want to delete '+g.name+'?',
					[
						{
							text: 'Cancel',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
						{text: 'OK', onPress: () => this.props.dashboardFunctions.deleteGoal(g._id, g.name)},
					],
					{cancelable: false},
					);
				}}>
					<View style={[styles.rowwrap, {paddingLeft: 25, paddingVertical: 16, opacity: 0.75}]}>
						<Icon name='delete-outline' type="material-community" color="white" size={21}/>
						<Text style={{color: 'white', marginLeft: 5, fontSize: 14}}>Delete Goal</Text>
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
		);

	}
}
