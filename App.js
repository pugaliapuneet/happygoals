/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {UIManager} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import codePush from "react-native-code-push";
import { Icon } from 'react-native-elements'

import JournalScreen from './src/screens/journal.js';
import WishlistScreen from './src/screens/wishlist.js';
import DashboardScreen from './src/screens/dashboard.js';
import BacklogScreen from './src/screens/backlog.js';
import IdeasScreen from './src/screens/ideas.js';

import EditGoal from './src/screens/editgoal.js';
import NewGoal from './src/screens/newgoal.js';
import onboarding from './src/screens/onboarding.js';
import IdeaDashboardScreen from './src/screens/ideadashboard.js';


import { setCustomText } from 'react-native-global-props';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

// console.ignoredYellowBox = ['Warning:'];
console.disableYellowBox = true;

setCustomText({
  style: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: 'black'
  }
});

const WishlistStack = createStackNavigator({
  wishlist: WishlistScreen,
  editGoal: EditGoal,
}, {headerMode: 'none'});

const DashboardStack = createStackNavigator({
  dashboard: DashboardScreen,
  editGoal: EditGoal,
  newGoal: NewGoal,
  ideas: IdeaDashboardScreen,
  //onboarding: onboarding,
}, {headerMode: 'none'});

const IdeasStack = createStackNavigator({
  ideas: IdeasScreen,
  // editGoal: EditGoal,
}, {headerMode: 'none'});

// const GlobalDrawer = createDrawerNavigator({
//     dashboard: DashboardStack,
//     // wishlist: WishlistStack,
//     journal: JournalScreen,
//     backlog: BacklogScreen,
//     onboarding: onboarding
// }, {drawerType: 'slide'});

const TabScreen = createMaterialTopTabNavigator(
    {
        goals: {
            screen: DashboardStack,
            navigationOptions: {
              tabBarIcon: <Icon name='view-dashboard-outline' type="material-community" color="white" size={19}/>
            },
        },
        journal: {
            screen: JournalScreen,
            navigationOptions: {
              tabBarIcon: <Icon name='calendar-check' type="material-community" color="white" size={19}/>
            },
        },

        backlog: {
            screen: BacklogScreen,
            navigationOptions: {
              tabBarIcon: <Icon name='calendar-clock' type="material-community" color="white" size={19}/>
            },
        },

        // wishlist: {
        //     screen: WishlistStack,
        //     navigationOptions: {
        //       tabBarIcon: <Icon name='bullseye' type="material-community" color="white" size={21}/>
        //     },
        // },

        // ideas: {
        //     screen: IdeasStack,
        //     navigationOptions: {
        //       tabBarIcon: <Icon name='flash-circle' type="material-community" color="white" size={21}/>
        //     },
        // }
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#F8F8F8',
      showIcon: true,
      pressColor: 'transparent',
      style: {
        // backgroundColor: "hsl(200, 10%, 20%)",
        // backgroundColor: 'hsl(150, 40%, 30%)',
        backgroundColor: '#006064',
        borderBottomColor: 'transparent',
      },
      labelStyle: {
        textAlign: 'center',
        padding: 0, margin: 0,
        fontSize: 9,
      },
      indicatorStyle: {
          opacity: 0
      }
      // renderIndicator: false,
    },
  }
);
const App = createStackNavigator({
    TabScreen: {
        screen: TabScreen,
    },
}, {headerMode: 'none'});

//export default createAppContainer(GlobalDrawer);
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// export default codePush()`;
// export default codePush(codePushOptions)(createAppContainer(App))
export default codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE })(createAppContainer(App));
// export default codePush(codePushOptions)(createAppContainer(DashboardStack))
