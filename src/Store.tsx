import React, {createContext, useReducer, useEffect} from 'react';
import io from 'socket.io-client';
import {baseUrl} from 'src/constants';

import BackgroundJob from 'react-native-background-job';
import PushNotification from 'react-native-push-notification';

///////////////////////////////////////////////////////////////
let current_message = '';
let next_message = '';

const alertMessage = () => {
  if (current_message !== next_message) {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('NOTIFICATION: ', notification);
      },
      popInitialNotification: true,
    });
    PushNotification.localNotification({
      bigText: next_message,
      subText: '新消息到了',
      message: '',
    });
    current_message = next_message;
  }
};

BackgroundJob.setGlobalWarnings(true);
const backgroundJob = {
  jobKey: 'liveMsg',
  job: () => {
    alertMessage();
  },
};

BackgroundJob.register(backgroundJob);

let backgroundSchedule = {
  jobKey: 'liveMsg',
  period: 5000,
  exact: true,
  allowExecutionInForeground: true,
};

BackgroundJob.schedule(backgroundSchedule)
  .then(() => console.log('Success: job registered.'))
  .catch(err => console.err(err));

///////////////////////////////////////////////////////////////

const initialState = {
  socket: io(baseUrl, {query: {user_id: Date.now.toString()}}),
  token: '',
  region: '天山区',
  user: {},
  news: [],
  last_news: {},
  notifications: [],
  messages: [],
};
const store = createContext(initialState);
const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setUser': {
        return {...state, user: action.payload};
      }
      case 'setRegion': {
        return {...state, region: action.payload};
      }
      case 'setToken': {
        return {...state, auth_token: action.payload};
      }
      case 'setTokenUser': {
        return {
          ...state,
          ...action.payload,
        };
      }
      case 'setLastNews': {
        return {...state, last_news: action.payload};
      }
      case 'setNews': {
        return {...state, news: action.payload};
      }
      case 'addNews': {
        return {...state, news: [...state.news, action.payload]};
      }
      case 'setNotifications': {
        return {...state, notifications: action.payload};
      }
      case 'addNotification': {
        return {
          ...state,
          notifications: [...state.notifications, action.payload],
        };
      }
      case 'setMessages': {
        return {...state, messages: action.payload};
      }
      case 'addMessage': {
        return {...state, messages: [...state.messages, action.payload]};
      }
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    /////////////////////////////////////////////////////////////////
    state.socket.on('bg_notify', value => {
      console.log('bg_notify', value);
      next_message = value;
    });

    state.socket.on('bg_news', value => {
      console.log('bg_news', value);
      next_message = value;
    });

    state.socket.on('bg_message', value => {
      console.log('bg_message', value);
      next_message = value;
    });
    ///////////////////////////////////////////////////////////////
    state.socket.on('data_last_news', value => {
      dispatch({type: 'setLastNews', payload: value});
    });
  }, []);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export {store, StateProvider};
