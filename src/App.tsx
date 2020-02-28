import React, {useState, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreenWithBottomNav from 'src/Components/BottomTabNav/BottomTabNav';
import SigninScreen from 'src/Containers/Authentication/SignInScreen/SignInScreen';
import SignUpScreen from 'src/Containers/Authentication/SignUpScreen/SignUpScreen';
import ForgotPwdScreen from 'src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen';
import LostStuffScreen from 'src/Containers/AddInfo/LostStuffScreen/LostStuffScreen';
import FoundStuffScreen from 'src/Containers/AddInfo/FoundStuffScreen/FoundStuffScreen';
import ChatRoom from 'src/Containers/Chat/Chat/ChatRoom';
import UserInfo from 'src/Containers/Category/UserInfo/UserInfo';
import {StateProvider} from 'src/Store';

// import RNPermissions, {
//   request,
//   NotificationsResponse,
//   Permission,
//   PERMISSIONS,
//   PermissionStatus,
// } from 'react-native-permissions';

// const {...PERMISSIONS_IOS} = PERMISSIONS.IOS; // remove siri (certificate required)

// const PLATFORM_PERMISSIONS = Platform.select<
//   typeof PERMISSIONS_IOS | typeof PERMISSIONS.ANDROID | {}
// >({
//   ios: PERMISSIONS_IOS,
//   android: PERMISSIONS.ANDROID,
//   default: {},
// });
// const PERMISSIONS_VALUES: Permission[] = Object.values(PLATFORM_PERMISSIONS);

/////////////////////////////////////////////////////////////////////////////////////////////////////
const AppNavigator = createStackNavigator(
  {
    MainScreenWithBottomNav: MainScreenWithBottomNav,
    Signin: SigninScreen,
    SignUp: SignUpScreen,
    ForgotPwdScreen: ForgotPwdScreen,

    LostStuffScreen: LostStuffScreen,
    FoundStuffScreen: FoundStuffScreen,

    ChatRoom: ChatRoom,
    UserInfo: UserInfo,
  },
  {
    initialRouteName: 'MainScreenWithBottomNav',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  // const [statuses, setStatuses] = useState<PermissionStatus>([]);
  // const [notifications, setNotifications] = useState<NotificationsResponse>({
  //   status: 'unavailable',
  //   settings: {},
  // });

  // useEffect(() => {
  //   console.log('will check permissions....');
  //   Promise.all(PERMISSIONS_VALUES.map(_ => RNPermissions.check(_)))
  //     .then(statuses => {
  //       setStatuses(statuses);
  //       console.log('statuses....', statuses);
  //     })
  //     .then(() => RNPermissions.checkNotifications())
  //     .then(notifications => {
  //       setNotifications(notifications);
  //       console.log('notifications....', notifications);
  //     })
  //     .catch(error => console.warn(error));

  //   if (Platform.OS)
  //     request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(result => {
  //       console.log('request result, ....', result);
  //     });
  // }, []);

  return (
    <StateProvider>
      <AppContainer />
    </StateProvider>
  );
}
