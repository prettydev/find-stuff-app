import React from 'react';
import {View, Text} from 'react-native';
import Style from './RoundBtnStyle';
import {Colors} from './node_modules/src/Theme';

export default function RoundBtn(props) {
  return (
    <View
      style={[
        Style.RoundBtnWrap,
        {backgroundColor: Colors[props.RoundBtnColor]},
      ]}>
      <Text style={Style.RoundBtnText}>{props.RoundBtnTitle}</Text>
    </View>
  );
}
