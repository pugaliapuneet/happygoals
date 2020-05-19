import React, { Component } from 'react';
import {View, Text} from 'react-native';

class ChartBottom extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
                {
                    Object.entries(this.props.data).map(([k, v]) => (
                        <Text style={{opacity: .3, fontSize: 14}}>{k}: {v}</Text>
                    ))
                }
            </View>
        );
    }
}

export default ChartBottom;