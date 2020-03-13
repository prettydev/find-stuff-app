import {Alert, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

async function requestCamPermission() {
  //   return new Promise(async (resolve, reject) => {
  //     const permissions = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       //   {
  //       //     title: '申请权限',
  //       //     message: '在设置中请开启相机权限,以正常使用',
  //       //     buttonNeutral: '等再问我',
  //       //     buttonNegative: '拒绝',
  //       //     buttonPositive: '允许',
  //       //   },
  //     );
  //     if (permissions === PermissionsAndroid.RESULTS.GRANTED) resolve(true);
  //     else reject(false);
  //   });
}

async function requestLibPermission() {
  //   return new Promise(async (resolve, reject) => {
  //     const permissions = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       //   {
  //       //     title: '申请权限',
  //       //     message: '在设置中请开启相机权限,以正常使用',
  //       //     buttonNeutral: '等再问我',
  //       //     buttonNegative: '拒绝',
  //       //     buttonPositive: '允许',
  //       //   },
  //     );
  //     if (permissions === PermissionsAndroid.RESULTS.GRANTED) resolve(true);
  //     else reject(false);
  //   });
}

async function requestLocationPermission() {
  await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, {
    title: '申请权限',
    message: '在设置中请开启位置权限,以正常使用',
    buttonNeutral: '等再问我',
    buttonNegative: '拒绝',
    buttonPositive: '允许',
  }).then(result => {
    console.log(11111, result);
  });
}

async function checkPermissions(opt) {
  let ps_opt;
  if (opt === 'location') ps_opt = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
  else if (opt === 'camera') ps_opt = PERMISSIONS.ANDROID.CAMERA;
  else if (opt === 'read_library')
    ps_opt = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  else if (opt === 'write_library')
    ps_opt = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

  let ret = check(ps_opt)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            '通知',
            '您的手机无法成功运行该应用程序的功能。',
            [{text: '知道', onPress: () => console.log('OK Pressed111')}],
            {cancelable: true},
          );
          break;
        case RESULTS.DENIED:
          Alert.alert(
            '通知',
            '要成功使用应用程序的功能，请转到设置并允许权限。',
            [{text: '知道', onPress: () => console.log('OK Pressed222')}],
            {cancelable: true},
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            '通知',
            '该权限被拒绝。',
            [{text: '知道', onPress: () => console.log('OK Pressed333')}],
            {cancelable: true},
          );
          break;
      }
      return result;
    })
    .catch(error => {
      console.log('check error...', error);
      return 'x';
    });
  return ret;
}

async function checkCamLibPermission() {
  let cam_ret = await checkPermissions('camera');
  if (cam_ret !== RESULTS.GRANTED) {
    console.log('camera grant is ', cam_ret);
    return false;
  }

  let lib_ret = await checkPermissions('read_library');
  if (lib_ret !== RESULTS.GRANTED) {
    console.log('read_library grant is ', lib_ret);
    return false;
  } else {
    return true;
  }
}

export {
  requestCamPermission,
  requestLibPermission,
  requestLocationPermission,
  checkPermissions,
  checkCamLibPermission,
};
