// React
import React, {useEffect, useState, useContext} from 'react';
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
import Toast from 'react-native-simple-toast';
import styles from './HomeViewStyle';
import {Images} from 'src/Theme';

import {baseUrl} from 'src/constants';

import axios from 'axios';
import {Map} from 'immutable';
import {store} from 'src/Store';
import NotificationPopup from 'react-native-push-notification-popup';
import AsyncStorage from '@react-native-community/async-storage';

import regionJson from 'src/Lib/rn-wheel-picker-china-region/regionJson';

BaiduMapManager.initSDK('sIMQlfmOXhQmPLF1QMh4aBp8zZO9Lb2A');

function HomeView(props) {
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
  // const [state, dispatch] = useContext(store);

  const _filterCitys = province => {
    const provinceData = regionJson.find(item => item.name === province);

    return provinceData.city.map(item => item.name);
  };

  const _filterAreas = (province, city) => {
    const provinceData = regionJson.find(item => item.name === province);
    const cityData = provinceData.city.find(item => item.name === city);
    return cityData.area;
  };

  const [region, setRegion] = useState('新疆');
  const [citys, setCitys] = useState(_filterCitys('新疆'));
  const [areas, setAreas] = useState(_filterAreas('新疆', '乌鲁木齐'));

  const [selectedCity, setSelectedCity] = useState('乌鲁木齐');
  const [selectedArea, setSelectedArea] = useState('天山区');

  const [showArea, setShowArea] = useState(false);

  const [list, setList] = useState([]);
  const [key, setKey] = useState('');

  const handleTab = index => {
    setState({...state, index});
    getList();
  };

  const getList = () => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          sort: state.index,
          key,
          region,
        },
      })
      .then(function(response) {
        console.log('aa', response.data);
        setList(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  const getList2 = newRegion => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          sort: 0, //state.index,
          key,
          region: newRegion,
        },
      })
      .then(function(response) {
        console.log('aaaaaaaaaaaaaaaaa', response.data);
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

  useEffect(() => {
    AsyncStorage.clear();

    getCurrentLocation();
    getNote();
    getList();

    return () => {};
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
          {
            //   location.city && (
            //   <Text style={{position: 'absolute', top: 0, zIndex: 100}}>
            //     {location.city}
            //   </Text>
            // )
          }

          <Picker
            selectedValue={selectedCity}
            mode="dropdown"
            style={{
              height: 25,
              width: 120,
              position: 'absolute',
              top: 0,
              zIndex: 100,
            }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedCity(itemValue);
              setAreas(_filterAreas('新疆', itemValue));
              setSelectedArea(areas[0]);
              setShowArea(true);
            }}>
            {citys.map(item => (
              <Picker.Item label={item} value={item} />
            ))}
          </Picker>

          {showArea && (
            <Picker
              selectedValue={selectedArea}
              mode="dropdown"
              style={{
                height: 25,
                width: 120,
                position: 'absolute',
                top: 0,
                left: 100,
                zIndex: 100,
              }}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCity(itemValue);
                setRegion('新疆,' + selectedCity + ',' + itemValue);

                console.log('selected value...', region);
                getList();
              }}>
              {areas.map(item => (
                <Picker.Item label={item} value={item} />
              ))}
            </Picker>
          )}
          <HomeCarousel />
        </View>
        <View style={styles.HomeSearchContainer}>
          <View style={styles.HomeSearchArea}>
            <TouchableOpacity onPress={getList}>
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

export default HomeView;
