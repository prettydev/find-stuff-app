import React from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import Style from './RoundBtnStyle';
import {Colors} from 'src/Theme';

export default function RoundBtn(props) {
  return (
    <View
      style={[
        Style.RoundBtnWrap,
        {backgroundColor: Colors[props.RoundBtnColor]},
      ]}>
      <TouchableOpacity onPress={props.proc}>
        <Text style={Style.RoundBtnText}>{props.RoundBtnTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}
