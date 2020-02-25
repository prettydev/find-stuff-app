import React, {createContext, useReducer, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Pushy from 'pushy-react-native';
import axios from 'axios';
import io from 'socket.io-client';
import {baseUrl, appVersion} from 'src/constants';

const initialState = {
  socket: io(baseUrl, {ransports: ['websocket'], jsonp: false}),
  token: '',
  region: '天山区',
  user: {},
  news: [],
  last_note: {},
  notifications: [],
  rooms: [],
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
      case 'setRooms': {
        return {...state, rooms: action.payload};
      }
      case 'addRoom': {
        return {
          ...state,
          rooms: Array.from(
            new Set(
              [action.payload, ...state.rooms].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
      }
      case 'setMessages': {
        return {...state, messages: action.payload};
      }
      case 'addMessage': {
        return {
          ...state,
          messages: Array.from(
            new Set(
              [action.payload, ...state.massages].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
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

  const pushInit = () => {
    Pushy.listen();
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ).then(granted => {
        if (!granted) {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ).then(result => {
            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            }
          });
        }
      });
    }

    Pushy.setNotificationClickListener(async data => {
      console.log('Clicked notification: ' + data);
      if (data.channel === 'data_news')
        dispatch({type: 'addNews', payload: data});
      else if (data.channel === 'data_note')
        dispatch({type: 'addNotification', payload: data});
    });

    Pushy.isRegistered().then(isRegistered => {
      if (isRegistered) {
        Pushy.subscribe('data_news')
          .then(() => {
            console.log('Subscribed to news topic successfully');
          })
          .catch(err => {
            console.error(err);
          });
        Pushy.subscribe('data_note')
          .then(() => {
            console.log('Subscribed to note topic successfully');
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
  };

  const socketInit = () => {
    if (!state.socket) return;

    state.socket.emit('getLastNote');

    state.socket.on('data_note', value => {
      console.log('data_note... ... ... ', value);
      dispatch({type: 'setLastNote', payload: value});
      dispatch({type: 'addNotification', payload: value});
    });

    state.socket.on('data_news', value => {
      console.log('data_news... ... ...', value);
      dispatch({type: 'addNews', payload: value});
    });

    if (state.user._id) {
      state.socket.on('data_profile', value => {
        console.log('data_profile... ... ...', value);
        dispatch({type: 'setProfile', payload: value});
      });

      state.socket.on(state.user._id, value => {
        console.log('message arrived from ', value);

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
  };

  useEffect(() => {
    socketInit();
  }, [state.socket]);

  useEffect(() => {
    pushInit();
  }, []);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export {store, StateProvider};

Pushy.setNotificationListener(async data => {
  console.log('Received notification: ' + JSON.stringify(data));
  let notificationTitle = '寻N';
  Pushy.notify(notificationTitle, data.content, data);
});
