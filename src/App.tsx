import React, {
  createContext,
  ReactElement,
  FC,
  useContext,
  useReducer,
} from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import MainScreenWithBottomNav from 'src/Components/BottomTabNav/BottomTabNav';
import SigninScreen from 'src/Containers/Authentication/SignInScreen/SignInScreen';
import SignUpScreen from 'src/Containers/Authentication/SignUpScreen/SignUpScreen';
import ForgotPwdScreen from 'src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen';
import LostStuffScreen from 'src/Containers/AddInfo/LostStuffScreen/LostStuffScreen';
import FoundStuffScreen from 'src/Containers/AddInfo/FoundStuffScreen/FoundStuffScreen';
import Published from 'src/Containers/Profile/Published/Published';
import Attention from 'src/Containers/Profile/Attention/Attention';
import Notification from 'src/Containers/Notification/NotificationList/NotificationList';

import {store, StateProvider} from 'src/Store';

const AppNavigator = createStackNavigator(
  {
    MainScreenWithBottomNav: MainScreenWithBottomNav,
    Signin: SigninScreen,
    SignUp: SignUpScreen,
    ForgotPwdScreen: ForgotPwdScreen,

    LostStuffScreen: LostStuffScreen,
    FoundStuffScreen: FoundStuffScreen,

    Published: Published,
    Attention: Attention,
    Notification: Notification,
  },
  {
    initialRouteName: 'MainScreenWithBottomNav',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const App: FC = (): ReactElement => {
  return (
    <StateProvider>
      <AppContainer />
    </StateProvider>
  );
};

export default App;
