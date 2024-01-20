import 'dart:convert';

import 'package:carecompass/constants/global_variables.dart';
import 'package:carecompass/features/telemedicine/screens/chat_screen.dart';
import 'package:carecompass/features/telemedicine/screens/video_call_screen.dart';
import 'package:carecompass/models/appointment.dart';
import 'package:carecompass/models/user.dart';
import 'package:carecompass/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

class AppointmentCard extends StatelessWidget {
  final Appointment appointment;

  const AppointmentCard({Key? key, required this.appointment})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    return Card(
      child: ListTile(
        leading: Image.network(appointment.image_url),
        title: Row(
          children: [
            Expanded(
              // Wrap this around the Text widget
              child: userProvider.user.type == UserType.DOCTOR
                  ? Text(
                      "${appointment.name} serial: ${appointment.serialNumber == -1 ? "X" : appointment.serialNumber}")
                  : Text("${appointment.name}"),
            ),
            const SizedBox(width: 80),
            InkWell(
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => ChatScreen(receiver: appointment)));
              },
              child: const Icon(Icons.message),
            ),
            const SizedBox(width: 13),
            userProvider.user.type == UserType.DOCTOR
                ? InkWell(
                    onTap: () async {
                      print("Video call tapped");
                      final userProvider =
                          Provider.of<UserProvider>(context, listen: false);
                      final url = Uri.parse(
                          '$uri/telemedicine_api/set_start_consultation_request');
                      final response = await http.post(url,
                          headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': userProvider.user.token
                          },
                          body: json.encode({
                            "chat_id": appointment.id,
                            "start_consultation_request": true,
                          }));
                      final responseData = json.decode(response.body);
                      print(responseData);
                      // Add logic to handle video calling
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) =>
                              VideoCallPage(callID: appointment.id)));
                    },
                    child: const Icon(Icons.video_call),
                  )
                : InkWell(
                    child: Text(
                        "${appointment.serialNumber == -1 ? "X" : appointment.serialNumber}"),
                  ),
          ],
        ),
        subtitle: Row(
          children: [
            Text(appointment.id),
            // Text(appointment.appointmentTime),
          ],
        ),
      ),
    );
  }
}
