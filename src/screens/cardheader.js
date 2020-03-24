import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableNativeFeedback, Alert, TouchableOpacity} from 'react-native';
import { CheckBox } from 'react-native-elements'
import {styles} from '../../styles.js';

export default class cardheader extends Component{
	render() {

		const g = this.props.g;

		let tick = g.tickOverride ? g.tickOverride : "check";
		checkedColor = tick == "check" ? "green" : "grey";

		//<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand-Bold'}}>{g.topDaySince} days ago</Text>
		//<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>of {g.duration}</Text>

		/*<View style={[styles.rowwrap, g.cardStatus.labels]}>
			{
				g.labels.map((l, i) => {
					return(<Text key={i} style={[styles.greenLabel, g.cardStatus.labels]}>{l}</Text>);
				})
			}
		</View>*/

		let lnb = [];
		if(typeof g.labels != "undefined") {
			g.labels.map((l, i) => {
				lnb.push(<Text key={l} style={[styles.greenLabel, g.cardStatus.labels]}>{l}</Text>);
			})
		}
		if(typeof g.backlogs != "undefined") {
			g.backlogs.map((l, i) => {
				lnb.push(<Text key={l} style={[styles.redLabel, g.cardStatus.backlogs]}>{l}</Text>);
			})
		}

		return (
			<TouchableWithoutFeedback onPress={() => { this.props.onP(); }}>
				<View>
					<View style={g.cardStatus.headerContainer}>
						<View style={[styles.border, styles.rowwrap, {justifyContent: 'space-between'}]}>
							{
							typeof g.items != "undefined" &&
							<View style={{}}>{g.stat}{g.statLabel}</View>
							}
							<View style={[styles.border, styles.goalTitle, {alignItems: 'flex-end'}]}>
								<View style={[styles.rowwrap]}>
									<CheckBox checkedIcon={tick} checked={true} checkedColor={checkedColor} containerStyle={[g.cardStatus.goalIcon, {padding: 4, margin: 0}]}/>
									<Text style={g.cardStatus.goalName}>{g.name}</Text>
								</View>
							</View>
						</View>
					</View>
					{
					//<Text style={{color: 'rgba(255,255,255,.5)'}}> / {g.duration}</Text>
					typeof g.items != "undefined" &&
					<View style={[styles.rowwrap, styles.border, g.cardStatus.metadata]}>
						<View style={{flex: 1}}>
							<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Week</Text>
							<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.completed.weeks}</Text>
						</View>
						{/* <View style={{flex: 1}}>
							<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Day</Text>
							<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.completed.days}</Text>
						</View> */}
						<View style={{flex: 1}}>
						{
							(() => {
								if(g.recentScore > 0)
								{
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Recent Score</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.recentScore}</Text>
									</View>);
								}
							})()
						}
						</View>
						<View style={{flex: 1}}>
						{
							(() => {
								if(g.topScore > 0)
								{
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Top Score</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.topScore}</Text>
									</View>);
								}
							})()
						}
						</View>
						<View style={{flex: 1}}>
						{
							(() => {
								if(g.totalPointsToday > 0) {
									return(<View>
										<Text style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Today</Text>
										<Text style={{color: 'rgba(255, 255, 255, 1)'}}>{g.totalPointsToday}</Text>
									</View>);
								}
							})()
						}
						</View>
					</View>
					}

				</View>
			</TouchableWithoutFeedback>
		);
		//<View style={[styles.rowwrap, g.cardStatus.labels]}>{lnb}</View>

	}
}
