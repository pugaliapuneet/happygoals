import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

class DrawerContent extends Component {
    navigateToScreen = (route) => () => {
        const navigate = this.props.navigation.navigate({
          routeName: route
        });
    }
    // <Button title='Wishlist' onPress={this.navigateToScreen('wishlist')}/>
    render () {
        return (
        <View>
            <ScrollView style={{backgroundColor: 'hsl(150, 40%, 50%)', }}>
              <Button title='Dashboard' onPress={this.navigateToScreen('dashboard')}/>
              <Button title='Journal' onPress={this.navigateToScreen('journal')}/>
              <Button title='Backlog' onPress={this.navigateToScreen('backlog')}/>
              <Button title='Onboarding' onPress={this.navigateToScreen('onboarding')}/>
            </ScrollView>
        </View>
    );
    }
}
export default DrawerContent;
