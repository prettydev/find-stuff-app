import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './ChatDetailStyle';
import {Images} from 'src/Theme';
import moment from 'moment';
import {store} from 'src/Store';
import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/constants';

import {NavigationEvents} from 'react-navigation';
import axios from 'axios';

export default function ChatDetail(props) {
  const [state, dispatch] = useContext(store);
  const [reply, setReply] = useState('');
  const [guest, setGuest] = useState(props.navigation.getParam('guest'));
  const [room_id, setRoom_id] = useState(props.navigation.getParam('room_id'));

  const getRooms = async () => {
    if (room_id === undefined || room_id === '') {
      await axios
        .post(baseUrl + 'api/room', {
          uid: state.user._id,
          receiver: guest._id,
        })
        .then(function(response) {
          if (response.data) {
            Toast.show('成功!');
            setRoom_id(response.data._id);
          } else {
            Toast.show('失败了!');
          }
        })
        .catch(function(error) {
          Toast.show(error);
        });
    }
  };

  const getDetails = () => {
    if (!guest._id) {
      Toast.show('失败了!');
      return;
    }

    axios
      .get(baseUrl + 'api/message/' + room_id, {
        params: {},
      })
      .then(function(response) {
        console.log('from the server........................', response.data);

        dispatch({type: 'setDetails', payload: response.data.items});
      })
      .catch(function(error) {
        console.log('from server error.....................', error);
      })
      .finally(function() {
        // always executed
        console.log('anyway finished.....');
      });
  };

  const handleSubmit = async () => {
    if (guest === null) {
      Toast.show('错误的接收者!');
      return;
    }

    if (reply === '') {
      Toast.show('正确输入值！');
      return;
    }
    await axios
      .post(baseUrl + 'api/message', {
        user: state.user._id,
        room: room_id,
        receiver: guest._id,
      })
      .then(function(response) {
        if (response.data) {
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
    getRooms();
    getDetails();
  }, []);

  return (
    <ScrollView style={Styles.GetStuffScreenContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
          else {
            dispatch({type: 'setCurrent', payload: 'chat-details'});
          }
        }}
      />
      <View style={Styles.FindStuffHeaderContainer}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => props.navigation.goBack()}>
          <FastImage
            source={Images.whiteLeftChevron}
            style={Styles.FindStuffHeaderImg}
          />
        </TouchableOpacity>

        <Text style={{fontSize: 20, color: '#fff'}}>
          {guest.name ? guest.name : ''}
        </Text>
        <Text style={{flex: 1}} />
      </View>
      <View style={Styles.MessageDetailContainer}>
        <View style={Styles.LastMessageContainer}>
          <View style={Styles.AvatarContainer}>
            <FastImage
              style={Styles.AvartarImg}
              source={
                guest.photo
                  ? {
                      uri: baseUrl + 'download/photo?path=' + guest.photo,
                    }
                  : Images.maleProfile
              }
              resizeMode="cover"
            />
            <View>
              <View style={Styles.nickNameContainer}>
                <Text style={Styles.CommonText}>
                  {guest !== null ? guest.name : ''}
                </Text>
              </View>
            </View>
          </View>

          {state.details.length > 0 &&
            state.details.map((msg, i) => (
              <View style={Styles.LastMessageDescription}>
                <Text style={{flex: 2}}>{msg.content}</Text>
                <Text style={{flex: 1}}>
                  {moment(msg.createAt).format('M月D日 hh时mm分')}
                </Text>
              </View>
            ))}
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
