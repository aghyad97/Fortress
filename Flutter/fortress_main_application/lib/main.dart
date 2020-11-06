import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'HomePage.dart';
import 'WelcomePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  bool isLoggedIn = false;

  void checkLoginTime() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String time = prefs.getString('loginTime');
    DateTime original = DateTime.parse((time));
    var difference = DateTime.now().difference(original).inMinutes;
    print(difference);
    if (difference >= 1) {
      isLoggedIn = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    checkLoginTime();
    const _fortressAssetImage = AssetImage('assets/icons/code.png');
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Undecided title',
      home: !isLoggedIn
          ? WelcomePage(
              fortressAssetImage: _fortressAssetImage,
            )
          : HomePage(fortressAssetImage: _fortressAssetImage),
      theme: ThemeData(
        primaryColor: Colors.white,
        accentColor: Colors.purple[900],
        fontFamily: 'Changa',
      ),
    );
  }
}
