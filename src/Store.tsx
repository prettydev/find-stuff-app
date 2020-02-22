import React, {createContext, useReducer, useEffect} from 'react';
import io from 'socket.io-client';
import {baseUrl, appVersion} from 'src/constants';

import BackgroundJob from 'react-native-background-job';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';

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
  messages: [],
  details: [],
  profile: {
    version: appVersion,
    service: 'OurCompany....',
    share: 'https:///',
    about: 'We are the whole...',
    phone: '11111',
  },
  current: 'home',
};
const store = createContext(initialState);
const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setCurrent': {
        return {...state, current: action.payload};
      }
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
        return {
          ...state,
          news: Array.from(
            new Set(
              [action.payload, ...state.news].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
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
      case 'setMessages': {
        return {...state, messages: action.payload};
      }
      case 'setDetails': {
        return {...state, details: action.payload};
      }
      case 'setProfile': {
        return {...state, profile: action.payload};
      }
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    if (!state.socket) return;

    state.socket.on('data_last_note', value => {
      console.log('data_last_note... ... ... ', value);
      next_message = value.content;
      dispatch({type: 'setLastNote', payload: value});
      dispatch({type: 'addNotification', payload: value});
    });

    state.socket.on('data_news', value => {
      console.log('data_news... ... ...', value);
      next_message = value.content;
      dispatch({type: 'addNews', payload: value});
    });

    if (state.user._id) {
      state.socket.on('data_profile', value => {
        console.log('data_profile... ... ...', value);
        dispatch({type: 'setProfile', payload: value});
      });

      state.socket.on(state.user._id, value => {
        console.log('message arrived from ', value);
        next_message = value.content;

        if (state.current === 'chat-list') {
          console.log('Now you are chat screen....');
          axios
            .get(baseUrl + 'api/message', {
              params: {
                user_id: state.user._id,
              },
            })
            .then(function(response) {
              console.log(response.data);
              dispatch({type: 'setMessages', payload: response.data});
            })
            .catch(function(error) {
              console.log(error);
            })
            .finally(function() {
              // always executed
            });
        } else if (state.current === 'chat-details') {
          console.log('Now you are in the chat details screen....');
          axios
            .get(baseUrl + 'api/message/' + value.sender._id, {
              params: {
                user_id: state.user._id,
              },
            })
            .then(function(response) {
              console.log(
                'from the server.$$$$$$$$$$$$$$$$$$$$$$$$$..',
                response.data,
              );

              dispatch({type: 'setDetails', payload: response.data.items});
            })
            .catch(function(error) {
              console.log('from server error.$$$$$$$$$$$$$$$$$$$$$$...', error);
            })
            .finally(function() {
              // always executed
              console.log('anyway finished.$$$$$$$$$$$$$.');
            });
        }
      });
    }

    console.log('socket changed... ... ...');
  }, [state.socket]);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export {store, StateProvider};
