import 'dart:async';
import 'dart:convert';

import 'package:amazon_clone_tutorial/constants/global_variables.dart';
import 'package:amazon_clone_tutorial/models/appointment.dart';
import 'package:amazon_clone_tutorial/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

// try to adjust according to your need

class ChatScreen extends StatefulWidget {
  final Appointment receiver;

  const ChatScreen({Key? key, required this.receiver}) : super(key: key);
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late BuildContext _context;
  Timer? _messageFetchTimer;
  List<types.Message> _messages = [];
  final _user = types.User(id: UserProvider().user.id);
  @override
  void initState() {
    super.initState();
    fetchMessage(null);
    _messageFetchTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      String time = "";
      if (_messages.length > 0) {
        time = _messages[_messages.length - 1].createdAt.toString();
      }
      fetchMessage(time);
    });
  }

  @override
  void dispose() {
    _messageFetchTimer?.cancel();
    super.dispose();
  }

  Future<void> fetchMessage(String? dte) async {
    // print(dte);
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    // print(userProvider.user.token);
    final finalUrl = Uri.parse('$uri/telemedicine_api/get_message');

    Map<String, dynamic> requestBody = {
      'receiver': widget.receiver.userId,
    };
    if (dte != null) {
      requestBody['time'] = dte;
    }
    try {
      final response = await http.post(
        finalUrl,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': userProvider.user.token,
        },
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        var messageData = jsonDecode(response.body);
        print("messageData");
        print(messageData);
        if (messageData["messages"].length > 0) {
          List<types.Message> messages = [];
          for (var i = 0; i < messageData["messages"].length; i++) {
            // @TODO: Add logic to handle different message types
            // @TODO: Add All message to the messages list
            // messages.add(types.TextMessage(id: ));
          }
        }
        // Handle the message data here
      } else {
        print('Failed to fetch messages. Status code: ${response.statusCode}');
        // Handle the error response here
      }
    } catch (e) {
      print('Error: $e');
      // Handle any exceptions that occur during the request
    }
  }

  @override
  Widget build(BuildContext context) {
    _context = context;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.receiver.name),
      ),
      body: Chat(
          messages: _messages,
          onSendPressed: (message) {
            print(message.text);
            // Call the sendMessage method here with appropriate parameters
            sendMessage(context, widget.receiver.userId, message.text);
          },
          user: _user),
    );
  }

  Future<void> sendMessage(
      BuildContext context, String receiver, String message) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final url = Uri.parse('$uri/telemedicine_api/send_message');
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': userProvider.user.token,
        },
        body: jsonEncode({
          'receiver': receiver,
          'message': message,
          'type': "TEXT",
        }),
      );

      if (response.statusCode == 200) {
        print('Message sent successfully');
        var chatData = json.decode(response.body);
        print(chatData["messages"]);
        // Handle the successful response here
      } else {
        print('Failed to send message. Status code: ${response.body}');
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
