// React
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Picker,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import StuffCard from 'src/Components/Card/StuffCard';
import {BaiduMapManager, Geolocation} from 'react-native-baidu-map';
import HomeCarousel from 'src/Components/HomeCarousel/HomeCarousel';

import styles from './HomeViewStyle';
import {Images} from 'src/Theme';

import io from 'socket.io-client';

import {baseUrl} from 'src/constants';
import axios from 'axios';
import {Map} from 'immutable';

BaiduMapManager.initSDK('sIMQlfmOXhQmPLF1QMh4aBp8zZO9Lb2A');

const socket = io(baseUrl);

export interface User {
  id: string;
  name: string;
}

const defaultUser: User = {
  id: 'anon',
  name: 'Anonymous',
};
export interface Message {
  user: User;
  id: string;
  time: Date;
  value: string;
}

export default function HomeView(props) {
  const [location, setLocation] = useState({});
  const [note, setNote] = useState('');

  const [state, setState] = useState({
    index: 0,
    routes: [
      {key: 'createAt', title: '最新'},
      {key: 'browse', title: '热门'},
      {key: 'ads', title: '精华'},
    ],
  });

  const [list, setList] = useState([]);
  const [key, setKey] = useState('');

  const handleSearch = () => {
    getList();
  };

  const handleTab = index => {
    console.log(index);
    setState({...state, index});
    getList();
  };

  const getList = () => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          sort: state.index,
          key,
        },
      })
      .then(function(response) {
        setList(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  const getNote = () => {
    axios
      .post(baseUrl + 'api/notification/last')
      .then(function(response) {
        if (response.data.item) {
          setNote(response.data.item.content);
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition().then(data => {
      setLocation(data);
    });
  };

  const [messages, setMessages] = useState(Map());

  useEffect(() => {
    getCurrentLocation();
    getNote();
    getList();

    const messageListener = (message: Message) => {
      console.log('arrived new message', message);
      setMessages(prevMessages => prevMessages.set(message.id, message));
    };

    const deleteMessageListener = (messageID: string) => {
      console.log('deleted current message', messageID);
      setMessages(prevMessages => prevMessages.delete(messageID));
    };

    socket.on('message', messageListener);
    socket.on('deleteMessage', deleteMessageListener);
    socket.emit('getMessages');
    socket.emit('message', 'HHHHHHHHHHHHHH');

    return () => {
      // socket.off('message', messageListener);
      // socket.off('deleteMessage', deleteMessageListener);
    };
  }, []);

  const ListArea = () => (
    <ScrollView style={[styles.scene, {backgroundColor: '#ffffff'}]}>
      {list.map((item, i) => (
        <StuffCard
          key={i}
          navigation
          item={item}
          proc={() => {
            {
              props.navigation.navigate('StuffPostDetail', {item});
            }
          }}></StuffCard>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.homeScrollView}>
        <View style={styles.HomeBannerContainer}>
          {location.city && (
            <Text style={{position: 'absolute', top: 0, zIndex: 100}}>
              {location.city}
            </Text>
          )}
          <HomeCarousel />
        </View>
        <View style={styles.HomeSearchContainer}>
          <View style={styles.HomeSearchArea}>
            <TouchableOpacity onPress={handleSearch}>
              <Image source={Images.Search} style={styles.HomeSearchImg} />
            </TouchableOpacity>
            <View style={styles.HomeSearchInputContainer}>
              <TextInput
                placeholder={'请输入关键词进行搜索'}
                style={styles.HomeSearchInput}
                onChangeText={value => {
                  setKey(value);
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.HomeMainBtnGroup}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('StuffPostView', {kind: 'lost'})
              }>
              <Image
                style={{width: 52, height: 52}}
                source={Images.HomeFindBtn}
              />
              <Text>寻物启事</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('StuffPostView', {kind: 'found'})
              }>
              <Image
                style={{width: 52, height: 52}}
                source={Images.HomeGetBtn}
              />
              <Text>失物招领</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('NewsView', {kind: 'found'})
            }>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Image
                style={{width: 52, height: 52}}
                source={Images.HomeNewsBtn}
              />
              <Text>新闻</Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('ContactView', {kind: 'found'})
              }>
              <Image
                style={{width: 52, height: 52}}
                source={Images.HomeMapBtn}
              />
              <Text>小区电话</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.HomeCategoryContainer}>
          {note.length > 0 && (
            <View style={styles.HomeNotificationArea}>
              <Image source={Images.RedSound} style={{width: 40, height: 40}} />
              <Text style={styles.HomeNotificationText} numberOfLines={2}>
                {note}
              </Text>
            </View>
          )}
          <View>
            <TabView
              navigationState={state}
              renderScene={SceneMap({
                createAt: ListArea,
                browse: ListArea,
                ads: ListArea,
              })}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{backgroundColor: '#1071c8'}}
                  style={{backgroundColor: 'white', elevation: 0}}
                  labelStyle={{color: 'black'}}
                />
              )}
              onIndexChange={index => handleTab(index)}
              initialLayout={{width: Dimensions.get('window').width}}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
