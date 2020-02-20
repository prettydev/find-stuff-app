import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images, Colors} from 'src/Theme';
import Styles from './NotificationDetailStyle';

import moment from 'moment';

export default function StuffPostDetail({navigation}) {
  const [item, setItem] = useState(navigation.getParam('item'));
  useEffect(() => {}, []);

  return (
    <>
      <ScrollView style={{backgroundColor: '#f4f6f8'}}>
        <View>
          <View style={Styles.FindStuffHeaderContainer}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => navigation.navigate('NotificationView')}>
              <FastImage
                source={Images.whiteLeftChevron}
                style={Styles.FindStuffHeaderImg}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: '#fff'}}>详情</Text>
            </View>
            <View style={{flex: 1}}></View>
          </View>
          <View style={Styles.UserInfoContainer}>
            <View style={Styles.AvatarContainer}>
              <View style={Styles.AvatarPhotoContainer}>
                <FastImage
                  style={Styles.AvatarPhoto}
                  source={Images.maleProfile}
                />

                <View style={Styles.UserNameContainer}>
                  <View style={Styles.UserNameWrap}>
                    <View>
                      <Text>{'管理员'}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{color: Colors.grey}}>
                      {moment(item.createAt).format('M月D日 ')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={Styles.StuffInfoContainer}>
            <View>
              <Text style={{color: Colors.grey}}>{item.content}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
