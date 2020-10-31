import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'LoginPage.dart';
import 'RegisterPage.dart';

class HomePage extends StatelessWidget {
  void _goToLogin() {
    Get.to(LoginPage());
  }

  void _goToRegister() {
    Get.to(RegisterPage());
  }

  @override
  Widget build(BuildContext context) {
    const double _leadingIconPadding = 10;
    const _fortressPath = 'assets/icons/code.png';
    const _fortressAssetImage = AssetImage(_fortressPath);
    Color _loginButtonColor = Colors.purple[900];
    return Scaffold(
        appBar: AppBar(
            title: Text(
              'Fortress',
              style: TextStyle(fontSize: 25),
            ),
            leading: Container(
              child: Image(
                image: _fortressAssetImage,
              ),
              padding: EdgeInsets.all(_leadingIconPadding),
            )),
        body: Center(
          // alignment: Alignment.centerRight,
          child: ListView(
            shrinkWrap: true,
            physics: ClampingScrollPhysics(),
            padding: EdgeInsets.all(Get.width * 0.05),
            children: <Widget>[
              Image(
                image: _fortressAssetImage,
                height: Get.height * 0.35,
                width: Get.width * 0.35,
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.02)),
              Container(
                child: Text(
                  'Welcome to Fortress',
                  style: TextStyle(fontSize: 30),
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
              Padding(padding: EdgeInsets.all(Get.height * 0.05)),
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
