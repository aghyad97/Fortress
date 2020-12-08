# Fortress - Safe Security System - IoT Course Project

This is IoT **course-related** project.
It is safe security system where mobile phones act as IoT devices to get sensors data and publish messages using MQTT IoT messaging. It is also have two front-ends which are the website and mobile app to fully control the system and also send notifications to the user in case the safe is in danger.

In this project, you will different sub-directories and each one refer to different part of the project.
### Application Server
This directory mainly contains the backend server and database API. It also serves a website as front-end where the user can create an account, login, and monitor the dashboard of the system. It is also have MQTT middleware to receive some messages and also publish.
### Flutter
Flutter directory contains two applications, Fortress main app which is another front-end where the user can create an account, login and monitor the dashboard of the system. The other app is camera simulator app which acts as an IoT device monitoring the safe at the house. The camera simulator also have TensorFlow Lite Model to detect if there is a person in the field of the camera.
### Machine-Learning
The directory contains files related to the person detection of our system to detect if a person is trying to access the system.
### Node-Red
This directory includes sensors flow services such as an accelerometer that can be placed on the safe to detect if someone is moving the safe itself. Also it has proximity sensor which can publish messages if there is someone near the safe.

# TODO

### Todo

- [ ] Add more features to the dashboard

### In Progress

- [ ] Working on Github Repo   

### Done ✓


# Team Members:

> Saif AlNajjar - [Github Profile](https://github.com/sete39)

>  Ramy gendy - [Github Profile](https://github.com/Ramy-Gendy)

> Aghyad Alahmad - [Github Profile](https://github.com/aghyad97)

