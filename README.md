# find-stuff-app

# design
https://org.modao.cc/app/cbcc45733afb052cfb083f105bcce28c#screen=s59869B75281555836197914

# build release version guide

1. android/app/build.gradle
   1. bundleInRelease: true
   2. enableHermes: false
2. command
   1. react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
3. android/app/src/main/res/
   1. delete drawable*, raw directories
4. command
   1. cd android
   2. ./gradlew assembleRelease
5. android/app/build/outputs/apk/release
   1. could find release version apk.
6. What parts consumed my valuable times
   1. trial to remove unused packages from package.json, you may try it after build successfully.
      1. in my guess, it occurs import path error, still can't find correct reason, but was painful for me.
   2. enableHermes: true, this is the really bad option to set true.
   3. mis deleting mipmap directories, absolutely don't delete!
   4. mis setting of bundleInRelease: true, remember, never forgot!
   5. don't modify some app functions, it makes the problem more difficult.
      1. this project, i modified BottomNavTab, and didn't test it's behavior, so eventually modified again like the start point.
7. Happy coding!