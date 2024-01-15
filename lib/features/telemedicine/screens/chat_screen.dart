import 'dart:async';
import 'dart:convert';

import 'package:carecompass/constants/global_variables.dart';
import 'package:carecompass/models/appointment.dart';
import 'package:carecompass/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:http/http.dart' as http;

import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

// try to adjust according to your need

class ChatScreen extends StatefulWidget {
  final Appointment receiver;

  const ChatScreen({Key? key, required this.receiver}) : super(key: key);
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late BuildContext _context;
  var _sender;
  var _receiver;
  Timer? _messageFetchTimer;
  List<types.Message> _messages = [];
  var _serialNumber = -1;

  @override
  void initState() {
    super.initState();
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    _sender = types.User(
      id: userProvider.user.id,
    );
    _receiver = types.User(
      id: widget.receiver.userId,
    );
    fetchMessage(null);
    _messageFetchTimer = Timer.periodic(
        Duration(seconds: (globalEnvironment == Environment.testing) ? 3 : 1),
        (_) {
      // ignore: avoid_init_to_null
      String? time = null;
      if (_messages.isNotEmpty) {
        // print(_messages[_messages.length - 1].createdAt.toString());
        time = DateTime.fromMillisecondsSinceEpoch(_messages[0].createdAt!)
            .toIso8601String();
        // time = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(DateTime.parse(
        //     _messages[_messages.length - 1].createdAt.toString()));
        // print(time);
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
        print("1");
        var messageData = jsonDecode(response.body)['messages'];
        var serialNumber = jsonDecode(response.body)['serialNumber'];
        setState(() {
          _serialNumber = serialNumber;
        });
        print(messageData);
        print(serialNumber);

        // print(new DateTime.fromMicrosecondsSinceEpoch(
        //     DateTime.parse(messageData[0]["sentAt"]).millisecondsSinceEpoch *
        //         1000));
        // DateTime.parse(messageData[0]["sentAt"])
        if (messageData.length > 0) {
          // List<types.Message> messages = [];
          for (var i = 0; i < messageData.length; i++) {
            // @TODO: Add logic to handle different message types
            // @TODO: Add All message to the messages list
            print(messageData[i]);
            _addMessage(types.TextMessage(
                id: const Uuid().v4(),
                author: types.User(id: messageData[i]["sender"].toString()),
                text: messageData[i]["data"],
                createdAt: DateTime.parse(messageData[i]["sentAt"])
                    .millisecondsSinceEpoch));
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
            // print(message.text);
            // Call the sendMessage method here with appropriate parameters
            sendMessage(context, widget.receiver.userId, message.text);
          },
          user: types.User(
              id: Provider.of<UserProvider>(context, listen: false).user.id)),
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
      author: _sender,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: "id",
      text: message.text,
    );

    _addMessage(textMessage);
  }
}
