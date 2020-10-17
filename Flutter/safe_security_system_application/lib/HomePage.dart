import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'LoginPage.dart';
import 'RegisterPage.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    void _goToLogin() {
      Navigator.of(context)
          .push(MaterialPageRoute(builder: (BuildContext context) {
        return LoginPage();
      }));
    }

    void _goToRegister() {
      Navigator.of(context)
          .push(MaterialPageRoute(builder: (BuildContext context) {
        return RegisterPage();
      }));
    }

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
