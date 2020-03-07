import React, {useState, useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: () => {}, //this._onRegister.bind(this),

  // (required) Called when a remote or local notification is opened or received
  onNotification: () => {}, //this._onNotification,

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: '', //gcm,

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

export const checkPermission = cbk => {
  return PushNotification.checkPermissions(cbk);
};

export const cancelNotif = () => {
  // PushNotification.cancelLocalNotifications({id});
};

export const cancelAll = () => {
  PushNotification.cancelAllLocalNotifications();
};

export const localNotifTitle = data => {
  console.log('?????????????????????????????', data);

  PushNotification.localNotification({
    /* Android Only Properties */
    // id: '' + lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    // ticker: data.alarm.type, // (optional)
    autoCancel: true, // (optional) default: true
    largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
    smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
    //      bigText: data.alarm.cause + '', // (optional) default: "message" prop
    subText: 'subText', // (optional) default: none
    color: 'red', // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: 'group', // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification

    /* iOS only properties */
    alertAction: 'view', // (optional) default: view
    category: null, // (optional) default: null
    userInfo: null, // (optional) default: null (object containing additional notification data)

    /* iOS and Android properties */
    title: 'aaaa', //data.alarm.id + '', // (optional)
    message: data, //data.alarm.wellName, // (required)
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
  });
};
