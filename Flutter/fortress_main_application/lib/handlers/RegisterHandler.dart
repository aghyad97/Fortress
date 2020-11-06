import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class RegisterHandler {
  final String email, password, fullName;
  Dio dio;
  Response response;

  BaseOptions options = new BaseOptions(
    baseUrl: "http://10.0.2.2:3000",
    connectTimeout: 5000,
    receiveTimeout: 5000,
    contentType: Headers.formUrlEncodedContentType,
  );

  RegisterHandler(this.email, this.password, this.fullName) {
    dio = new Dio(options);
  }

  Future<Map<String, dynamic>> authUser() async {
    try {
      response = await dio.post("/register", data: {
        "fullname": fullName,
        "email": email,
        "password": password,
      });
      return response.data;
    } on DioError catch (e) {
      if (e.response.statusCode == 401 || e.response.statusCode == 400) {
        return e.response.data;
      } else {
        return {
          'status': '-1',
          'message': 'Something went wrong, try again later',
        };
      }
    }
  }
}
