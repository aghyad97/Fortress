import 'package:dio/dio.dart';
import 'package:safe_camera_simulator_application/globals/Globals.dart';

class RegisterHandler {
  final String email, password, fullName;
  Dio dio;
  Response response;

  BaseOptions options = new BaseOptions(
    baseUrl: "http://" + Globals.IP_ADDRESS + ':' + Globals.PORT,
    connectTimeout: 5000,
    receiveTimeout: 5000,
    contentType: Headers.formUrlEncodedContentType,
  );

  RegisterHandler(this.email, this.password, this.fullName) {
    dio = new Dio(options);
  }

  String getRegistrationErrorFromResponse(Map responseMap) {
    // Gets the error message that was recieved from the server
    // Returns the string of the first error found in the data array
    final List<dynamic> msgList = responseMap['data'];
    final String errorMessage = msgList[0]['msg'];
    return errorMessage;
  }

  Future<Map<String, dynamic>> authUser() async {
    try {
      response = await dio.post("/register", data: {
        "fullName": fullName,
        "email": email,
        "password": password,
      });
      return response.data;
    } on DioError catch (e) {
      if (e.response == null) {
        return {
          'status': '-1',
          'message': 'Please connect to the internet.',
        };
      }
      if (e.response.statusCode == 401 || e.response.statusCode == 400) {
        print(e.response);
        return e.response.data;
      } else {
        print('error!');
        return {
          'status': '-1',
          'message': 'Something went wrong, try again later',
        };
      }
    }
  }
}
