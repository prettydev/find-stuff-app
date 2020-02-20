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
  MessageDetailContainer: {
    padding: 5,
  },
  LastMessageContainer: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
  },
  NewMessageContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  newMesssageText: {
    textAlignVertical: 'top',
    borderWidth: 0.3,
    borderColor: Colors.grey,
  },

  AvatarContainer: {
    flexDirection: 'row',
  },
  AvartarImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
  },
  LastMessageDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    margin: 5,
    backgroundColor: '#f4f6f8',
    color: Colors.grey,
  },
  replyBtnContainer: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyBtnWrap: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MainRed,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
  },
});
