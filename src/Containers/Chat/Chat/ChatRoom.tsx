import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './ChatRoomStyle';
import {Images} from 'src/Theme';
import moment from 'moment';
import {store} from 'src/Store';
import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/constants';

import {NavigationEvents} from 'react-navigation';
import axios from 'axios';

import {Colors} from 'src/Theme';

export default function ChatRoom(props) {
  const [state, dispatch] = useContext(store);
  const [content, setContent] = useState('');
  const [guest, setGuest] = useState(props.navigation.getParam('guest'));
  const [room, setRoom] = useState(props.navigation.getParam('room'));

  const scrollRef = useRef(null);

  const getRooms = async () => {
    if (room === undefined || room === '') {
      console.log(state.user._id, guest._id, '==========================');

      await axios
        .post(baseUrl + 'api/room', {
          uid1: state.user._id,
          uid2: guest._id,
        })
        .then(function(response) {
          if (response.data) {
            setRoom(response.data.item);
            console.log(response.data.item, '----room number');
            /////////////////////////////////////////////////
            const room_id = response.data.item._id;
            axios
              .get(baseUrl + 'api/message/', {
                params: {room_id, user_id: state.user._id},
              })
              .then(function(res) {
                dispatch({type: 'setMessages', payload: res.data.items});

                //remove unread marks
                room.missed = 0;
                setRoom(room);
                // dispatch({type: 'updateRoom', payload: room});
              })
              .catch(function(err) {
                console.log('from server error..........', err);
              })
              .finally(function() {
                // always executed
                console.log('anyway finished.....');
              });
            /////////////////////////////////////////////////
          } else {
            Toast.show('失败了!');
          }
        })
        .catch(function(error) {
          Toast.show(error);
        });
    } else {
      console.log(
        state.user._id,
        guest._id,
        room,
        '==========================',
      );
    }
  };

  const handleSubmit = async () => {
    if (guest === null) {
      Toast.show('错误的接收者!');
      return;
    }

    if (content === '') {
      Toast.show('正确输入值！');
      return;
    }

    const msg = {
      user: state.user._id,
      room: room._id,
      content,
      receiver: guest._id,
    };

    await axios
      .post(baseUrl + 'api/message', msg)
      .then(function(response) {
        if (response.data) {
          dispatch({
            type: 'addMessage',
            payload: {
              user: state.user,
              content,
              createAt: new Date(),
            },
          });
          setContent('');
          // props.navigation.navigate('RoomList');
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
  }, []);

  return (
    <>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
          else {
            dispatch({type: 'setCurrent', payload: 'chat'});
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

      <ScrollView
        style={Styles.GetStuffScreenContainer}
        ref={scrollRef}
        onContentSizeChange={(contentWidth, contentHeight) => {
          scrollRef.current.scrollToEnd({animated: true});
        }}>
        <View style={{padding: 12}}>
          {state.messages &&
            state.messages.map((msg, i) => {
              return msg.user._id === state.user._id ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 5,
                    justifyContent: 'flex-end',
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.robinSEgg,
                      margin: 5,
                      marginRight: 10,
                      padding: 3,
                      borderRadius: 3,
                    }}>
                    <Text>{msg.content}</Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: -5,
                        top: 7,
                        width: 0,
                        height: 0,
                        borderTopColor: 'transparent',
                        borderTopWidth: 5,
                        borderLeftWidth: 5,
                        borderLeftColor: Colors.robinSEgg,
                        borderBottomWidth: 5,
                        borderBottomColor: 'transparent',
                      }}
                    />
                  </View>
                  <FastImage
                    style={{width: 33, height: 33, borderRadius: 50}}
                    source={
                      msg.user.photo
                        ? {
                            uri:
                              baseUrl + 'download/photo?path=' + msg.user.photo,
                          }
                        : Images.maleProfile
                    }
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 5,
                  }}>
                  <FastImage
                    style={{width: 33, height: 33, borderRadius: 50}}
                    source={
                      msg.user.photo
                        ? {
                            uri:
                              baseUrl + 'download/photo?path=' + msg.user.photo,
                          }
                        : Images.maleProfile
                    }
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      margin: 5,
                      marginLeft: 10,
                      padding: 3,
                      borderRadius: 3,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        left: -5,
                        top: 7,
                        width: 0,
                        height: 0,
                        borderTopColor: 'transparent',
                        borderTopWidth: 5,
                        borderRightWidth: 5,
                        borderRightColor: '#fff',
                        borderBottomWidth: 5,
                        borderBottomColor: 'transparent',
                      }}
                    />
                    <Text>{msg.content}</Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View style={{flexDirection: 'row', margin: 5}}>
        <TextInput
          style={{
            flex: 7,
            height: 40,
            borderWidth: 0,
            backgroundColor: '#fff',
          }}
          underlineColorAndroid="transparent"
          placeholderTextColor="grey"
          numberOfLines={1}
          value={content}
          onChangeText={value => setContent(value)}
        />
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: Colors.active,
            marginLeft: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleSubmit}>
          <Text style={{color: '#fff'}}>发送</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
