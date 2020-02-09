// React
import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import StuffCard from 'src/Components/Card/StuffCard';
import {BaiduMapManager, Geolocation} from 'react-native-baidu-map';
import HomeCarousel from 'src/Components/HomeCarousel/HomeCarousel';
import styles from './HomeViewStyle';
import {Images} from 'src/Theme';

import axios from 'axios';
import {baseUrl} from 'src/constants';
// import RNFetchBlob from 'react-native-fetch-blob';
// import {fetch, removeCookieByName} from 'react-native-ssl-pinning';

import AsyncStorage from '@react-native-community/async-storage';
import regionJson from 'src/Lib/rn-wheel-picker-china-region/regionJson';
import {NavigationEvents} from 'react-navigation';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible-accordion';
import {store} from 'src/Store';
BaiduMapManager.initSDK('sIMQlfmOXhQmPLF1QMh4aBp8zZO9Lb2A');

function HomeView(props) {
  const [state, dispatch] = useContext(store);

  const [isGpsDlgVisible, setIsGpsDlgVisible] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const [note, setNote] = useState('');
  const [list, setList] = useState([]);
  const [key, setKey] = useState('');
  const [keyTmp, setKeyTmp] = useState('');

  const [tabState, setTabState] = useState({
    index: 0,
    routes: [
      {key: 'ads', title: '精华'},
      {key: 'browse', title: '热门'},
      {key: 'createAt', title: '最新'},
    ],
  });

  const _filterCitys = province => {
    const provinceData = regionJson.find(item => item.name === province);
    return provinceData.city.map(item => item.name);
  };

  const _filterAreas = (province, city) => {
    const provinceData = regionJson.find(item => item.name === province);
    const cityData = provinceData.city.find(item => item.name === city);
    return cityData.area;
  };

  const [citys, setCitys] = useState(_filterCitys('新疆'));

  const getList = () => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          sort: tabState.index,
          key,
          region: state.region,
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
        console.log('get list request finished...');
      });
  };

  useEffect(() => {
    Geolocation.getCurrentPosition().then(data => {
      if (data.city) {
        dispatch({type: 'setRegion', payload: data.city});
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    console.log('changed region... ... .. ', state.region, tabState.index, key);
    getList();
  }, [state.region, tabState.index, key, state.last_note]);

  useEffect(() => {}, [list]);

  const ListArea = () => (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
      {list.map((item, i) => (
        <StuffCard
          key={i}
          navigation={props.navigation}
          item={item}
          proc={() => {
            props.navigation.navigate('StuffPostDetail', {item});
          }}></StuffCard>
      ))}
    </ScrollView>
  );

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <NavigationEvents
          onDidFocus={() => {
            getList();
          }}
        />
        <View style={styles.homeScrollView}>
          <View
            style={{
              width: Dimensions.get('window').width,
              height: 25,
              backgroundColor: '#0084da',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setIsGpsDlgVisible(true);
              }}>
              <Text style={{color: 'white', marginLeft: 10}}>
                {state.region}
              </Text>
              <Image
                source={Images.DownArrow}
                style={{width: 10, height: 10, margin: 3}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.HomeBannerContainer}>
            <HomeCarousel />
          </View>
          <View style={styles.HomeSearchContainer}>
            <View style={styles.HomeSearchArea}>
              <TouchableOpacity
                onPress={() => {
                  setKey(keyTmp);
                }}>
                <Image source={Images.Search} style={styles.HomeSearchImg} />
              </TouchableOpacity>
              <View style={styles.HomeSearchInputContainer}>
                <TextInput
                  placeholder={'请输入关键词进行搜索'}
                  style={styles.HomeSearchInput}
                  onChangeText={value => {
                    setKeyTmp(value);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.HomeMainBtnGroup}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  props.navigation.navigate('StuffPostView', {kind: 'lost'})
                }>
                <Image
                  style={{width: 52, height: 52}}
                  source={Images.HomeFindBtn}
                />
                <Text style={{fontSize: 12}}>寻物启事</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  props.navigation.navigate('StuffPostView', {kind: 'found'})
                }>
                <Image
                  style={{width: 52, height: 52}}
                  source={Images.HomeGetBtn}
                />
                <Text style={{fontSize: 12}}>失物招领</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() =>
                props.navigation.navigate('NewsView', {kind: 'found'})
              }>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Image
                  style={{width: 52, height: 52}}
                  source={Images.HomeNewsBtn}
                />
                <Text style={{fontSize: 12}}>新闻</Text>
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  props.navigation.navigate('ContactView', {kind: 'found'})
                }>
                <Image
                  style={{width: 52, height: 52}}
                  source={Images.HomeMapBtn}
                />
                <Text style={{fontSize: 12}}>小区电话</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.HomeCategoryContainer}>
            {state.last_note.length > 0 && (
              <View style={styles.HomeNotificationArea}>
                <Image
                  source={Images.RedSound}
                  style={{width: 40, height: 40}}
                />
                <Text style={styles.HomeNotificationText} numberOfLines={2}>
                  {state.last_note}
                </Text>
              </View>
            )}
            <View>
              <TabView
                navigationState={tabState}
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
                onIndexChange={index => {
                  setKey(keyTmp);
                  setTabState({...tabState, index});
                }}
                initialLayout={{width: Dimensions.get('window').width}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={isGpsDlgVisible}
        onBackdropPress={() => setIsGpsDlgVisible(false)}
        coverScreen={false}
        style={{
          opacity: 0.8,
          backgroundColor: '#0af',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '55%',
          height: '100%',
          marginLeft: 0,
          marginTop: 0,
        }}>
        <View>
          <ScrollView>
            {citys.map((item, i) => (
              <Accordion
                onChangeVisibility={value => {
                  setShowMoreInfo(value);
                }}
                renderHeader={() => (
                  <View style={styles.wrapDropDownHeader}>
                    <Text style={{color: '#fff'}}>{item}</Text>
                  </View>
                )}
                renderContent={() => (
                  <View
                    style={{
                      paddingLeft: 30,
                      marginTop: 5,
                      backgroundColor: '#0cf',
                    }}>
                    {_filterAreas('新疆', item).map((itemValue, idx) => (
                      <TouchableHighlight
                        style={{marginTop: 3}}
                        onPress={() => {
                          dispatch({type: 'setRegion', payload: itemValue});
                          setIsGpsDlgVisible(false);
                        }}>
                        <Text style={{color: '#fff'}}>{itemValue}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                )}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

export default HomeView;
