import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:safe_security_system_application/LoginPage.dart';
import 'package:safe_security_system_application/handlers/RegisterHandler.dart';

import 'HomePage.dart';

class RegisterPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final AssetImage fortressAssetImage =
      const AssetImage('assets/icons/code.png');
  RxString _fullName = ''.obs;
  RxString _email = ''.obs;
  RxString _password = ''.obs;
  RxString _confirmedPassword = ''.obs;
  RxString _errorMessage = ''.obs;
  RegisterHandler handler;
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
        title: Text('Register Page'),
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
                  'Register',
                  style: TextStyle(fontSize: 40),
                ),
                alignment: Alignment.center,
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.03)),
              TextFormField(
                // Full Name text form field
                cursorColor: Colors.purple,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Enter Full Name',
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
                  _fullName.value = value;
                  _fullName.refresh();
                  print(_fullName.value);
                  return null;
                },
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.02)),
              TextFormField(
                // Email text form field
                cursorColor: Colors.purple,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Enter email',
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
                  print(_email.value);
                  return null;
                },
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.02)),
              TextFormField(
                // Password text form field
                obscureText: true,
                cursorColor: Colors.purple,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Enter password',
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
                  print(_password.value);
                  return null;
                },
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.02)),
              TextFormField(
                // Confirm Password text form field
                obscureText: true,
                cursorColor: Colors.purple,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Confirm password',
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
                  _confirmedPassword.value = value;
                  _confirmedPassword.refresh();
                  if (_confirmedPassword.value != _password.value)
                    return 'Passwords do not match';

                  print('both equal');
                  return null;
                },
              ),
              Padding(
                padding: EdgeInsets.all(Get.height * 0.03),
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
              RaisedButton(
                onPressed: () {
                  // Validate will return true if the form is valid, or false if
                  // the form is invalid.
                  if (_formKey.currentState.validate()) {
                    _isLoading.toggle();
                    handler = new RegisterHandler(
                        _email.value, _password.value, _fullName.value);
                    handler.authUser().then((map) {
                      print(map['status']);
                      if (map['status'] == 1) {
                        _errorMessage.value = '';
                        _errorMessage.refresh();
                        Get.off(LoginPage());
                      } else {
                        // 4xx error
                        _errorMessage.value = map['message'];
                        _errorMessage.refresh();
                      }
                      _isLoading.toggle();
                    });
                    // Process data.
                    print('validated');
                  }
                },
                color: _accentColor,
                splashColor: Colors.purple,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Register',
                  style: TextStyle(
                    fontSize: 20,
                    color: _accentColor.computeLuminance() > 0.5
                        ? Colors.black
                        : Colors.white,
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
