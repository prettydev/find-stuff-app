import React from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import {Images} from 'src/Theme';
import Style from './CardStyle';
import RoundBtn from 'src/Components/Buttons/RoundBtn/RoundBtn';
import RectBtn from 'src/Components/Buttons/RectBtn/RectBtn';
import {Card} from 'react-native-shadow-cards';
import moment from 'moment';
import {baseUrl} from 'src/constants';

export default function StuffCard(props) {
  const {item, proc} = props;

  return (
    <TouchableOpacity onPress={proc} style={Style.CardWrap}>
      <Card style={{padding: 12, flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={Style.ImageSection}>
            {item.user !== null &&
              item.user.photo !== null &&
              item.user.photo.length === 0 && (
                <Image
                  style={Style.AvatarStyle}
                  source={Images.maleProfile}
                  resizeMode="cover"
                  borderRadius={30}
                />
              )}
            {item.user != null &&
              item.user.photo != null &&
              item.user.photo.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('UserInfo', {item: item.user});
                  }}>
                  <Image
                    style={Style.AvatarStyle}
                    // source={{
                    //   uri: baseUrl + 'download/photo?path=' + item.user.photo,
                    // }}
                    source={Images.maleProfile}
                    resizeMode="cover"
                    borderRadius={30}
                  />
                </TouchableOpacity>
              )}
          </View>
          <View style={{flex: 5}}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text>{item.title}</Text>
                  </View>
                  <View>
                    {item.kind === 'lost' && (
                      <RectBtn
                        RectBtnTitle={'寻物启事'}
                        RectBtnColor={'blueTransparent90'}
                      />
                    )}
                    {item.kind === 'found' && (
                      <RectBtn
                        RectBtnTitle={'失物招领'}
                        RectBtnColor={'MainYellow'}
                      />
                    )}
                  </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <View style={{flex: 1}}>
                    {item.fee > 0 && (
                      <RoundBtn
                        RoundBtnTitle={'赏 ¥ ' + item.fee}
                        RoundBtnColor={'MainRed'}
                      />
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <RoundBtn
                      RoundBtnTitle={'联系TA'}
                      RoundBtnColor={'MainYellow'}
                      proc={() => {
                        props.navigation.navigate('ChatDetail', {
                          item: item.user,
                          msg: {},
                        });
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text style={Style.Userdate}>{item.phone}</Text>
            </View>
            <View>
              <Text style={Style.Userdate}>
                {moment(item.createAt).format('M月D日 hh时mm分')}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View style={Style.CardDesAndImgContainer}>
            <View style={Style.CardDescription}>
              <Text numberOfLines={3} style={Style.CardDescriptionText}>
                {item.description}
              </Text>
            </View>
            <View style={Style.CardImageSection}>
              {item.photos.length > 0 && (
                <Image
                  source={{
                    uri: baseUrl + 'download/photo?path=' + item.photos[0].path,
                  }}
                  style={Style.CardImage}
                />
              )}
            </View>
          </View>
          <View style={Style.CardLocation}>
            <View style={Style.CardLocationGroup}>
              <Image
                style={Style.CardLocationImg}
                source={Images.BlueMapIcon}
              />
              <Text style={Style.CardLocationText}>{item.place}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
