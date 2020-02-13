import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreenWithBottomNav from 'src/Components/BottomTabNav/BottomTabNav';
import SigninScreen from 'src/Containers/Authentication/SignInScreen/SignInScreen';
import SignUpScreen from 'src/Containers/Authentication/SignUpScreen/SignUpScreen';
import ForgotPwdScreen from 'src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen';
import LostStuffScreen from 'src/Containers/AddInfo/LostStuffScreen/LostStuffScreen';
import FoundStuffScreen from 'src/Containers/AddInfo/FoundStuffScreen/FoundStuffScreen';
import Notification from 'src/Containers/Notification/NotificationList/NotificationList';
import ChatDetail from 'src/Containers/Chat/ChatDetail/ChatDetail';
import UserInfo from 'src/Containers/Category/UserInfo/UserInfo';
import LocalPhone from 'src/Containers/LocalPhone/LocalPhone';

import {StateProvider} from 'src/Store';

const AppNavigator = createStackNavigator(
  {
    MainScreenWithBottomNav: MainScreenWithBottomNav,
    Signin: SigninScreen,
    SignUp: SignUpScreen,
    ForgotPwdScreen: ForgotPwdScreen,

    LostStuffScreen: LostStuffScreen,
    FoundStuffScreen: FoundStuffScreen,

    Notification: Notification,
    ChatDetail: ChatDetail,

    UserInfo: UserInfo,
    LocalPhone: LocalPhone,
  },
  {
    initialRouteName: 'MainScreenWithBottomNav',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const AppWrapper = () => {
  return <AppContainer />;
};

const App = () => {
  return (
    <StateProvider>
      <AppWrapper />
    </StateProvider>
  );
};

export default App;
