import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';
import 'package:safe_security_system_application/globals/Globals.dart';

class NotificationHandler {
  MqttServerClient mqttClient =
      MqttServerClient(Globals.BROKER_IP_ADDRESS, 'main_app'); // port 1883

  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  NotificationHandler() {
    _connectAndSubscribe();
    _initializeNotifications();
  }
  void onSubscribed(String topic) {
    print('Subscribed to topic $topic');
  }

  void onConnected() {
    print('Connected');
    mqttClient.subscribe('project/foundperson', MqttQos.exactlyOnce);
  }

  Future<void> _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('code');
    final IOSInitializationSettings initializationSettingsIOS =
        IOSInitializationSettings();
    final MacOSInitializationSettings initializationSettingsMacOS =
        MacOSInitializationSettings();
    final InitializationSettings initializationSettings =
        InitializationSettings(
            android: initializationSettingsAndroid,
            iOS: initializationSettingsIOS,
            macOS: initializationSettingsMacOS);
    await flutterLocalNotificationsPlugin.initialize(initializationSettings,
        onSelectNotification: _selectNotification);
  }

  Future _selectNotification(String payload) async {
    if (payload != null) {
      print('notification payload: $payload');
    }
    // await Get.to(HomePage(fortressAssetImage: fortressAssetImage, ));
  }

  void displayNotification(String foundTimeString) async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
            'your channel id', 'your channel name', 'your channel description',
            importance: Importance.max,
            priority: Priority.high,
            showWhen: false);
    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    await flutterLocalNotificationsPlugin.show(
        0,
        'Person Detected!',
        'A person was detected on ${foundTimeString}!',
        platformChannelSpecifics);
  }

  Future<void> _connectAndSubscribe() async {
    mqttClient.onConnected = onConnected;
    mqttClient.onSubscribed = onSubscribed;
    mqttClient.connect();
    mqttClient.updates.listen((event) {
      final MqttPublishMessage message = event[0].payload;
      final payload =
          MqttPublishPayload.bytesToStringAsString(message.payload.message);
      final topic = event[0].topic;
      if (topic == 'project/foundperson') {
        print('SENDING NOTIFICATION');
        warnUserWithNotification(payload);
      }
    });
  }

  void warnUserWithNotification(String payload) {
    DateTime foundTime =
        DateTime.fromMillisecondsSinceEpoch(int.parse(payload));
    String foundTimeString = foundTime.toString();
    foundTimeString = foundTimeString.substring(0, foundTimeString.length - 4);
    displayNotification(foundTimeString);
  }
}
