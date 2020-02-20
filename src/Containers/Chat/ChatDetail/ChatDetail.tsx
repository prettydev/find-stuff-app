import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
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
  const [reply, setReply] = useState('');
  const [guest, setGuest] = useState(props.navigation.getParam('guest'));
  const [list, setList] = useState([]);

  const getDetails = () => {
    if (!guest._id) {
      Toast.show('失败了!');
      return;
    }
    axios
      .get(baseUrl + 'api/message/' + guest._id, {
        params: {
          user_id: state.user._id,
        },
      })
      .then(function(response) {
        console.log('from the server........................', response.data);

        setList(response.data.items);
      })
      .catch(function(error) {
        console.log('from server error.....................', error);
      })
      .finally(function() {
        // always executed
        console.log('anyway finished.....');
      });
  };

  useEffect(() => {
    console.log('redrawing with the new list................');
  }, [list]);

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
        content: reply,
        sender: state.user._id,
        receiver: guest._id,
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

  return (
    <ScrollView style={Styles.GetStuffScreenContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
          else {
            getDetails();
          }
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
        {guest !== null && (
          <Text style={{fontSize: 20, color: '#fff'}}>{guest.name}</Text>
        )}
        {guest === null && (
          <Text style={{fontSize: 20, color: '#fff'}}>{''}</Text>
        )}
        <Text style={{flex: 1}} />
      </View>
      <View style={Styles.MessageDetailContainer}>
        <View style={Styles.LastMessageContainer}>
          <View style={Styles.AvatarContainer}>
            <Image
              style={Styles.AvartarImg}
              source={
                guest.photo
                  ? {
                      uri: baseUrl + 'download/photo?path=' + guest.photo,
                    }
                  : Images.maleProfile
              }
              resizeMode="cover"
              borderRadius={30}
            />
            <View>
              <View style={Styles.nickNameContainer}>
                <Text style={Styles.CommonText}>
                  {guest !== null ? guest.name : ''}
                </Text>
              </View>
            </View>
          </View>

          {list.length > 0 &&
            list.map((msg, i) => (
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
