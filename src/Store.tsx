import React, {createContext, useReducer, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Pushy from 'pushy-react-native';
import io from 'socket.io-client';
import {baseUrl, appVersion} from 'src/config';
import axios from 'axios';

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
  profile: {
    version: appVersion,
    service: 'OurCompany....',
    share: 'https:///',
    about: 'We are the whole...',
    phone: '11111',
  },
  current_screen: 'home',
};
const store = createContext(initialState);
const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setCurrentScreen': {
        return {...state, current_screen: action.payload};
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
      case 'updateRoom': {
        console.log('uuuuuuuuuuuuupdateRom,...', state.rooms);
        return {
          ...state,
          rooms: state.rooms.map((r, i) =>
            r._id === action.payload.room
              ? {
                  ...r,
                  label: action.payload.content,
                  updateAt: action.payload.createAt,
                  missed: parseInt(r.missed) + 1,
                }
              : r,
          ),
        };
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
              [...state.messages, action.payload].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
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
      if (data.channel === 'data_news') {
        console.log('news from the push', data);
        // dispatch({type: 'addNews', payload: data});
      } else if (data.channel === 'data_note') {
        console.log('notes from the push, ', data);
        // dispatch({type: 'addNotification', payload: data});
      }

      if (
        state.user._id &&
        state.user.device &&
        data.channel === state.user.device
      ) {
        console.log('add messages from push', data);
        // dispatch({type: 'addMessage...', payload: data});
      }
    });

    try {
      Pushy.isRegistered().then(isRegistered => {
        if (isRegistered) {
          try {
            Pushy.subscribe('data_news')
              .then(() => {
                console.log('Subscribed to news topic successfully');
              })
              .catch(err => {
                console.log('data_news subscribe exeption', err);
              });
            Pushy.subscribe('data_note')
              .then(() => {
                console.log('Subscribed to note topic successfully');
              })
              .catch(err => {
                console.log('data_note subscribe exception', err);
              });
          } catch (err) {
            console.log(
              err,
              '..................Pushy.subscribe news, note exception',
            );
          }
        }
      });
    } catch (err) {
      console.log(
        err,
        '------------------------------isRegistered().then... exception',
      );
    }
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

        dispatch({type: 'addMessage', payload: value});

        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@', state.current_screen);

        if (state.current_screen === 'chat-room') {
          axios
            .put(baseUrl + 'api/message/' + value._id)
            .then(function(response) {
              console.log(
                'the message checked++++++++++++++++++++++++++++',
                response.data.item._id,
              );
            })
            .catch(function(error) {
              console.log('checked setting...', error);
            })
            .finally(function() {
              console.log('anyway finished, checked setting.');
            });
        } else {
          dispatch({type: 'updateRoom', payload: value});
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
