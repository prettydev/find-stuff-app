import React, {useState, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './LostStuffScreenStyle';
import CustomFormSelect from 'src/Components/CustomForm/CustomFormSelect/CustomFormSelect';
import {Colors, Images} from 'src/Theme';
import ChinaRegionWheelPicker from 'src/Lib/rn-wheel-picker-china-region';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import {store} from 'src/Store';
import axios from 'axios';
import {NavigationEvents} from 'react-navigation';
import {baseUrl, photoSize} from 'src/constants';

const LostStuffScreen = props => {
  const [state, dispatch] = useContext(store);
  const [tag, setTag] = useState('');
  const [place, setPlace] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fee, setFee] = useState(0);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState([]);

  const handlePhoto = () => {
    ImagePicker.showImagePicker(
      {
        title: '选择一张照片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '从照片中选择',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ImageResizer.createResizedImage(
            response.uri,
            photoSize,
            photoSize,
            'JPEG',
            100,
            0,
          )
            .then(({uri, path, name, size}) => {
              console.log('uri', uri, 'path', path, 'name', name, 'size', size);

              setPhoto([...photo, {uri, name, type: 'image/jpeg'}]);
            })
            .catch(err => {
              console.log('resize error... ... ...', err);
            });
        }
      },
    );
  };

  async function handleSubmit() {
    if (tag === '' || place === '' || address === '' || description === '') {
      Toast.show('正确输入值!');
      return;
    }

    if (photo && photo.length > 0) {
      let formData = new FormData();
      photo.forEach(ph => {
        formData.append('photo', ph);
      });

      console.log('name or phone ???', state.user.name || state.user.phone);

      await axios
        .post(baseUrl + 'upload/photo', formData)
        .then(response => {
          const photos = response.data.photo;
          axios
            .post(baseUrl + 'api/stuffpost', {
              kind: 'lost',
              tag,
              place,
              address,
              fee,
              phone,
              description,
              photos,
              user: state.user._id,
              title: state.user.name,
            })
            .then(function(response2) {
              Toast.show(response2.data.msg);
              if (response2.data.success) {
                props.navigation.navigate('AppHome');
              }
            })
            .catch(function(error) {
              Toast.show(error);
            });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
        });
    } else {
      axios
        .post(baseUrl + 'api/stuffpost', {
          kind: 'lost',
          tag,
          place,
          address,
          fee,
          phone,
          description,
          photos: [],
          user: state.user._id,
          title: state.user.name || state.user.phone,
        })
        .then(function(response2) {
          Toast.show(response2.data.msg);
          if (response2.data.success) {
            props.navigation.navigate('AppHome');
          }
        })
        .catch(function(error) {
          Toast.show(error);
        });
    }
  }

  return (
    <ScrollView style={Styles.FindStuffScreenContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (!state.user._id) props.navigation.navigate('Signin');
        }}
      />
      <View style={Styles.FindStuffHeaderContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('AppHome')}
          style={{flex: 1}}>
          <FastImage
            source={Images.whiteLeftChevron}
            style={Styles.FindStuffHeaderImg}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: '#fff'}}>详细情况</Text>
        <Text style={{flex: 1}} />
      </View>
      <View style={Styles.StuffInfoContainer}>
        <CustomFormSelect
          CustomFormSelectLabel={'物品类型'}
          CustomFormSelectPlaceholder={'请选择类型'}
          procFunc={value => setTag(value)}
        />
        <View style={Styles.FindStuffAreaContainer}>
          <View>
            <Text>选择地点</Text>
          </View>
          <View style={{flex: 1}}>
            <ChinaRegionWheelPicker
              onSubmit={params =>
                setPlace(`${params.province},${params.city},${params.area}`)
              }
              onCancel={() => console.log('cancel')}>
              <Text
                style={{
                  backgroundColor: '#FFF',
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'black',
                }}>
                {place || '点击去选择地区'}
              </Text>
            </ChinaRegionWheelPicker>
          </View>
        </View>

        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>详细地址</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              onChangeText={value => setAddress(value)}
            />
          </View>
        </View>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>联系电话</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              onChangeText={value => setPhone(value)}
              keyboardType={'numeric'}
            />
          </View>
        </View>
      </View>
      <View style={Styles.FindStuffPriceBtnContainer}>
        <Text>悬赏金额</Text>
        <TextInput
          style={Styles.FindStuffPriceInput}
          onChangeText={value => setFee(value)}
          keyboardType={'numeric'}
        />
        <Text>元</Text>
      </View>
      <View style={Styles.FindStuffFooter}>
        <View>
          <Text>物品描述</Text>
          <TextInput
            style={Styles.FindStuffTextArea}
            multiline={true}
            numberOfLines={4}
            onChangeText={value => setDescription(value)}
          />
        </View>
        <View style={Styles.FindStuffImgUploadContainer}>
          <TouchableOpacity
            style={Styles.FindStuffImgUploadWrap}
            onPress={handlePhoto}>
            <FastImage
              source={Images.Camera}
              style={Styles.FindStuffImgUpload}
            />
            <Text style={{color: Colors.grey}}>添加图片</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.FindStuffImgGroupContainer}>
          {photo &&
            photo.map((ph, i) => (
              <FastImage key={i} source={ph} style={{width: 70, height: 70}} />
            ))}
        </View>
      </View>
      <View style={Styles.FindStuffSubBtnContainer}>
        <TouchableOpacity style={Styles.FindStuffSubBtn} onPress={handleSubmit}>
          <Text style={Styles.FindStuffSubBtnText}>确认发布</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LostStuffScreen;
