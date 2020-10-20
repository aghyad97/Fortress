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
    return Scaffold(
        appBar: AppBar(
          title: Text(
            'Temporary title',
          ),
        ),
        body: Column(children: <Widget>[
          RaisedButton(
              onPressed: _goToLogin,
              child: Text('Login', style: TextStyle(fontSize: 20))),
          RaisedButton(
              onPressed: _goToRegister,
              child: Text('Register', style: TextStyle(fontSize: 20))),
        ]));
  }
}
