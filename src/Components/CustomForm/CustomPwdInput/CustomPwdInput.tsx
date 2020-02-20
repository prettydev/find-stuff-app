import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './CustomPwdInputStyle';
import {Images} from 'src/Theme';

export default function CustomPwdInput(props) {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View>
      <Text>{props.CustomPwdLabel}</Text>
      <View
        style={{
          flexDirection: 'row',
          borderColor: '#ddd',
          borderBottomWidth: 1,
        }}>
        <TextInput
          secureTextEntry={hidePassword}
          style={Styles.CustomTextInput}
          placeholder={props.CustomPwdPlaceholder}
          onChangeText={props.proc}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={Styles.touachableButton}
          onPress={() => setHidePassword(!hidePassword)}>
          <FastImage
            resizeMode="contain"
            style={{width: 25}}
            source={hidePassword ? Images.HideIcon : Images.ShowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
