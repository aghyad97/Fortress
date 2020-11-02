import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'WelcomePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    const _fortressAssetImage = AssetImage('assets/icons/code.png');
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Undecided title',
      home: WelcomePage(
        fortressAssetImage: _fortressAssetImage,
      ),
      theme: ThemeData(
        primaryColor: Colors.white,
        accentColor: Colors.purple[900],
        fontFamily: 'Changa',
      ),
    );
  }
}
