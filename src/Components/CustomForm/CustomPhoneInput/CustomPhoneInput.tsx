import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Styles from './CustomPhoneInputStyle';

export default function CustomPhoneInput(props) {
  return (
    <View>
      <View style={Styles.textBoxContainer}>
        <Text>{props.CustomLabel}</Text>
        <TextInput
          style={Styles.CustomTextInput}
          placeholder={props.CustomPlaceholder}
          onChangeText={props.proc}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={Styles.touachableButton}
          onPress={props.proc2}>
          <Text style={Styles.buttonImage}>| 发送验证码</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
