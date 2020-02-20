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
  jobKey: 'findStuffLiveMsg',
  job: () => {
    alertMessage();
  },
};

BackgroundJob.register(backgroundJob);

let backgroundSchedule = {
  jobKey: 'findStuffLiveMsg',
  period: 5000,
  exact: true,
  allowExecutionInForeground: true,
  persist: true,
  alwaysRunning: true,
};

BackgroundJob.schedule(backgroundSchedule)
  .then(() => console.log('Success: job registered.'))
  .catch(err => console.log('Failed....', err));

///////////////////////////////////////////////////////////////

const initialState = {
  socket: io(baseUrl, {ransports: ['websocket'], jsonp: false}),
  token: '',
  region: '天山区',
  user: {},
  news: [],
  last_note: {},
  notifications: [],
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
      case 'setLastNote': {
        return {...state, last_note: action.payload};
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
          notifications: Array.from(
            new Set(
              [action.payload, ...state.notifications].map(x =>
                JSON.stringify(x),
              ),
            ),
          ).map(x => JSON.parse(x)),
        };
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

    if (state.user._id) {
      state.socket.on(state.user._id, value => {
        console.log('message arrived from ', state.user._id, value);
        next_message = value;
      });
    }
    ///////////////////////////////////////////////////////////////
    state.socket.on('data_last_note', value => {
      console.log('data_last_note... ... ... ', value);
      next_message = value.content;
      dispatch({type: 'setLastNote', payload: value});
      dispatch({type: 'addNotification', payload: value});
    });

    console.log('socket changed... ... ...');
  }, [state.socket]);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export {store, StateProvider};
