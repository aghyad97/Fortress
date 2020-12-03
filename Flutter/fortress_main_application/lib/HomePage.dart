import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:safe_security_system_application/handlers/SystemToggleHandler.dart';

import 'WelcomePage.dart';
import 'handlers/LoginHandler.dart';
import 'handlers/NotificationHandler.dart';

class HomePage extends StatelessWidget {
  final String jwt, fullName, email;
  final AssetImage fortressAssetImage;
  RxBool isOn = false.obs;
  RxBool isLoading = false.obs;
  NotificationHandler notificationHandler;
  // make everything in cosntructor @required later
  // after fixing all the problems with SharedPreferences
  HomePage({this.fortressAssetImage, this.jwt, this.fullName, this.email}) {
    notificationHandler = NotificationHandler();
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
              // splashColor: Colors.purple[900],
              highlightColor: Colors.purple[900],
              onPressed: () {
                LoginHandler.logOut();
                Get.offAll(WelcomePage(fortressAssetImage: fortressAssetImage));
              })
        ],
      ),
      body: ListView(
        physics: ClampingScrollPhysics(),
        padding: EdgeInsets.all(Get.width * 0.05),
        shrinkWrap: true,
        children: [
          Text('Enable/Disable Security System',
              textAlign: TextAlign.center, style: TextStyle(fontSize: 25)),
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
