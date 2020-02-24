import React, {useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import Styles from './NotificationListStyle';
import NotificationCard from 'src/Components/Card/NotificationCard/NotificationCard';
import {store} from 'src/Store';
import {baseUrl} from 'src/constants';
import axios from 'axios';

import {NavigationEvents} from 'react-navigation';

const NotificationList = props => {
  const [state, dispatch] = useContext(store);

  const getList = () => {
    axios
      .get(baseUrl + 'api/notification', {})
      .then(function(response) {
        dispatch({type: 'setNotifications', payload: response.data});
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
    <ScrollView style={{backgroundColor: '#f4f6f8'}}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
        }}
      />
      <View style={Styles.CategoryListContainer}>
        <View style={Styles.FindStuffHeaderContainer}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              props.navigation.navigate('AppHome');
            }}>
            {
              <FastImage
                source={Images.whiteLeftChevron}
                style={Styles.FindStuffHeaderImg}
              />
            }
          </TouchableOpacity>

          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#fff'}}>通知</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={Styles.NotificationTabContainer}>
          {state.notifications.map((item, i) => (
            <NotificationCard
              key={i}
              item={item}
              proc={() => {
                {
                  props.navigation.navigate('NotificationDetail', {item});
                }
              }}></NotificationCard>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default NotificationList;
