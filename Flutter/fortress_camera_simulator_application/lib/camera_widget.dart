import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:camera/camera.dart';
import 'package:image/image.dart' as imglib;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';

class CameraWidget extends StatelessWidget {
  CameraController _controller;
  List<CameraDescription> cameras; // list of camers
  CameraDescription selectedCamera; // currently selected camera
  Future<void> _initializeControllerFuture;
  var isReady = 0.obs;
  var nSentImages = 0;
  var isTransmitting = false.obs;
  final String serverEndPoint = 'http://10.0.1.42:3000/api/image';

  Future<void> getCameras() async {
    // gets the cameras list
    cameras = await availableCameras();
    print('initialized camera list');
    // takes the first camera found
    // change to make it selectable in the future
    selectedCamera = cameras.first;

    print('initialized camera with name ' + selectedCamera.name);
    _controller = CameraController(
      selectedCamera,
      ResolutionPreset.low,
    );
    _initializeControllerFuture = _controller.initialize();
    await _initializeControllerFuture;
    isReady++;
    print('isReady ${isReady}');
  }

  imglib.Image _convertBGRA8888(CameraImage image) {
    return imglib.Image.fromBytes(
      image.width,
      image.height,
      image.planes[0].bytes,
      format: imglib.Format.bgra,
    );
  }

  // CameraImage YUV420_888 -> PNG -> Image (compresion:0, filter: none)
  // Black
  imglib.Image _convertYUV420(CameraImage image) {
    var img = imglib.Image(
      image.width,
      image.height,
    ); // Create Image buffer
    final int uvRowStride = image.planes[1].bytesPerRow;
    final int uvPixelStride = image.planes[1].bytesPerPixel;

    // Fill image buffer with plane[0] from YUV420_888
    for (int x = 0; x < image.width; x++) {
      for (int y = 0; y < image.height; y++) {
        final int uvIndex =
            uvPixelStride * (x / 2).floor() + uvRowStride * (y / 2).floor();
        final int index = y * image.width + x;

        final yp = image.planes[0].bytes[index];
        final up = image.planes[1].bytes[uvIndex];
        final vp = image.planes[2].bytes[uvIndex];
        // Calculate pixel color
        int r = (yp + vp * 1436 / 1024 - 179).round().clamp(0, 255);
        int g = (yp - up * 46549 / 131072 + 44 - vp * 93604 / 131072 + 91)
            .round()
            .clamp(0, 255);
        int b = (yp + up * 1814 / 1024 - 227).round().clamp(0, 255);
        // color: 0x FF  FF  FF  FF
        //           A   B   G   R
        img.data[index] = (0xFF << 24) | (b << 16) | (g << 8) | r;
      }
    }

    return img;
  }

  // coversion functions from
  // https://gist.github.com/Alby-o/fe87e35bc21d534c8220aed7df028e03#gistcomment-3218349

  Future<List<int>> convertImagetoPng(CameraImage image) async {
    try {
      imglib.Image img;
      if (image.format.group == ImageFormatGroup.yuv420) {
        img = _convertYUV420(image);
      } else if (image.format.group == ImageFormatGroup.bgra8888) {
        img = _convertBGRA8888(image);
      }

      imglib.JpegEncoder jpegEncoder = new imglib.JpegEncoder();

      // // Convert to png
      List<int> convertedImage = jpegEncoder.encodeImage(img);
      final base64image = base64Encode(convertedImage);

      http.post(serverEndPoint, body: {
        "image": base64image,
      }).then((res) {
        print(res.statusCode);
        print(res.body);
      }).catchError((err) {
        print(err);
      });
      print('sent image');
      return convertedImage;
    } catch (e) {
      print(">>>>>>>>>>>> ERROR:" + e.toString());
    }
    return null;
  }

  _processCameraImage(CameraImage image) {
    if ((nSentImages % 120) == 1 && isTransmitting.value) {
      // send every n frames and only when button is pressed
      print('converting image');
      convertImagetoPng(image);
    }
    nSentImages++;
  }

  Future<void> infinitePictureCapture() async {
    try {
      await _initializeControllerFuture; // await to make sure it initalized

      _controller?.startImageStream((image) => _processCameraImage(image));
    } catch (e) {
      print(e);
    }
  }

  void _startStopImageUpload() {
    // starts transmitting if not transmitting
    // and stops transmitting if currently transmitting
    isTransmitting.toggle(); // flips bool value of isTransmitting
    print(isTransmitting);

    if (isTransmitting.value)
      Fluttertoast.showToast(
        msg: 'Starting image upload',
        backgroundColor: Colors.grey[400],
        textColor: Colors.black87,
      );
    else
      Fluttertoast.showToast(
        msg: 'Stopping image upload',
        backgroundColor: Colors.grey[400],
        textColor: Colors.black87,
      );
  }

  @override
  Widget build(BuildContext context) {
    var convertedImage;
    final _cameraFutureBuilder = FutureBuilder(
      future: getCameras(), // which future to wait till complete
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          isReady++;
          // when future is done and camera is initialized
          print('initialized controller');
          if (isReady > 0) {
            final _cameraPreview = CameraPreview(_controller);
            infinitePictureCapture();
            return _cameraPreview;
          } else {
            return Center(child: CircularProgressIndicator());
          }
        } else {
          // when future is not yet done
          return Center(child: CircularProgressIndicator());
        }
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Security Camera Simulator',
        ),
      ),
      body: Center(
        child: _cameraFutureBuilder,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _startStopImageUpload(),
        child: Icon(
          Icons.file_upload,
          color: Colors.black,
        ),
      ),
    );
  }
}
