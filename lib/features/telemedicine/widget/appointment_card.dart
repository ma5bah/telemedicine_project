import 'package:amazon_clone_tutorial/features/telemedicine/screens/chat_screen.dart';
import 'package:amazon_clone_tutorial/models/appointment.dart';
import 'package:flutter/material.dart';

class AppointmentCard extends StatelessWidget {
  final Appointment appointment;

  const AppointmentCard({Key? key, required this.appointment})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Image.network(appointment.image_url),
        title: Row(
          children: [
            Expanded(
              // Wrap this around the Text widget
              child: Text(appointment.doctorName),
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
            InkWell(
              onTap: () {
                // Add logic to handle calling
              },
              child: const Icon(Icons.call),
            ),
            const SizedBox(width: 13),
            InkWell(
              onTap: () {
                // Add logic to handle video calling
              },
              child: const Icon(Icons.video_call),
            ),
          ],
        ),
        subtitle: Row(
          children: [
            Text(appointment.appointmentTime),
          ],
        ),
      ),
    );
  }
}
