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
    final imagesFuture = imageHandler.getLastFiveImages();
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Security Camera',
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
                    final base64image = imageList[index];
                    Image image = Image.memory(
                      imageHandler.translateToBytesFromBase64(base64image),
                      height: 0.35 * Get.height,
                    );
                    return image;
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
