import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:safe_security_system_application/CameraPreviewPage.dart';
import 'package:safe_security_system_application/PredictionCameraPreviewPage.dart';
import 'package:safe_security_system_application/handlers/SystemToggleHandler.dart';

import 'WelcomePage.dart';
import 'handlers/LoginHandler.dart';
import 'handlers/NotificationHandler.dart';

class HomePage extends StatelessWidget {
  final String jwt, email;
  final AssetImage fortressAssetImage;
  RxBool isOn = true.obs;
  RxBool isLoading = false.obs;
  NotificationHandler notificationHandler;
  // make everything in cosntructor @required later
  // after fixing all the problems with SharedPreferences
  HomePage(
      {@required this.fortressAssetImage,
      @required this.jwt,
      @required this.email}) {
    notificationHandler = NotificationHandler();
    final handler = SystemToggleHandler(jwt, isOn.value);
    handler.toggleSystem().then((map) {
      print(map);
    }); // enables/disables system\
  }

  @override
  Widget build(BuildContext context) {
    const double _leadingIconPadding = 10;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Fortress',
          style: TextStyle(fontSize: 25),
          textAlign: TextAlign.center,
        ),
        leading: Container(
          child: Image(
            image: fortressAssetImage,
          ),
          padding: EdgeInsets.all(_leadingIconPadding),
        ),
        actions: [
          IconButton(
              icon: Icon(Icons.logout),
              highlightColor: Colors.purple[900],
              onPressed: () {
                LoginHandler.logOut();
                notificationHandler.logOut();
                Get.offAll(WelcomePage(fortressAssetImage: fortressAssetImage));
              })
        ],
      ),
      body: ListView(
        physics: ClampingScrollPhysics(),
        padding: EdgeInsets.all(Get.width * 0.05),
        shrinkWrap: true,
        children: [
          Padding(padding: EdgeInsets.all(Get.height * 0.03)),
          Container(
            child: RaisedButton.icon(
              icon: Icon(Icons.camera, color: Colors.white),
              label: Text(
                "People Detected",
                style: TextStyle(fontSize: 30, color: Colors.white),
              ),
              onPressed: () => Get.to(PredictionCameraPreviewPage(
                  fortressAssetImage: this.fortressAssetImage,
                  jwt: this.jwt,
                  email: this.email)),
              color: Colors.purple[900],
              splashColor: Colors.purple,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            height: Get.height * 0.2,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.01)),
          Container(
            child: RaisedButton.icon(
              label: Text(
                "Camera Archive",
                style: TextStyle(fontSize: 30),
              ),
              icon: Icon(
                Icons.camera_roll_rounded,
              ),
              onPressed: () => Get.to(CameraPreviewPage(
                  fortressAssetImage: this.fortressAssetImage,
                  jwt: this.jwt,
                  email: this.email)),
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            height: Get.height * 0.2,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.05)),
          Text('Enable/Disable Security System',
              textAlign: TextAlign.center, style: TextStyle(fontSize: 25)),
          Padding(padding: EdgeInsets.all(Get.height * 0.01)),
          Obx(
            () => Align(
              child: Transform.scale(
                scale: 2,
                child: SizedBox(
                  width: 75,
                  // padding: EdgeInsets.fromLTRB(100, 0, 100, 0),
                  child: Switch(
                    value: isOn.value,
                    onChanged: isLoading.value
                        ? null
                        : (bool newValue) {
                            isOn.value = newValue;
                            isOn.refresh();
                            isLoading.toggle();
                            final handler = SystemToggleHandler(jwt, newValue);
                            handler.toggleSystem().then((map) {
                              isLoading.toggle();
                              print(map);
                            }); // enables/disables system
                          },
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
