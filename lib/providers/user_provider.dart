import 'dart:convert';

import 'package:carecompass/constants/global_variables.dart';
import 'package:carecompass/models/user.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class UserProvider extends ChangeNotifier {
  User _user = User(
    id: '',
    name: '',
    email: '',
    password: '',
    address: '',
    type: UserType.USER,
    token: '',
    cart: [],
  );

  User get user => _user;

  void setUser(String user) {
    _user = User.fromJson(user);
    notifyListeners();
  }

  void setUserFromModel(User user) {
    _user = user;
    notifyListeners();
  }

  Future<void> handleCallEnd(String appointment_id) async {
    final url =
        Uri.parse('$uri/telemedicine_api/set_start_consultation_request');
    final response = await http.post(url,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: json.encode({
          "chat_id": appointment_id,
          "start_consultation_request": false,
        }));
    final responseData = json.decode(response.body);
    // Handle the response as needed
  }
}
