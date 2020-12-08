import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'HomePage.dart';
import 'WelcomePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  String email;
  String jwt;

  Future<bool> checkLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String time = prefs.getString('loginTime');
    email = prefs.getString('email');
    jwt = prefs.getString('jwt');
    if (time != null) {
      DateTime original = DateTime.parse(time);
      var difference = DateTime.now().difference(original).inMinutes;
      if (difference > 120) {
        // 2 hour expire time, need to get this from jwt though :(
        return false;
      }
    }
    if (jwt != null) {
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    const _fortressAssetImage = AssetImage('assets/icons/code.png');
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Undecided title',
      home: FutureBuilder(
        future: checkLogin(),
        builder: (context, snapshot) {
          Widget _displayedWidget;
          if (snapshot.hasData) {
            _displayedWidget = !snapshot.data
                ? WelcomePage(
                    fortressAssetImage: _fortressAssetImage,
                  )
                : HomePage(
                    fortressAssetImage: _fortressAssetImage,
                    email: this.email,
                    jwt: this.jwt,
                  );
          } else {
            _displayedWidget = Center(child: CircularProgressIndicator());
          }
          return _displayedWidget;
        },
      ),
      theme: ThemeData(
        primaryColor: Colors.white,
        accentColor: Colors.purple[900],
        // fontFamily: 'Changa',
      ),
    );
  }
}
