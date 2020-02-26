import React, {useEffect, useContext} from 'react';
import {ScrollView, View, Text, TouchableOpacity, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './RoomListStyle';
import {Images, Colors} from 'src/Theme';
import {store} from 'src/Store';
import {baseUrl} from 'src/constants';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import axios from 'axios';

import {NavigationEvents} from 'react-navigation';

const RoomList = props => {
  const [state, dispatch] = useContext(store);

  const getList = () => {
    axios
      .get(baseUrl + 'api/room', {
        params: {
          user_id: state.user._id,
        },
      })
      .then(function(response) {
        console.log(response.data.items, 'rooms data.................');
        console.log(response.data.missed, 'missed data.................');
        dispatch({type: 'setRooms', payload: response.data.items});
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
    <>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
          else dispatch({type: 'setCurrent', payload: 'room'});
        }}
      />
      <View style={Styles.FindStuffHeaderContainer}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => props.navigation.navigate('AppHome')}>
          <FastImage
            source={Images.whiteLeftChevron}
            style={Styles.FindStuffHeaderImg}
          />
        </TouchableOpacity>

        <Text style={{fontSize: 20, color: '#fff'}}>私信</Text>
        <Text style={{flex: 1}} />
      </View>
      <ScrollView style={Styles.GetStuffScreenContainer}>
        <View style={Styles.MessageListContainer}>
          {state.messages.length === 0 && (
            <View
              style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
              <Text>没有讯息</Text>
            </View>
          )}
          <FlatList
            horizontal={false}
            data={state.rooms}
            renderItem={({item}) => (
              <TouchableOpacity
                style={Styles.MessageListWrap}
                onPress={() => {
                  props.navigation.navigate('ChatRoom', {
                    guest:
                      state.user._id === item.users[0]._id
                        ? item.users[1]
                        : item.users[0],
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
                      {item.missed > 0 && (
                        <View style={Styles.AvatarBadgeContainer}>
                          <Text style={{color: '#fff'}}>{item.missed}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>
                        {state.user._id === item.users[0]._id
                          ? item.users[1].name
                          : item.users[0].name}
                      </Text>
                      <Text style={{color: Colors.grey}}>
                        {moment(item.updateAt).format('M月D日 hh时mm分')}
                      </Text>
                    </View>
                    <Text numberOfLines={2} style={{color: Colors.grey}}>
                      {item.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default RoomList;
