import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, TextInput, Picker, Button, Alert, AsyncStorage, ToastAndroid} from 'react-native';
import { ButtonGroup } from 'react-native-elements'
import {styles} from '../../styles.js';

import Onboarding from 'react-native-onboarding-swiper';
import { Icon } from 'react-native-elements'

export default class editGoal extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let cardStyle = {borderWidth: 1, borderColor: 'white', width: 200, padding: 10, borderRadius: 5, marginBottom: 5};
		let bigCardStyle = {borderWidth: 1, borderColor: 'white', width: 250, padding: 20, borderRadius: 5, marginBottom: 5};
		let textStyle = {textAlign: 'center', color: 'white', fontSize: 15};
		let scoreStyle = {textAlign: 'center', color: 'white', fontFamily: 'Nunito-Light', fontSize: 36};
		let star = <Icon name='star-outline' type="material-community" color="white" size={16} containerStyle={{padding: 2}}/>
		return(
			<Onboarding
			    onDone={() => console.log('done')}
			    pages={[
					{
						backgroundColor: '#AD1457',
						title: <View style={{alignItems: 'center'}}>
							<Text style={{fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>There are no limits to what you can achieve in life.</Text>
							<Icon name='image-filter-hdr' type="material-community" color="white" size={144} containerStyle={{display: 'none', paddingTop: 10, marginTop: 16, paddingBottom: 5}}/>
							<Image source={require('../../assets/images/1184787.png')} style={{width: 120, height: 120}}/>
						</View>,
					},
					{
						backgroundColor: '#AD1457',
						title: <View style={{padding: 20, alignItems: 'center'}}>
							<Text style={{marginBottom: 50, fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>Define goals</Text>
							<View>
								<Text style={[cardStyle, textStyle, {opacity: 1}]}>Client Acquisiton</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.9}]}>Learn to code</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.8}]}>Positive Life</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.7}]}>Reduce weight</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.6}]}>Easy Fitness</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.5}]}>Studies</Text>
								<Text style={[cardStyle, textStyle, {opacity: 0.4}]}>Fun</Text>
							</View>
						</View>,
					},
					{
						backgroundColor: '#AD1457',
						title: <View style={{padding: 20, alignItems: 'center'}}>
							<Text style={{marginBottom: 50, fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>Make your strategy</Text>
							<View style={{borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 20, width: 250}}>
								<Text style={{color: 'white', fontSize: 21, marginBottom: 20}}>STAY FIT</Text>

								<View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
									<Text style={{color: 'white', fontSize: 14}}>Play a sport</Text>
									<View style={styles.rowwrap}>{star}{star}{star}{star}</View>
								</View>
								<View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
									<Text style={{color: 'white', fontSize: 14}}>Go for a walk</Text>
									<View style={styles.rowwrap}>{star}{star}</View>
								</View>
								<View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
									<Text style={{color: 'white', fontSize: 14}}>Eat a salad meal</Text>
									<View style={styles.rowwrap}>{star}{star}{star}</View>
								</View>
							</View>
						</View>,
					},
					{
  					  backgroundColor: '#AD1457',
  					  title: <View style={{padding: 20, alignItems: 'center'}}>
  						  <Text style={{marginBottom: 50, fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>Beat your daily average</Text>
  						  <View>
  							  <View style={[styles.rowwrap, bigCardStyle, {justifyContent: 'space-between', borderColor: 'rgba(255,255,255,0.35)'}]}>
							  	<View>
							  		<Text style={[scoreStyle, {lineHeight: 42, marginBotom: 0}]}>9.2</Text>
									<Text style={[textStyle, {opacity: 0.5, fontSize: 11}]}>Daily avg</Text>
								</View>
								<View style={{}}>
							  		<Text style={[textStyle, {opacity: 0.35, textAlign: 'right'}]}>Client Acquisiton</Text>
									<Text style={[textStyle, {opacity: 1, textAlign: 'right'}]}>Today: 12</Text>
								</View>
							</View>
  						  </View>
  					  </View>
  				  },
				  {
					  backgroundColor: '#AD1457',
					  title: <View style={{padding: 20, alignItems: 'center'}}>
						  <Text style={{marginBottom: 50, fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>Discover effortless activities</Text>
						  <View style={{borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 20, width: 250}}>
							  <Text style={{color: 'white', fontSize: 21, marginBottom: 20}}>STAY FIT</Text>

							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Play a sport</Text>
								  <View style={styles.rowwrap}>{star}{star}{star}{star}</View>
							  </View>
							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Go for a walk</Text>
								  <View style={styles.rowwrap}>{star}{star}</View>
							  </View>
							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Eat a salad meal</Text>
								  <View style={styles.rowwrap}>{star}{star}{star}</View>
							  </View>
						  </View>

						  <View style={{borderWidth: 0, paddingVertical: 20, width: 250}}>
							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Take the stairs</Text>
								  <View style={styles.rowwrap}>{star}</View>
							  </View>
							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Weekly dance class</Text>
								  <View style={styles.rowwrap}>{star}{star}{star}{star}</View>
							  </View>
							  <View style={[styles.rowwrap, {justifyContent: 'space-between'}]}>
								  <Text style={{color: 'white', fontSize: 14}}>Fruit snack</Text>
								  <View style={styles.rowwrap}>{star}{star}</View>
							  </View>
						   </View>
					  </View>
				  },
				  {
					  backgroundColor: '#AD1457',
					  title: <View style={{padding: 20, alignItems: 'center'}}>
						  <Text style={{marginBottom: 50, fontSize: 26, color: 'white', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>Daily accomplishment score</Text>
						  <View style={{borderRadius: 100, borderWidth: 1, borderColor: 'white', padding: 20}}>
							  <Text style={[scoreStyle, {opacity: 1}]}>126</Text>
							  <Text style={[textStyle, {opacity: 0.9, fontSize: 11}]}>points today</Text>
						  </View>
					  </View>,
				  },
				  {
			        backgroundColor: '#fe6e58',
			        title: 'Do activities\nEarn points\nPush your score',
					//image: <Image source={require('../../assets/images/onboarding/selfimprovement.jpg')} style={{width: '80%', height: 400, borderRadius: 10}} />,

			        subtitle: '',
			      },
			      {
			        backgroundColor: '#fe6e58',
			        //image: <Image source={require('../../assets/images/onboarding/calendar.jpg')} style={{width: '80%', height: 400, borderRadius: 10}} />,
			        title: 'Set a routine\nTrack your performance',
			        subtitle: '',
			      },
				  {
			        backgroundColor: '#fe6e58',
			        //image: <Image source={require('../../assets/images/onboarding/journal.jpg')} style={{width: '80%', height: 400, borderRadius: 10}} />,
			        title: 'A snapshot of your day',
			        subtitle: '',
			      },
				  {
			        backgroundColor: '#fe6e58',
			        //image: <Image source={require('../../assets/images/onboarding/backlog.jpg')} style={{width: '80%', height: 400, borderRadius: 10}} />,
			        title: 'Do more, without missing',
			        subtitle: '',
			      },
			    ]}
				bottomBarHighlight={false}
				imageContainerStyles={{marginBottom: 20, paddingBottom: 0}}
			/>
		)
	}
}
