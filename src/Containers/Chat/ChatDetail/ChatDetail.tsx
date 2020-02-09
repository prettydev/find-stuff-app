import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import Styles from './ChatDetailStyle';
import {Images, Colors} from 'src/Theme';
import moment from 'moment';
import {store} from 'src/Store';
import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/constants';

import {NavigationEvents} from 'react-navigation';

const axios = require('axios');

export default function ChatDetail(props) {
  const [state, dispatch] = useContext(store);
  const [item, setItem] = useState(props.navigation.getParam('item'));
  const [msg, setMsg] = useState(props.navigation.getParam('msg'));
  const [reply, setReply] = useState('');
  const handleSubmit = async () => {
    if (item === null) {
      Toast.show('错误的接收者!');
      return;
    }

    if (reply === '') {
      Toast.show('正确输入值！');
      return;
    }
    await axios
      .post(baseUrl + 'api/message', {
        content: reply,
        sender: state.user._id,
        receiver: item._id,
      })
      .then(function(response2) {
        if (response2.data) {
          Toast.show('成功!');
          props.navigation.navigate('ChatView');
        } else {
          Toast.show('失败了!');
        }
      })
      .catch(function(error) {
        Toast.show(error);
      });
  };
  useEffect(() => {
    if (!state.auth_token) props.navigation.navigate('Signin');
  }, []);

  useEffect(() => {}, [item]);

  return (
    <ScrollView style={Styles.GetStuffScreenContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
        }}
      />
      <View style={Styles.FindStuffHeaderContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('MainScreenWithBottomNav')}
          style={{flex: 1}}>
          <Image
            source={Images.whiteLeftChevron}
            style={Styles.FindStuffHeaderImg}
            resizeMode="cover"
            borderRadius={30}
          />
        </TouchableOpacity>
        {item !== null && (
          <Text style={{fontSize: 20, color: '#fff'}}>{item.name}</Text>
        )}
        {item === null && (
          <Text style={{fontSize: 20, color: '#fff'}}>{''}</Text>
        )}
        <Text style={{flex: 1}} />
      </View>
      <View style={Styles.MessageDetailContainer}>
        <View style={Styles.LastMessageContainer}>
          <View style={Styles.AvatarContainer}>
            <Image
              style={Styles.AvartarImg}
              // source={{
              //   uri: baseUrl + 'download/photo?path=' + item.photo,
              // }}
              source={Images.maleProfile}
              resizeMode="cover"
              borderRadius={30}
            />
            <View>
              <View style={Styles.nickNameContainer}>
                {item !== null && (
                  <Text style={Styles.CommonText}>{item.name}</Text>
                )}
                {item === null && <Text style={Styles.CommonText}>{''}</Text>}
              </View>
              <View style={Styles.nickNameContainer}>
                {item !== null && (
                  <Text style={{fontSize: 12, color: Colors.grey}}>
                    {moment(item.createAt).format('M月D日 hh时mm分')}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={Styles.LastMessageDescription}>
            <Text style={Styles.LastMessageDescriptionText}>{msg.content}</Text>
          </View>
        </View>

        <View style={Styles.NewMessageContainer}>
          <View>
            <TextInput
              style={Styles.newMesssageText}
              underlineColorAndroid="transparent"
              placeholder="内容"
              placeholderTextColor="grey"
              numberOfLines={5}
              onChangeText={value => setReply(value)}
            />
          </View>
        </View>
        <View style={Styles.replyBtnContainer}>
          <TouchableOpacity style={Styles.replyBtnWrap} onPress={handleSubmit}>
            <Text style={{color: '#fff', fontSize: 18}}>发送</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
