import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LoginPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final Color _accentColor = Theme.of(context).accentColor;
    const _veryLightPurpleColor = Color(0xFFF3E5F5);
    const _lightPurpleColor = Color(0xFF4A148C);

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
            padding: EdgeInsets.all(Get.width * 0.05),
            shrinkWrap: true,
            children: <Widget>[
              TextFormField(
                decoration: const InputDecoration(
                  icon: Icon(Icons.person, color: _lightPurpleColor),
                  filled: true,
                  hintText: 'Enter your username',
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
                  return null;
                },
              ),
              Padding(padding: EdgeInsets.all(Get.height * 0.01)),
              TextFormField(
                decoration: const InputDecoration(
                  icon: Icon(Icons.lock, color: _lightPurpleColor),
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
                  return null;
                },
              ),
              Padding(
                padding: EdgeInsets.all(Get.height * 0.05),
              ),
              Padding(
                padding: EdgeInsets.all(0),
                child: RaisedButton(
                  onPressed: () {
                    // Validate will return true if the form is valid, or false if
                    // the form is invalid.
                    if (_formKey.currentState.validate()) {
                      // Process data.
                    }
                  },
                  color: _accentColor,
                  splashColor: Colors.purple,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Submit',
                    style: TextStyle(
                      fontSize: 20,
                      color: _accentColor.computeLuminance() > 0.5
                          ? Colors.black
                          : Colors.white,
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
