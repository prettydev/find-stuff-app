import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Images} from 'src/Theme';
import Style from './ProfileStyle';
import CustomTextInput from 'src/Components/CustomForm/CustomTextInput/CustomTextInput';

import {store} from 'src/Store';

import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import {baseUrl} from 'src/constants';
const axios = require('axios');

export default function Profile(props) {
  const [state, dispatch] = useContext(store);

  const [photo, setPhoto] = useState({name: '', source: '', data: ''});
  const [name, setName] = useState(state.user.name ? state.user.name : '');
  const nameRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);

  const handleSignout = async () => {
    props.navigation.navigate('Signin');
  };

  const handlePhoto = () => {
    ImagePicker.showImagePicker(response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const name = response.uri;
        const source = {uri: response.uri};
        const data = 'data:image/jpeg;base64,' + response.data;

        setPhoto({source, data, name});
      }
    });
  };

  async function handleSubmit() {
    if (name === '') {
      Toast.show('Input values correctly!');
      return;
    }
    console.log('ggggrreaaaaaaa');
    if (photo) {
      let formData = new FormData();

      console.log('gghhjjhjhjhjhjh');

      const file = {
        uri: photo.name,
        name: Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
        type: photo.mime || 'image/jpeg',
      };
      formData.append('file', file);

      console.log('xvvvvvvvvvvvvvvvv');

      await axios
        .post(baseUrl + 'upload/file', formData)
        .then(response => {
          axios
            .put(baseUrl + 'api/mobile/user/' + state.user._id, {
              photo: response.data.file.path,
              name,
            })
            .then(function(response2) {
              if (response2.data) {
                Toast.show('Success!');
              } else {
                Toast.show('Failed!');
              }
            })
            .catch(function(error) {
              console.log('eeeeeerrrrrrrrr', error);
              // Toast.show(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Toast.show('No photo selected');
    }
  }

  useEffect(() => {
    // getToken();
    if (!state.token) props.navigation.navigate('Signin');

    if (nameRef?.current) nameRef.current.value = state.user.name;
  }, []);

  return (
    <ScrollView style={Style.ProfileContainer}>
      <ImageBackground
        source={Images.ProfileBannerImg}
        style={Style.ProfileHeaderContainer}>
        <View style={Style.ProfileHeaderTitleContainer}>
          <Text style={Style.ProfileHeaderTitleText}>我的</Text>
        </View>
        <View style={Style.ProfileHeaderAvatarContainer}>
          <View style={Style.ProfileHeaderAvatarWrap}>
            <TouchableOpacity onPress={handlePhoto}>
              {state.user && state.user.photo && (
                <Image
                  source={{
                    uri: baseUrl + 'download/photo?path=' + state.user.photo,
                  }}
                  style={Style.ProfileHeaderAvatarImg}
                />
              )}
              {state.user && (!state.user.photo || state.user.photo === '') && (
                <Image
                  source={photo.source ? photo.source : Images.femaleProfile}
                  style={Style.ProfileHeaderAvatarImg}
                />
              )}
            </TouchableOpacity>

            <Text style={Style.ProfileHeaderAvatarText}>气候品牌亮相</Text>
            {/* <Image source={Images.} style={Style.ProfileHeaderAvatarBadge} /> */}
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1}}>{state.user.name}</Text>
          <TouchableOpacity
            onPress={() => {
              if (nameRef?.current) nameRef.current.focus();
              setIsEdit(!isEdit);
            }}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          {isEdit && (
            <>
              <TextInput
                style={{backgroundColor: 'white', flex: 1}}
                onChangeText={value => setName(value)}
                ref={nameRef}
              />
              <TouchableOpacity onPress={handleSubmit}>
                <Text>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ImageBackground>
      <View style={Style.ProfileBtnGroupContainer}>
        <View style={Style.ProfileBtnGroupWrap}>
          <View style={Style.ProfileBtnPublishedContainer}>
            <Image
              source={Images.ProfileBtnPublished}
              style={Style.ProfileBtnPublishedImg}
            />
            <Text>已发布</Text>
          </View>
          <View style={Style.ProfileLikeContainer}>
            <Image
              source={Images.ProfileBtnLike}
              style={Style.ProfileBtnLikeImg}
            />
            <Text>赞过</Text>
          </View>
        </View>
      </View>
      <View style={Style.ProfileFunctionContainer}>
        <View style={Style.ProfileUpdateContainer}>
          <View style={Style.ProfileUpdateWrap}>
            <View style={Style.ProfileUpdateLeft}>
              <Image
                source={Images.ProfileUpdate}
                style={Style.ProfileUpdateImg}
              />
              <Text>检查更新</Text>
            </View>
            <View>
              <Image
                source={Images.RightArrow}
                style={Style.ProfileRightArrow}
              />
            </View>
          </View>
        </View>
        <View style={Style.ProfileContactUsContainer}>
          <View style={Style.ProfileContactUsWrap}>
            <View style={Style.ProfileContactUsLeft}>
              <Image
                source={Images.ProfileContactus}
                style={Style.ProfileContactUsImg}
              />
              <Text>联系我们</Text>
            </View>
            <View>
              <Image
                source={Images.RightArrow}
                style={Style.ProfileRightArrow}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={Style.BottomContainer}>
        <TouchableOpacity onPress={handleSignout}>
          <View style={Style.BottomBtnWrap}>
            <Text style={Style.BottomBtnText}>安全退出</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
