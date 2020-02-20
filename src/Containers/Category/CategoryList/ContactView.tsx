import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import Styles from './CategoryListStyle';
import {baseUrl} from 'src/constants';
import axios from 'axios';

import {Table, Row} from 'react-native-table-component';
import {reduceDataForScreenSize} from 'src/Components/Table/responsive/reduceDataForScreenSize';
import {useBreakpoint} from 'src/Components/Table/hooks/useBreakpoint';

import {store} from 'src/Store';

const smallScreenIndices = [0, 1, 2];
const mediumScreenIndices = [0, 1, 2];
const head = ['城市', '小区名', '电话号'];

export default function CategoryList(props) {
  const [state, dispatch] = useContext(store);

  console.log(state.region, 'state.region...');

  const breakpoint = useBreakpoint();
  const [data, setData] = useState<string[][]>();

  const [tmp, setTmp] = useState('');
  const [key, setKey] = useState(state.region);

  const handleSearch = () => {
    setKey(tmp);
  };

  useEffect(() => {
    console.log('region Key... .. ..', key);

    axios
      .get(baseUrl + 'api/contact', {
        params: {
          key,
        },
      })
      .then(function(response) {
        const items = response.data;
        let i = 0,
          result = [];

        //convert data to the table data format
        while (i < items.length) {
          result.push([]);
          for (let it in items[i]) {
            if (it === 'city' || it == 'district' || it === 'number') {
              result[result.length - 1].push(items[i][it]);
            }
          }
          i++;
        }

        setData(result);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }, [key]);

  return (
    <ScrollView style={{backgroundColor: '#f4f6f8'}}>
      <View style={Styles.CategoryListContainer}>
        <View style={Styles.FindStuffHeaderContainer}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => props.navigation.navigate('HomeView')}>
            <FastImage
              source={Images.whiteLeftChevron}
              style={Styles.FindStuffHeaderImg}
            />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#fff'}}>小区电话</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={Styles.HomeSearchContainer}>
          <View style={Styles.HomeSearchArea}>
            <TouchableOpacity onPress={handleSearch}>
              <FastImage source={Images.Search} style={Styles.HomeSearchImg} />
            </TouchableOpacity>
            <View style={Styles.HomeSearchInputContainer}>
              <TextInput
                placeholder={'请输入关键词进行搜索'}
                style={Styles.HomeSearchInput}
                onChangeText={value => {
                  setTmp(value);
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={Styles.CardsContainer}>
        {data && (
          <Table borderStyle={Styles.border} style={Styles.table}>
            <Row
              flexArr={[1, 1, 1]}
              data={reduceDataForScreenSize(
                head,
                breakpoint,
                smallScreenIndices,
                mediumScreenIndices,
              )}
              style={Styles.head}
              textStyle={Styles.text}
            />
            {data.map((entry, index) => (
              <Row
                key={index}
                flexArr={[1, 1, 1]}
                data={reduceDataForScreenSize(
                  entry,
                  breakpoint,
                  smallScreenIndices,
                  mediumScreenIndices,
                )}
                style={[
                  Styles.dataRow,
                  index % 2 && {backgroundColor: '#effeee'},
                ]}
                textStyle={Styles.text}
              />
            ))}
          </Table>
        )}
      </View>
    </ScrollView>
  );
}
