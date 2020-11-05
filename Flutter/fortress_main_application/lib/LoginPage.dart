import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:safe_security_system_application/handlers/LoginHandler.dart';
import 'HomePage.dart';

class LoginPage extends StatelessWidget {
  final AssetImage fortressAssetImage =
      const AssetImage('assets/icons/code.png');
  final _formKey = GlobalKey<FormState>();
  RxBool _isShowingPassword = true.obs;
  RxString _errorMessage = ''.obs;
  RxString _email = ''.obs;
  RxString _password = ''.obs;
  LoginHandler handler;
  RxBool _isLoading = false.obs;

  @override
  Widget build(BuildContext context) {
    final Color _accentColor = Theme.of(context).accentColor;
    const _veryLightPurpleColor = Color(0xFFF3E5F5);
    const _darkPurpleColor = Color(0xFF4A148C);

    const _fieldBorder = OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(20)),
        borderSide: BorderSide(color: Colors.purple, width: 2));
    const _transparentBorder = OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(20)),
        borderSide: BorderSide(color: Colors.transparent, width: 2));

    return Scaffold(
      appBar: AppBar(
        title: Text('Login Page'),
      ),
      body: Form(
        key: _formKey,
        child: Center(
          child: ListView(
            // crossAxisAlignment: CrossAxisAlignment.start,
            physics: ClampingScrollPhysics(),
            padding: EdgeInsets.all(Get.width * 0.05),
            shrinkWrap: true,
            children: <Widget>[
              Container(
                child: Text(
                  'Login',
                  style: TextStyle(fontSize: 40),
                ),
                alignment: Alignment.center,
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.05)),
              TextFormField(
                cursorColor: Colors.purple,
                decoration: InputDecoration(
                  icon: Icon(Icons.person, color: _darkPurpleColor),
                  filled: true,
                  hintText: 'Enter your email',
                  focusedBorder: _fieldBorder,
                  border: _fieldBorder,
                  focusedErrorBorder: _fieldBorder,
                  enabledBorder: _transparentBorder,
                  fillColor: _veryLightPurpleColor,
                ),
                validator: (value) {
                  if (value.isEmpty) {
                    return 'Please enter some text';
                  }
                  _email.value = value;
                  _email.refresh();
                  return null;
                },
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.02)),
              Obx(
                () => TextFormField(
                  obscureText: _isShowingPassword.value,
                  cursorColor: Colors.purple,
                  decoration: InputDecoration(
                    icon: Icon(Icons.lock, color: _darkPurpleColor),
                    suffixIcon: IconButton(
                      icon: Icon(Icons.remove_red_eye,
                          color: _isShowingPassword.value
                              ? _darkPurpleColor
                              : Colors.purple),
                      onPressed: () => _isShowingPassword.toggle(),
                    ),
                    filled: true,
                    hintText: 'Enter your password',
                    focusedBorder: _fieldBorder,
                    focusedErrorBorder: _fieldBorder,
                    border: _fieldBorder,
                    enabledBorder: _transparentBorder,
                    fillColor: _veryLightPurpleColor,
                  ),
                  validator: (value) {
                    if (value.isEmpty) {
                      return 'Please enter some text';
                    }
                    _password.value = value;
                    _password.refresh();
                    return null;
                  },
                ),
              ),
              Padding(
                padding: EdgeInsets.all(Get.height * 0.05),
              ),
              Obx(
                () => Text(
                  _errorMessage.value,
                  style: TextStyle(
                    color: Colors.red[500],
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Padding(
                padding: EdgeInsets.all(0),
                child: Obx(
                  () => RaisedButton(
                    onPressed: _isLoading.value
                        ? null
                        : () {
                            // Validate will return true if the form is valid, or false if
                            // the form is invalid.
                            if (_formKey.currentState.validate()) {
                              _isLoading.toggle();
                              handler = new LoginHandler(
                                  _email.value, _password.value);
                              handler.authUser().then((map) {
                                print(map['status']);
                                if (map['status'] == 1) {
                                  print('token:');
                                  print(map['data']['token']);
                                  _errorMessage.value = '';
                                  _errorMessage.refresh();
                                  Get.offAll(HomePage(
                                      fortressAssetImage: fortressAssetImage));
                                } else {
                                  // 4xx error
                                  _errorMessage.value = map['message'];
                                  _errorMessage.refresh();
                                }
                                _isLoading.toggle();
                              });
                            }
                          },
                    color: _darkPurpleColor,
                    splashColor: Colors.purple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Login',
                      style: TextStyle(
                        fontSize: 20,
                        color: _darkPurpleColor.computeLuminance() > 0.5
                            ? Colors.black
                            : Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
