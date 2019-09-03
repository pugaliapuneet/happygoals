import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker} from 'react-native';
import styles from '../../styles.js';

export default class startGoal extends Component {
	render() {
		return(
			<View style={{padding: 25}}>
				<Text style={styles.goal}>Create a new goal</Text>
				<TextInput style={styles.textInput} placeholder="Goal Name" />

				<View style={styles.horizontal}>
					<TextInput style={[styles.textInput, {flex: 1}]} placeholder="Habit 1" />
					<Picker style={{flex: 1}}>
						<Picker.Item label="1 times/week" value="1"/>
						<Picker.Item label="2 times/week" value="2"/>
						<Picker.Item label="3 times/week" value="3"/>
						<Picker.Item label="4 times/week" value="4"/>
						<Picker.Item label="5 times/week" value="5"/>
						<Picker.Item label="6 times/week" value="6"/>
						<Picker.Item label="7 times/week" value="7"/>
					</Picker>
				</View>
				<View style={styles.horizontal}>
					<TextInput style={[styles.textInput, {flex: 1}]} placeholder="Habit 2" />
					<Picker style={{flex: 1}}>
						<Picker.Item label="1 times/week" value="1"/>
						<Picker.Item label="2 times/week" value="2"/>
						<Picker.Item label="3 times/week" value="3"/>
						<Picker.Item label="4 times/week" value="4"/>
						<Picker.Item label="5 times/week" value="5"/>
						<Picker.Item label="6 times/week" value="6"/>
						<Picker.Item label="7 times/week" value="7"/>
					</Picker>
				</View>
				<View style={styles.horizontal}>
					<TextInput style={[styles.textInput, {flex: 1}]} placeholder="Habit 3" />
					<Picker style={{flex: 1}}>
						<Picker.Item label="1 times/week" value="1"/>
						<Picker.Item label="2 times/week" value="2"/>
						<Picker.Item label="3 times/week" value="3"/>
						<Picker.Item label="4 times/week" value="4"/>
						<Picker.Item label="5 times/week" value="5"/>
						<Picker.Item label="6 times/week" value="6"/>
						<Picker.Item label="7 times/week" value="7"/>
					</Picker>
				</View>
			</View>
		)
	}
}