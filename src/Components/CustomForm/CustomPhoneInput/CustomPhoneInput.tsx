import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import Styles from './CustomPhoneInputStyle';
import Toast from 'react-native-simple-toast';

export default function CustomPhoneInput(props) {
  const [number, setNumber] = useState('');
  const [duration, setDuration] = useState(60);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (!isSent) {
      return () => clearInterval(intervalId);
    }
    if (!duration) {
      setIsSent(false);
      setDuration(60);
      return () => clearInterval(intervalId);
    }

    const intervalId = setInterval(() => {
      if (duration < 1) setDuration(0);
      else setDuration(duration - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  return (
    <View>
      <Text>{props.CustomLabel}</Text>
      <View
        style={{
          flexDirection: 'row',
          borderColor: '#ddd',
          borderBottomWidth: 1,
        }}>
        <TextInput
          style={Styles.CustomTextInput}
          placeholder={props.CustomPlaceholder}
          onChangeText={value => {
            setNumber(value);
            props.proc(value);
          }}
        />
        {isSent && (
          <View style={Styles.timer}>
            <Text>{duration}</Text>
          </View>
        )}
        {!isSent && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={Styles.touachableButton}
            onPress={() => {
              if (number === '') {
                Toast.show('正确输入值！');
                return;
              }
              setIsSent(true);
              setDuration(duration - 1);
              props.proc2();
            }}>
            <Text>发送验证码</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
