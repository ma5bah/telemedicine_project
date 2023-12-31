import 'package:amazon_clone_tutorial/features/telemedicine/screens/chat_screen.dart';
import 'package:amazon_clone_tutorial/models/appointment.dart';
import 'package:flutter/material.dart';

class AppointmentCard extends StatelessWidget {
  final Appointment appointment;

  const AppointmentCard({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Text("Doctor image"),
        title: Row(
          children: [
            Text(appointment.doctorName),
            const SizedBox(width: 80),
            InkWell(
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => const ChatScreen()));
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
