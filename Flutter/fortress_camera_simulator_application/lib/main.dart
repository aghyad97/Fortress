import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'camera_widget.dart';

// import 'HomePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
        title: 'Safe Camera Simulator',
        home: CameraWidget(),
        theme: ThemeData(
          primaryColor: Color(0xFF4dd0e1),
          accentColor: Color(0xFFff5722),
        ));
  }
}
