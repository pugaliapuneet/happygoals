import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, Alert, RefreshControl, SectionList, ImageBackground} from 'react-native';
import Modal from "react-native-modal";
import {styles as s} from '../../styles.js';
import WishlistEntry from './wishlistentry.js';
import NewGoal from './newgoal';
import EditGoal from './editgoal';
import model from './model.js';

export default class WishlistScreen extends Component{
	constructor(props) {
		super(props);

		this.ideas = [
			{name: 'Workout', points: 5, tags: ['Health & Fitness'], image: require('../../assets/images/ideas/Workout.jpeg')},
			{name: 'Run', points: 3, tags: ['Health & Fitness'], image: require('../../assets/images/ideas/Run.jpeg')},
			{name: 'Play a Sport', points: 5, tags: ['Group Activity', 'Health & Fitness', 'Fun'], image: require('../../assets/images/ideas/Sport.jpeg')},
			{name: 'Have a protein meal', points: 3, tags: ['Nutrition', 'Health & Fitness',], image: require('../../assets/images/ideas/protien.jpeg')},
			{name: 'Sleep early', points: 5, tags: ['Rest and relaxation', 'Health & Fitness'], image: require('../../assets/images/ideas/sleep.jpeg')},
			{name: 'Read a book', points: 5, tags: ['Rest and relaxation'], image: require('../../assets/images/ideas/read.jpeg')},
			{name: 'Meditate', points: 5, tags: ['Rest and relaxation'], image: require('../../assets/images/ideas/meditate.jpeg')},
			{name: 'Call a friend', points: 2, tags: ['Socialize', 'Fun'], image: require('../../assets/images/ideas/call.jpeg')},
			{name: 'Hangout', points: 3, tags: ['Socialize', 'Fun'], image: require('../../assets/images/ideas/social.jpeg')},
			{name: 'Play Board Games', points: 2, tags: ['Fun'], image: require('../../assets/images/ideas/boardgames.jpeg')},
			{name: 'Play Video Games', points: 1, tags: ['Fun'], image: require('../../assets/images/ideas/videogames.jpeg')},
			{name: 'Watch a Movie', points: 1, tags: ['Fun'], image: require('../../assets/images/ideas/netflix.jpeg')},
			{name: 'Social event', points: 4, tags: ['Socialize'], image: require('../../assets/images/ideas/friends.jpeg')},
			{name: 'Make a friend', points: 5, tags: ['Socialize', 'Discomfort'], image: require('../../assets/images/ideas/hi5.jpeg')},
			{name: 'Water intake', points: 4, tags: ['Health & Fitness', 'Nutrition'], image: require('../../assets/images/ideas/water.jpeg')},
			{name: 'Go for a walk', points: 3, tags: ['Health & Fitness'], image: require('../../assets/images/ideas/walk.jpeg')},
			{name: 'Breathing exercises', points: 3, tags: ['Health & Fitness']},
			{name: 'Salad meal', points: 3, tags: ['Nutrition', 'Health & Fitness',], image: require('../../assets/images/ideas/salad.jpeg')},
			{name: 'Medical check', points: 3, tags: ['Health & Fitness'], image: require('../../assets/images/ideas/doctor.jpeg')},
			// {name: 'Track your calories', points: 3, tags: ['Health & Fitness']},
			{name: 'Appreciate', points: 3, tags: ['Social Skills'], image: require('../../assets/images/ideas/appreciate.jpeg')},
			{name: 'Avoid arguments', points: 3, tags: ['Positive life'], image: require('../../assets/images/ideas/argument.jpeg')},
			{name: 'Apply Sunblock', points: 3, tags: ['Personal care'], image: require('../../assets/images/ideas/sunblock.jpeg')},
			{name: 'Floss your teeth', points: 3, tags: ['Personal care'], image: require('../../assets/images/ideas/floss.jpeg')},
			{name: 'Withhold criticism', points: 3, tags: ['Social Skills']},
		];

		console.log(this.ideas);

		this.ideaTags = {};
		this.ideas.forEach((activity) => {
			activity.tags.forEach((tag) => {
				if(!this.ideaTags[tag])
					this.ideaTags[tag] = [];

				this.ideaTags[tag].push(activity);
			})
		});

		this.sections = [];
		// console.log("IDEATAGS", this.ideaTags, this.ideaTags.length);
		Object.keys(this.ideaTags).forEach((tag) => {
			// console.log("TAG", tag, this.ideaTags[tag]);
			this.sections.push({title: tag, data: this.ideaTags[tag]});
		})

	}

	state = {
		isLoaded: false,
	};

	_renderItem = ({item}) => {
		return(<View key={item.title} style={{marginBottom: 20}}>
			<Text style={[{color: 'pink', marginBottom: 5}]}>{item.title}</Text>
			<FlatList
				renderItem={this._renderItem2}
				data={item.data}
				horizontal={true}
				keyExtractor={this._keyExtractor}
			/>
		</View>)
	};

	_renderItem2 = ({item}) => {
		return(<View key={item.name} style={{width: 200, height: 120, marginRight: 20, position: 'relative', borderRadius: 5, overflow: 'hidden'}}>
			<ImageBackground source={item.image} style={{width: '100%', height: '100%'}}>
				<View style={{width: '100%', height: '100%', backgroundColor: 'rgba('+Math.random()*100+','+Math.random()*100+','+Math.random()*100+',0.5)', padding: 10, paddingVertical: 6, flexDirection: 'column-reverse'}}>
					<Text style={[{color: 'white'}]}>{item.name}</Text>
				</View>
			</ImageBackground>

			<Text style={[{top: 0, right: 0, position: 'absolute', backgroundColor: 'green', color: 'white', paddingHorizontal: 10, margin: 10, borderRadius: 5}]}>{item.points}</Text>
		</View>)
	};

	_keyExtractor = (item, index) => item.title;
	_keyExtractor2 = (item, index) => item.name;

	render() {
		let that = this;

		if(this.state.isLoaded || true)
		{
			return (
				<View style={[s.body, {position: 'relative', height: '100%', padding: 20}]}>
					<FlatList
						renderItem={this._renderItem}
						data={this.sections}
						keyExtractor={this._keyExtractor}
					/>
				</View>
			);
		}
		else
		{
			return (<View></View>);
		}
	}
}
