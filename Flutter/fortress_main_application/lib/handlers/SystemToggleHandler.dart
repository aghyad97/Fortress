import 'package:dio/dio.dart';
import 'package:safe_security_system_application/globals/Globals.dart';

class SystemToggleHandler {
  final String token; // needed for validation when sending to the server
  final bool toggle; // true for enable, false for disable
  Dio dio;
  Response response;

  final BaseOptions options = new BaseOptions(
    baseUrl: "https://" + Globals.IP_ADDRESS + ':' + Globals.PORT,
    connectTimeout: 5000,
    receiveTimeout: 5000,
  );

  SystemToggleHandler(this.token, this.toggle) {
    dio = new Dio(options);

    dio.options.headers['authorization'] = token;
    // adds jwt to Authorization header to verify request at server
  }

  Future<Map<String, dynamic>> toggleSystem() async {
    // authorizes the user
    try {
      response = await dio.post("/api/togglesystem", data: {
        'toggle': toggle,
      });
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
}
