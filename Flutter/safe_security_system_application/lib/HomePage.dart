import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Temporary title',
        ),
      ),
      body: Container(
          alignment: Alignment.center,
          child: Text(
            'test',
            textAlign: TextAlign.center,
          )),
    );
  }
}
