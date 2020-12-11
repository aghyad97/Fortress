import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'LoginPage.dart';

class ThankYouPage extends StatelessWidget {
  final AssetImage fortressAssetImage;

  const ThankYouPage({Key key, this.fortressAssetImage}) : super(key: key);

  void _goToLogin() {
    Get.to(LoginPage(
      fortressAssetImage: fortressAssetImage,
    ));
  }

  @override
  Widget build(BuildContext context) {
    Color _loginButtonColor = Theme.of(context).accentColor;
    return Scaffold(
        body: Center(
      // alignment: Alignment.centerRight,
      child: ListView(
        shrinkWrap: true,
        physics: ClampingScrollPhysics(),
        padding: EdgeInsets.all(Get.width * 0.05),
        children: <Widget>[
          Image(
            image: fortressAssetImage,
            height: Get.height * 0.35,
            width: Get.width * 0.35,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.02)),
          Container(
            child: Text(
              'Thank you for registering!',
              style: TextStyle(fontSize: 30),
              textAlign: TextAlign.center,
            ),
            alignment: Alignment.center,
          ),
          Container(
            child: Text(
              'We have sent you an email confirming your registration. ' +
                  'Click the button below to login to your new account and ' +
                  'start using your Fortress security system!',
              style: TextStyle(fontSize: 15),
              textAlign: TextAlign.center,
            ),
            // alignment: Alignment.center,
          ),
          Padding(padding: EdgeInsets.all(Get.height * 0.08)),
          RaisedButton(
            onPressed: _goToLogin,
            color: _loginButtonColor,
            child: Text(
              'Login',
              style: TextStyle(
                fontSize: 20,
                color: _loginButtonColor.computeLuminance() > 0.5
                    ? Colors.black
                    : Colors.white,
              ),
            ),
            splashColor: Colors.purple,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
          ),
        ],
      ),
    ));
  }
}
