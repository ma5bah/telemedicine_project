import 'dart:convert';

import 'package:amazon_clone_tutorial/constants/global_variables.dart';
import 'package:amazon_clone_tutorial/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:http/http.dart' as http;

// try to adjust according to your need

class ChatScreen extends StatefulWidget {
  final String receiverId; 

  const ChatScreen(String userId, {Key? key, required this.receiverId}) : super(key: key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  List<types.Message> _messages = [];
  final _user = types.User(id: UserProvider().user.id);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Doctor name"),
      ),
      body: Chat(
          messages: _messages, onSendPressed: _handleSendPressed, user: _user),
    );
  }

  Future<void> sendMessage(
      String receiver, String message, String authToken) async {
    final url = Uri.parse('$uri/telemedicine_api/send_message');
    final headers = {
      'Content-Type': 'application/json',
      'x-auth-token': UserProvider().user.token,
    };

    final requestBody = jsonEncode({
      'receiver': receiver,
      'message': message,
    });

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: requestBody,
      );

      if (response.statusCode == 200) {
        print('Message sent successfully');
        // Handle the successful response here
      } else {
        print('Failed to send message. Status code: ${response.statusCode}');
        // Handle the error response here
      }
    } catch (e) {
      print('Error: $e');
      // Handle any exceptions that occur during the request
    }
  }

  void _addMessage(types.Message message) {
    setState(() {
      _messages.insert(0, message);
    });
  }

  void _handleSendPressed(types.PartialText message) {
    final textMessage = types.TextMessage(
      author: _user,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: "id",
      text: message.text,
    );

    _addMessage(textMessage);
  }
}
