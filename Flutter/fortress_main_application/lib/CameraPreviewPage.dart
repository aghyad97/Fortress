import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:safe_security_system_application/handlers/ImageHandler.dart';

class CameraPreviewPage extends StatelessWidget {
  final String jwt, email;
  final AssetImage fortressAssetImage;
  const CameraPreviewPage(
      {@required this.fortressAssetImage,
      @required this.jwt,
      @required this.email});

  @override
  Widget build(BuildContext context) {
    const double _leadingIconPadding = 10;
    final ImageHandler imageHandler = new ImageHandler(jwt);
    final imagesFuture = imageHandler.getImagesFromServers();
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Security Camera',
          style: TextStyle(fontSize: 25),
          textAlign: TextAlign.center,
        ),
      ),
      body: FutureBuilder(
        future: imagesFuture,
        builder: (context, snapshot) {
          Widget _displayedWidget;
          if (snapshot.hasData) {
            if (snapshot.data['status'] == 1) {
              final imageList =
                  imageHandler.getImageListFromData(snapshot.data['data']);
              _displayedWidget = Center(
                child: ListView.builder(
                  padding: EdgeInsets.all(0),
                  cacheExtent: 1 * Get.height,
                  itemCount: imageList.length,
                  itemBuilder: (context, index) {
                    final base64image = imageList[index]['image'];
                    Image image = Image.memory(
                      imageHandler.translateToBytesFromBase64(base64image),
                    );
                    DateTime imageTime =
                        DateTime.parse(imageList[index]['updatedAt']);
                    String imageTimeString = imageTime.toString();
                    imageTimeString = imageTimeString.substring(
                        0, imageTimeString.length - 5);
                    Text imageTimeWidget = Text(
                      'Image taken at ' + imageTimeString,
                      style: TextStyle(),
                    );
                    return Column(
                      children: [
                        imageTimeWidget,
                        image,
                        Padding(padding: EdgeInsets.all(15)),
                      ],
                    );
                  },
                ),
              );
            } else
              _displayedWidget = Text('status 0');
          } else {
            _displayedWidget = Center(child: CircularProgressIndicator());
          }
          return _displayedWidget;
        },
      ),
    );
  }
}
