import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, CheckBox, ScrollView, Alert, RefreshControl} from 'react-native';
import Modal from "react-native-modal";
import {styles as s} from '../../styles.js';
import WishlistEntry from './wishlistentry.js';
import NewGoal from './newgoal';
import EditGoal from './editgoal';
import model from './model.js';

export default class WishlistScreen extends Component{
	constructor(props) {
		super(props);

		this.componentWillMount = this.componentWillMount.bind(this);
		this.loadWishlist = this.loadWishlist.bind(this);

		this.goalDataSet = {};
	}

	state = {
		isNGModalVisible: false,
		isEGModalVisible: false,

		categories: [],

		isLoaded: false,
	};

	_toggleNGModal = () => this.setState({ isNGModalVisible: !this.state.isNGModalVisible });
	_toggleEGModal = () => this.setState({ isEGModalVisible: !this.state.isEGModalVisible });

	componentWillMount() {
		this.loadWishlist();
	}

	loadWishlist() {
		var Datastore = require('react-native-local-mongodb');
		var dbgoals = new Datastore({ filename: 'goals1', autoload: true });
		let that = this;

		try {
			const that = this;
			// console.log("1");
			dbgoals.find({}, function (err, docs) {
				// console.log("2");
				// console.log(docs.length);
				if(docs.length > 0) {
					var categories = {};
					let fetchGoalData = [];
					docs.map((g, index) => {
						// console.log(g);
						if(g.status && typeof g.items !== "undefined" && g.items.length)
							fetchGoalData.push(model.getActiveGoals(g.name));

						if(typeof categories[g.category] === "undefined")
							categories[g.category] = [];

						categories[g.category].push(g);
					})
					// console.log(fetchGoalData);

					if(fetchGoalData.length) {
						Promise.all(fetchGoalData).then(function(goalPromises){
							goalPromises.map(function(gp){
								that.goalDataSet[gp[0].name] = gp[0];
							})

							that.setState({categories: categories}, function(){
								that.setState({isLoaded: true, refreshing: false});
							});
						})
					}
					else {
						that.setState({categories: categories}, function(){
							that.setState({isLoaded: true, refreshing: false});
						});
					}
				}
				else {
					that.setState({isLoaded: true, refreshing: false});
				}
			});
		}
		catch(e) {
			console.log("--------------", e);
		}
	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this.loadWishlist();
	}

	// <TouchableOpacity onPress={this._toggleNGModal}><Text>Hide me!</Text></TouchableOpacity>
	render() {
		let that = this;

		// console.log(this.state.categories);
		if(this.state.isLoaded)
		{
			let categories = this.state.categories;
			// console.log(this.state.categories);

			return (
				<View style={[s.body, {position: 'relative', height: '100%'}]}>
					<TouchableOpacity onPress={this.props.navigation.toggleDrawer}>
						<Image source={{uri: "https://static.thenounproject.com/png/1166840-200.png"}} style={{width: 32, height: 32, marginLeft: 10, marginTop: 10}} />
					</TouchableOpacity>

					<View style={{position: 'absolute', top: 52, left: 0, right: 0, bottom: 8}}>
				    	<ScrollView style={[s.container]}>
							<TouchableOpacity onPress={this._toggleNGModal} style={[s.rowwrap, {margin: 16}]}>
								<Text style={{padding: 10, color: 'white', backgroundColor: 'lightgreen', borderRadius: 5}}>CREATE NEW GOAL</Text>
							</TouchableOpacity>

				    		<ScrollView
				    			showsVerticalScrollIndicator={false}
				    			style={{marginLeft: 8, overflow: 'visible'}}
				    			refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
							>
				    			{
				    				Object.keys(categories).map((c, index) => {
				    					if(typeof c.goals !== 'undefined' || true)
					    				{
					    					return <View key={index} key={index} style={s.border}>
					    						<Text style={[s.label, {marginLeft: 8, marginTop: 8, color: 'white'}]}>{c}</Text>
					    						<View style={s.rowwrap}>
						    						{(() => {
					    								let x = [];
					    								categories[c].map((g, index2) => {
															g.goalData = that.goalDataSet[g.name];
					    									if(!g.deleted) {
							    								x.push(<TouchableOpacity
							    									key={index2}
							    									onPress={() => {
							    										this.props.navigation.navigate("editGoal", {
							    											title: "test",
							    											data: {g: g, postSubmit: this.loadWishlist},
						    									 		}
						    									 	);}}>
							    									<WishlistEntry data={g}/>
							    								</TouchableOpacity>);
							    							}
						    							})
						    							return x;
						    						})()}
					    						</View>
					    					</View>
					    				}
				    				})
				    			}
				    		</ScrollView>

					    	<Modal
					    		isVisible={this.state.isNGModalVisible}
					    		onBackdropPress={() => this.setState({ isNGModalVisible: false })}
					    		onSwipe={() => this.setState({ isNGModalVisible: false })}
					    		swipeDirection="down"
					    		hideModalContentWhileAnimating={true}
					    		backdropColor='orange' useNativeDriver={false}
					    	>

								<NewGoal closeModal={this._toggleNGModal} postSubmit={this.loadWishlist}/>
					    	</Modal>

					    	<Modal
					    		isVisible={this.state.isEGModalVisible}
					    		onBackdropPress={() => this.setState({ isEGModalVisible: false })}
					    		onSwipe={() => this.setState({ isEGModalVisible: false })}
					    		swipeDirection="down"
					    		hideModalContentWhileAnimating={true}
					    		backdropColor='orange' useNativeDriver={false}
					    	>
					    		<TouchableOpacity onPress={this._toggleModal}><Text>Hide me!</Text></TouchableOpacity>
								<EditGoal data={this.state.selectedG} closeModal={this._toggleEGModal} postSubmit={this.loadWishlist}/>
					    	</Modal>
				    	</ScrollView>
					</View>
				</View>
			);
		}
		else
		{
			return (<View></View>);
		}
	}
}
