import 'package:carecompass/features/telemedicine/screens/chat_screen.dart';
import 'package:carecompass/features/telemedicine/screens/video_call_screen.dart';
import 'package:carecompass/models/appointment.dart';
import 'package:carecompass/models/user.dart';
import 'package:carecompass/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
              child: Text(appointment.name),
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
            userProvider.user.type == UserType.DOCTOR ||
                    appointment.start_consultation_request_by_doctor == true
                ? InkWell(
                    onTap: () {
                      // Add logic to handle video calling

                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) =>
                              VideoCallPage(callID: appointment.id)));
                    },
                    child: const Icon(Icons.video_call),
                  )
                : InkWell(
                    child: Text("${appointment.serialNumber}"),
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
