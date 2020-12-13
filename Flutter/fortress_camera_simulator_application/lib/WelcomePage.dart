import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'LoginPage.dart';
import 'RegisterPage.dart';

class WelcomePage extends StatelessWidget {
  final AssetImage fortressAssetImage;

  void _goToLogin() {
    Get.to(LoginPage(
      fortressAssetImage: fortressAssetImage,
    ));
  }

  void _goToRegister() {
    Get.to(RegisterPage());
  }

  const WelcomePage({@required fortressAssetImage})
      : fortressAssetImage = fortressAssetImage;
  @override
  Widget build(BuildContext context) {
    Color _loginButtonColor = Theme.of(context).primaryColor;
    return Scaffold(
        body: Center(
      // alignment: Alignment.centerRight,
      child: ListView(
        shrinkWrap: true,
        physics: ClampingScrollPhysics(),
        padding: EdgeInsets.all(Get.width * 0.05),
        children: <Widget>[
          Image(
            image: fortressAssetImage,
            height: Get.height * 0.35,
            width: Get.width * 0.35,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.02)),
          Container(
            child: Text(
              'Welcome to the Security Camera Simulator',
              style: TextStyle(fontSize: 30),
              textAlign: TextAlign.center,
            ),
            alignment: Alignment.center,
          ),
          Container(
            child: Text(
              'Keep your valuables protected from anything',
              style: TextStyle(fontSize: 15),
              textAlign: TextAlign.center,
            ),
            // alignment: Alignment.center,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.08)),
          RaisedButton(
            onPressed: _goToLogin,
            color: _loginButtonColor,
            child: Text(
              'Login',
              style: TextStyle(
                fontSize: 20,
                color: _loginButtonColor.computeLuminance() > 0.5
                    ? Colors.black
                    : Colors.white,
              ),
            ),
            splashColor: Colors.purple,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
          ),
          RaisedButton(
            onPressed: _goToRegister,
            child: Text('Register', style: TextStyle(fontSize: 20)),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            color: Colors.white,
          ),
        ],
      ),
    ));
  }
}
