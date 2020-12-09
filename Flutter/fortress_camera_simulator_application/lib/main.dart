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
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primaryColor: Colors.purple[900],
          accentColor: Colors.purple[100],
        ));
  }
}
