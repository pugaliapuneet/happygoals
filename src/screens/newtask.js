import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, ToastAndroid, AsyncStorage, TouchableHighlight} from 'react-native';
import { ButtonGroup, Icon, Divider } from 'react-native-elements'
import {styles, primaryColor} from '../../styles.js';

import { Svg, Path, Text as SvgText } from 'react-native-svg';

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

		// TODO: refactor the buttons into one func/component. Is it possible?
		const button1 = () => {
			let selected = this.state.itemPoints == 1;
			let color = selected ? "#3DA848" : "#BCBCBC";
			let txtColor = selected ? "white" : color;
			return <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<Path d="M25.9802 2.80112L42.3318 12.2417C43.26 12.7776 43.8318 13.768 43.8318 14.8398V33.721C43.8318 34.7928 43.26 35.7832 42.3318 36.3191L25.9802 45.7597C25.052 46.2956 23.9084 46.2956 22.9802 45.7597L6.62863 36.3191C5.70042 35.7832 5.12863 34.7928 5.12863 33.721V14.8398C5.12863 13.768 5.70042 12.7776 6.62863 12.2417L22.9802 2.80112C23.9084 2.26522 25.052 2.26522 25.9802 2.80112Z" stroke={color} stroke-width="2"/>
				{selected && <Path d="M23.4802 4.85775C24.099 4.50048 24.8614 4.50048 25.4802 4.85775L40.8007 13.703C41.4195 14.0603 41.8007 14.7206 41.8007 15.4351V33.1257C41.8007 33.8402 41.4195 34.5005 40.8007 34.8577L25.4802 43.703C24.8614 44.0603 24.099 44.0603 23.4802 43.703L8.15972 34.8577C7.54091 34.5005 7.15972 33.8402 7.15972 33.1257V15.4351C7.15972 14.7206 7.54091 14.0603 8.15972 13.703L23.4802 4.85775Z" fill="#3DA848"/>}
				{/* <Path d="M25.3045 28.1857H27.6953V30.3918H19.3783V28.1857H22.4614V20.4688L19.8306 22.1118L18.5937 20.1088L22.7199 17.598H25.3045V28.1857Z" fill={txtColor}/> */}
				<SvgText x="50%" y="63%" dominant-baseline="middle" textAnchor="middle" fontFamily="Quicksand-Bold" fontWeight="bold" fontSize="18" fill={txtColor}>1</SvgText>
			</Svg>
		}
		const button2 = () => {
			let selected = this.state.itemPoints == 2;
			let color = selected ? "#3DA848" : "#BCBCBC";
			let txtColor = selected ? "white" : color;
			return <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<Path d="M25.9802 2.80112L42.3318 12.2417C43.26 12.7776 43.8318 13.768 43.8318 14.8398V33.721C43.8318 34.7928 43.26 35.7832 42.3318 36.3191L25.9802 45.7597C25.052 46.2956 23.9084 46.2956 22.9802 45.7597L6.62863 36.3191C5.70042 35.7832 5.12863 34.7928 5.12863 33.721V14.8398C5.12863 13.768 5.70042 12.7776 6.62863 12.2417L22.9802 2.80112C23.9084 2.26522 25.052 2.26522 25.9802 2.80112Z" stroke={color} stroke-width="2"/>
				{selected && <Path d="M23.4802 4.85775C24.099 4.50048 24.8614 4.50048 25.4802 4.85775L40.8007 13.703C41.4195 14.0603 41.8007 14.7206 41.8007 15.4351V33.1257C41.8007 33.8402 41.4195 34.5005 40.8007 34.8577L25.4802 43.703C24.8614 44.0603 24.099 44.0603 23.4802 43.703L8.15972 34.8577C7.54091 34.5005 7.15972 33.8402 7.15972 33.1257V15.4351C7.15972 14.7206 7.54091 14.0603 8.15972 13.703L23.4802 4.85775Z" fill="#3DA848"/>}
				{/* <Path d="M23.1183 17.2749C24.0537 17.2749 24.8537 17.4411 25.5183 17.7734C26.1829 18.1057 26.6845 18.5488 27.0229 19.1026C27.3614 19.6565 27.5306 20.2688 27.5306 20.9395C27.5306 21.6349 27.3706 22.3118 27.0506 22.9703C26.7306 23.6288 26.2045 24.3611 25.4722 25.1672C24.7399 25.9672 23.7029 26.9672 22.3614 28.1672H27.826L27.5122 30.3918H19.0106V28.3242C20.5122 26.8718 21.6445 25.7365 22.4076 24.918C23.1706 24.0934 23.7183 23.3949 24.0506 22.8226C24.3891 22.2503 24.5583 21.7088 24.5583 21.198C24.5583 20.6749 24.4076 20.2657 24.106 19.9703C23.8045 19.6688 23.3829 19.518 22.8414 19.518C22.3614 19.518 21.9399 19.6195 21.5768 19.8226C21.2199 20.0257 20.8753 20.3549 20.5429 20.8103L18.7522 19.4626C19.2568 18.7611 19.8629 18.2226 20.5706 17.8472C21.2845 17.4657 22.1337 17.2749 23.1183 17.2749Z" fill={txtColor}/> */}
				<SvgText x="50%" y="63%" dominant-baseline="middle" textAnchor="middle" fontFamily="Quicksand-Bold" fontWeight="bold" fontSize="18" fill={txtColor}>2</SvgText>
			</Svg>
		}
		const button3 = () => {
			let selected = this.state.itemPoints == 3;
			let color = selected ? "#3DA848" : "#BCBCBC";
			let txtColor = selected ? "white" : color;
			return <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<Path d="M25.9802 2.80112L42.3318 12.2417C43.26 12.7776 43.8318 13.768 43.8318 14.8398V33.721C43.8318 34.7928 43.26 35.7832 42.3318 36.3191L25.9802 45.7597C25.052 46.2956 23.9084 46.2956 22.9802 45.7597L6.62863 36.3191C5.70042 35.7832 5.12863 34.7928 5.12863 33.721V14.8398C5.12863 13.768 5.70042 12.7776 6.62863 12.2417L22.9802 2.80112C23.9084 2.26522 25.052 2.26522 25.9802 2.80112Z" stroke={color} stroke-width="2"/>
				{selected && <Path d="M23.4802 4.85775C24.099 4.50048 24.8614 4.50048 25.4802 4.85775L40.8007 13.703C41.4195 14.0603 41.8007 14.7206 41.8007 15.4351V33.1257C41.8007 33.8402 41.4195 34.5005 40.8007 34.8577L25.4802 43.703C24.8614 44.0603 24.099 44.0603 23.4802 43.703L8.15972 34.8577C7.54091 34.5005 7.15972 33.8402 7.15972 33.1257V15.4351C7.15972 14.7206 7.54091 14.0603 8.15972 13.703L23.4802 4.85775Z" fill="#3DA848"/>}
				{/* <Path d="M22.5445 17.2749C23.4368 17.2749 24.2122 17.4226 24.8706 17.718C25.5291 18.0072 26.0306 18.4011 26.3753 18.8995C26.726 19.398 26.9014 19.9488 26.9014 20.5518C26.9014 21.3395 26.6706 21.9888 26.2091 22.4995C25.7537 23.0103 25.1137 23.3826 24.2891 23.6165C26.3014 23.8934 27.3076 24.9518 27.3076 26.7918C27.3076 27.518 27.1045 28.1795 26.6983 28.7765C26.2983 29.3672 25.7229 29.838 24.9722 30.1888C24.2276 30.5334 23.3568 30.7057 22.3599 30.7057C21.4183 30.7057 20.5691 30.5426 19.8122 30.2165C19.0553 29.8842 18.4029 29.4072 17.8553 28.7857L19.4983 27.2534C20.206 28.0657 21.0953 28.4718 22.166 28.4718C22.8122 28.4718 23.3322 28.3088 23.726 27.9826C24.1199 27.6503 24.3168 27.1857 24.3168 26.5888C24.3168 25.9303 24.1322 25.4472 23.7629 25.1395C23.3937 24.8318 22.8553 24.678 22.1476 24.678H20.9845L21.3168 22.6657H22.1476C22.7322 22.6657 23.1999 22.5242 23.5506 22.2411C23.9014 21.9518 24.0768 21.5365 24.0768 20.9949C24.0768 20.5211 23.9045 20.1457 23.5599 19.8688C23.2214 19.5857 22.7753 19.4442 22.2214 19.4442C21.7291 19.4442 21.2768 19.5395 20.8645 19.7303C20.4522 19.9149 20.0522 20.1888 19.6645 20.5518L18.1691 19.0011C19.3568 17.8503 20.8153 17.2749 22.5445 17.2749Z" fill={txtColor}/> */}
				<SvgText x="50%" y="63%" dominant-baseline="middle" textAnchor="middle" fontFamily="Quicksand-Bold" fontWeight="bold" fontSize="18" fill={txtColor}>3</SvgText>
			</Svg>
		}
		const button4 = () => {
			let selected = this.state.itemPoints == 4;
			let color = selected ? "#3DA848" : "#BCBCBC";
			let txtColor = selected ? "white" : color;
			return <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<Path d="M25.9802 2.80112L42.3318 12.2417C43.26 12.7776 43.8318 13.768 43.8318 14.8398V33.721C43.8318 34.7928 43.26 35.7832 42.3318 36.3191L25.9802 45.7597C25.052 46.2956 23.9084 46.2956 22.9802 45.7597L6.62863 36.3191C5.70042 35.7832 5.12863 34.7928 5.12863 33.721V14.8398C5.12863 13.768 5.70042 12.7776 6.62863 12.2417L22.9802 2.80112C23.9084 2.26522 25.052 2.26522 25.9802 2.80112Z" stroke={color} stroke-width="2"/>
				{selected && <Path d="M23.4802 4.85775C24.099 4.50048 24.8614 4.50048 25.4802 4.85775L40.8007 13.703C41.4195 14.0603 41.8007 14.7206 41.8007 15.4351V33.1257C41.8007 33.8402 41.4195 34.5005 40.8007 34.8577L25.4802 43.703C24.8614 44.0603 24.099 44.0603 23.4802 43.703L8.15972 34.8577C7.54091 34.5005 7.15972 33.8402 7.15972 33.1257V15.4351C7.15972 14.7206 7.54091 14.0603 8.15972 13.703L23.4802 4.85775Z" fill="#3DA848"/>}
				{/* <Path d="M27.7414 25.518V27.7057H26.4583V30.3918H23.6614L23.6429 27.7057H18.3445V25.7672L21.8983 17.2749L24.3814 18.1888L21.3537 25.518H23.6522L23.9937 22.4349H26.4583V25.518H27.7414Z" fill={txtColor}/> */}
				<SvgText x="50%" y="63%" dominant-baseline="middle" textAnchor="middle" fontFamily="Quicksand-Bold" fontWeight="bold" fontSize="18" fill={txtColor}>4</SvgText>
			</Svg>
		}	
		const button5 = () => {
			let selected = this.state.itemPoints == 5;
			let color = selected ? "#3DA848" : "#BCBCBC";
			let txtColor = selected ? "white" : color;
			return <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<Path d="M25.9802 2.80112L42.3318 12.2417C43.26 12.7776 43.8318 13.768 43.8318 14.8398V33.721C43.8318 34.7928 43.26 35.7832 42.3318 36.3191L25.9802 45.7597C25.052 46.2956 23.9084 46.2956 22.9802 45.7597L6.62863 36.3191C5.70042 35.7832 5.12863 34.7928 5.12863 33.721V14.8398C5.12863 13.768 5.70042 12.7776 6.62863 12.2417L22.9802 2.80112C23.9084 2.26522 25.052 2.26522 25.9802 2.80112Z" stroke={color} stroke-width="2"/>
				{selected && <Path d="M23.4802 4.85775C24.099 4.50048 24.8614 4.50048 25.4802 4.85775L40.8007 13.703C41.4195 14.0603 41.8007 14.7206 41.8007 15.4351V33.1257C41.8007 33.8402 41.4195 34.5005 40.8007 34.8577L25.4802 43.703C24.8614 44.0603 24.099 44.0603 23.4802 43.703L8.15972 34.8577C7.54091 34.5005 7.15972 33.8402 7.15972 33.1257V15.4351C7.15972 14.7206 7.54091 14.0603 8.15972 13.703L23.4802 4.85775Z" fill="#3DA848"/>}
				{/* <Path d="M22.5276 19.6842V22.4442C22.8229 22.3026 23.1337 22.2011 23.4599 22.1395C23.7922 22.0718 24.1122 22.038 24.4199 22.038C25.0845 22.038 25.6876 22.2072 26.2291 22.5457C26.7768 22.8842 27.2106 23.3672 27.5306 23.9949C27.8506 24.6226 28.0106 25.3549 28.0106 26.1918C28.0106 27.0534 27.7983 27.8257 27.3737 28.5088C26.9553 29.1918 26.3645 29.7303 25.6014 30.1242C24.8445 30.5118 23.9737 30.7057 22.9891 30.7057C22.0906 30.7057 21.2783 30.5365 20.5522 30.198C19.8322 29.8595 19.2291 29.3918 18.7429 28.7949L20.4229 27.2626C20.7245 27.6565 21.0753 27.958 21.4753 28.1672C21.8814 28.3703 22.3091 28.4718 22.7583 28.4718C23.2076 28.4718 23.6014 28.3795 23.9399 28.1949C24.2783 28.0042 24.5399 27.7395 24.7245 27.4011C24.9091 27.0626 25.0014 26.6749 25.0014 26.238C25.0014 25.4811 24.8476 24.9272 24.5399 24.5765C24.2383 24.2257 23.8168 24.0503 23.2753 24.0503C22.7399 24.0503 22.2168 24.1918 21.706 24.4749H19.7399V17.598H27.5306L27.2076 19.6842H22.5276Z" fill={txtColor}/> */}
				<SvgText x="52%" y="63%" dominant-baseline="middle" textAnchor="middle" fontFamily="Quicksand-Bold" fontWeight="bold" fontSize="18" fill={txtColor}>5</SvgText>
			</Svg>
		}
		const buttons = [{element: button1}, {element: button2}, {element: button3}, {element: button4}, {element: button5}];

		//<Text style={styles.goal}>New task for {this.props.goalName}</Text>
		// <Picker
		// 	style={[styles.picker, {marginBottom: 25}]}
		// 	textStyle={styles.pickerItem}
		// 	itemTextStyle={styles.pickerItem}
		// 	onValueChange={(inputVal) => this.setState({itemPoints: inputVal})}
		// 	selectedValue={this.state.itemPoints}>
		// 	{pointPicker}
		// </Picker>
		return (
			<View style={[styles.modal]}>
				<View style={{padding: 25}}>
					<Icon name='close' type="material-community"
						size={21}
						containerStyle={{position: 'absolute', top: 0, right: 0, padding: 25, zIndex: 1}}
						color="rgba(0,0,0,0.5)"
						onPress={() => that.props.closeModal()}
					/>
					<Text style={{fontSize: 18, textTransform: 'uppercase'}}>{this.props.goalName}</Text>
					<Text style={{fontSize: 18, opacity: .3}}>{this.props.taskName ? 'Edit activity' : 'Add new activity'}</Text>
				</View>
				<Divider style={{ backgroundColor: '#E3E3E3', height: 1.5 }} />
				<View style={{padding: 25}}>
					<Text style={[styles.modalLabel]}>Activity Name</Text>
					<TextInput
						style={[styles.bigTextInput, {padding: 10, marginTop: 20, height: 42}]}
						placeholder="Activity Name"
						onChangeText={(inputVal) => this.setState({itemName: inputVal})}
						value={this.state.itemName}
					/>
					<Text  style={[styles.modalLabel]}>How many points will the activity contribute towards the goal?</Text>
					<ButtonGroup
						buttons={buttons}
						buttonStyle={{marginHorizontal: 10, /*borderWidth: 1, borderColor: '#ccc', borderRadius: 50,*/ padding: 0}}
						containerStyle={{borderWidth: 0, backgroundColor: 'transparent', marginTop: 20, marginLeft: -5, marginRight: -5, height: 48}}
						textStyle={{fontSize: 18, fontFamily: 'Quicksand-Medium', paddingBottom: 5 /*color: 'rgba(255,255,255,0.5)'*/}}
						innerBorderStyle={{width: 0, color: 'orange'}}
						selectedTextStyle={{color: primaryColor}}
						selectedButtonStyle={{borderColor: primaryColor, backgroundColor: 'transparent'}}

						onPress={this.setPoints}
						selectedIndex={this.state.itemPoints-1}
					/>
					<View style={{marginLeft: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
						<Text style={{fontSize: 13, width: 45, textAlign: 'center', color: '#BCBCBC'}}>Low Effort</Text>
						<Text style={{fontSize: 13, width: 45, textAlign: 'center', color: '#BCBCBC'}}>High Value</Text>
					</View>
					<Icon name="check-circle-outline" type="material-community"
						size={33}
						containerStyle={{marginTop: 20}}
						color={primaryColor}
						onPress={()=>{this.props.taskName ? this.updateItem() : this.pushItem()}}
					/>
				</View>
			</View>
			// <View style={[styles.modal, {padding: 10}]}>
			// 	<LinearGradient colors={['#5D4037', '#795548']} style={{display: 'none', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 5}}></LinearGradient>
			// 	<View style={{padding: 10}}>
			// 		<Icon name='close' type="material-community"
			// 			size={21}
			// 			containerStyle={{position: 'absolute', top: 0, right: 0, padding: 10}}
			// 			color="rgba(0,0,0,0.5)"
			// 			onPress={() => that.props.closeModal()}
			// 		/>
			// 		<TextInput
			// 			style={[styles.bigTextInput, {marginBottom: 25, textAlign: 'center', marginTop: 20, color: '#FFECB3'}]}
			// 			placeholder="Task Name"
			// 			value={this.state.itemName}
			// 			onChangeText={(inputVal) => this.setState({itemName: inputVal})} />
			// 		<ButtonGroup
			// 			buttons={['1', '2', '3', '4', '5']}
			// 			buttonStyle={{margin: 0, borderWidth: 0, borderColor: '#ccc', borderRadius: 4, padding: 0}}
			// 			containerStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
			// 			textStyle={{fontSize: 25, fontFamily: 'Quicksand-Medium', color: 'rgba(255,255,255,0.5)'}}
			// 			innerBorderStyle={{width: 0, color: 'orange'}}
			// 			selectedTextStyle={{color: 'orange'}}
			// 			selectedButtonStyle={{backgroundColor: 'transparent'}}

			// 			onPress={this.setPoints}
			// 			selectedIndex={this.state.itemPoints-1}
			// 			/>
			// 		<Text style={{color: 'black', opacity: 0.6, textAlign: 'center', padding: 10, marginBottom: 15}}>points</Text>
			// 		<View style={{alignItems: 'center', marginTop: 50}}>
			// 			{
			// 			(this.props.taskName &&
			// 			<TouchableHighlight onPress={this.updateItem}>
			// 				<Text style={styles.yellowButton}>Update</Text>
			// 			</TouchableHighlight>) ||
			// 			<TouchableHighlight onPress={this.pushItem}>
			// 				<Text style={styles.yellowButton}>Create</Text>
			// 			</TouchableHighlight>
			// 			}
			// 		</View>
			// 	</View>
			// </View>
		)
	}
}
