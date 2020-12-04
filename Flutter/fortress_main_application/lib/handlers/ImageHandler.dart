import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';

class ImageHandler {
  final String token; // needed for validation when sending to the server
  Dio dio;
  Response response;

  final BaseOptions options = new BaseOptions(
    baseUrl: "http://10.0.1.42:3000",
    connectTimeout: 5000,
    receiveTimeout: 5000,
  );

  ImageHandler(this.token) {
    dio = new Dio(options);

    // adds jwt to Authorization header to verify request at server
    dio.options.headers['authorization'] = token;
  }

  Future<Map<String, dynamic>> getImagesFromServers() async {
    // authorizes the user
    try {
      response = await dio.get("/api/getimages");
      return response.data;
    } on DioError catch (e) {
      if (e.response == null) {
        return {
          'status': '-1',
          'message': 'Connection error.',
        };
      }
      return e.response.data;
    }
  }

  Future<Map<String, dynamic>> getPredictedImagesFromServers() async {
    // authorizes the user
    try {
      response =
          await dio.get("/api/getimages", queryParameters: {"isPredict": true});
      return response.data;
    } on DioError catch (e) {
      if (e.response == null) {
        return {
          'status': '-1',
          'message': 'Connection error.',
        };
      }
      return e.response.data;
    }
  }

  List<dynamic> getImageListFromData(String data) {
    // parses the data string from /api/getimages and returns only
    // the base64 image list
    final List<dynamic> parsedData = jsonDecode(data);
    // List<String> imageList = [];
    // for (final map in parsedData) {
    //   imageList.add(map['image']);
    // }
    return parsedData;
  }

  Uint8List translateToBytesFromBase64(String base64image) {
    final Uint8List _bytesImage = base64.decode(base64image);
    return _bytesImage;
  }
}
