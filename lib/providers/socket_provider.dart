// socket_io_provider.dart

import 'package:carecompass/constants/global_variables.dart';
import 'package:flutter/cupertino.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketIOProvider extends ChangeNotifier {
  final IO.Socket _socket = IO.io(uri, <String, dynamic>{
    'transports': ['websocket'],
    'autoConnect': true,
  });
  void initSocket(String userId) {
    _socket.onConnect((_) {
      // print('Connected to server');
      // for (int i = 0; i < 100; i++) {
      //   print('connect $i');
      // }
      _socket.emit('subscribe', userId);
      _socket.emit('msg', 'test');
    });

    // _socket.on('connect', (_) {
    //   print('Connected to server');
    //   _socket.emit('chat message', 'Hello from Flutter client');
    // });

    _socket.on('chat message', (data) {
      print('Received message from server: $data');
    });

    _socket.onDisconnect((_) => print('disconnect'));

    // _socket.on('disconnect', (_) {
    //   print('Disconnected from server');
    //   notifyListeners();
    // });
    
    _socket.connect();
  }

  void sendMessage(String message) {
    _socket.emit('chat message', message);
  }

  void disconnect() {
    _socket.disconnect();
    notifyListeners();
  }

  IO.Socket getSocket() {
    return _socket;
  }
}


