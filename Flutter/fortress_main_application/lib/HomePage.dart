import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  final AssetImage fortressAssetImage;
  const HomePage({@required fortressAssetImage})
      : fortressAssetImage = fortressAssetImage;
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
    );
  }
}
