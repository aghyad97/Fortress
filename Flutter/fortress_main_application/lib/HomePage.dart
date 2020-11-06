import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  final String jwt, fullName, email;
  final AssetImage fortressAssetImage;

  // make everything in cosntructor @required later
  // after fixing all the problems with SharedPreferences
  const HomePage(
      {this.fortressAssetImage, this.jwt, this.fullName, this.email});
  @override
  Widget build(BuildContext context) {
    const double _leadingIconPadding = 10;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Fortress',
          style: TextStyle(fontSize: 25),
          textAlign: TextAlign.center,
        ),
        leading: Container(
          child: Image(
            image: fortressAssetImage,
          ),
          padding: EdgeInsets.all(_leadingIconPadding),
        ),
      ),
      body: Container(
        child: Text('test'),
      ),
    );
  }
}
