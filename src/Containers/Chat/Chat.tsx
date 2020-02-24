import React, {useEffect, useContext} from 'react';
import {ScrollView, View, Text, TouchableOpacity, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './ChatStyle';
import {Images, Colors} from 'src/Theme';
import {store} from 'src/Store';
import {baseUrl} from 'src/constants';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import axios from 'axios';

import {NavigationEvents} from 'react-navigation';

const Chat = props => {
  const [state, dispatch] = useContext(store);

  const getList = () => {
    axios
      .get(baseUrl + 'api/message', {
        params: {
          user_id: state.user._id,
        },
      })
      .then(function(response) {
        console.log(response.data);
        dispatch({type: 'setMessages', payload: response.data});
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <ScrollView style={Styles.GetStuffScreenContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
          else dispatch({type: 'setCurrent', payload: 'chat-list'});
        }}
      />
      <View style={Styles.FindStuffHeaderContainer}>
        <Text style={{fontSize: 20, color: '#fff'}}>私信</Text>
      </View>
      <View style={Styles.MessageListContainer}>
        {state.messages.length === 0 && (
          <View
            style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <Text>没有讯息</Text>
          </View>
        )}
        <FlatList
          horizontal={false}
          data={state.messages}
          renderItem={({item}) => (
            <TouchableOpacity
              style={Styles.MessageListWrap}
              onPress={() => {
                if (!item._id) {
                  Toast.show('错误');
                  return;
                }

                if (item._id._id === state.user._id) {
                  Toast.show('错误');
                  return;
                }
                props.navigation.navigate('ChatDetail', {
                  guest: item._id,
                });
              }}>
              <View style={Styles.MessageListAvatarWrap}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{flex: 1, marginRight: 5}}>
                    {item._id && (
                      <FastImage
                        source={
                          item._id.photo
                            ? {
                                uri:
                                  baseUrl +
                                  'download/photo?path=' +
                                  item._id.photo,
                              }
                            : Images.maleProfile
                        }
                        style={Styles.MessageListAvatar}
                        resizeMode="cover"
                      />
                    )}
                    {
                      <View style={Styles.AvatarBadgeContainer}>
                        <Text style={{color: '#fff'}}>{item.total}</Text>
                      </View>
                    }
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{item._id ? item._id.name : ''}</Text>
                    <Text style={{color: Colors.grey}}>
                      {moment(item.createAt).format('M月D日 hh时mm分')}
                    </Text>
                  </View>
                  <Text numberOfLines={2} style={{color: Colors.grey}}>
                    {item.content}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
};

export default Chat;
