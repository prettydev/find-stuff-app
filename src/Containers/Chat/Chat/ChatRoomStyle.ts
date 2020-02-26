import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from 'src/Theme';

export default StyleSheet.create({
  GetStuffScreenContainer: {
    backgroundColor: '#f4f6f8',
  },
  FindStuffHeaderContainer: {
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: '#0084da',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  FindStuffHeaderImg: {
    height: 35,
    width: 35,
    borderRadius: 50,
    transform: [{rotate: '90deg'}],
  },
  CommonText: {
    fontSize: 18,
    color: '#000',
  },
  nickNameContainer: {
    flexDirection: 'row',
  },
});
