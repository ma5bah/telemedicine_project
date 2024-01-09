import 'package:flutter/material.dart';

class DoctorDetailsScreen extends StatefulWidget {
  final String name;
  final String picture;
  final String degree;
  final String speciality;
  final String designation;
  final String workplace;

  const DoctorDetailsScreen(
      {Key? key,
      required this.name,
      required this.picture,
      required this.degree,
      required this.speciality,
      required this.designation,
      required this.workplace})
      : super(key: key);
  @override
  State<DoctorDetailsScreen> createState() => _DoctorDetailsScreenState();
}

class _DoctorDetailsScreenState extends State<DoctorDetailsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          // mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 20),
            Align(
              alignment: Alignment.center,
              child: CircleAvatar(
                radius: 50,
                backgroundImage: NetworkImage(
                  widget.picture,
                ), // Replace with actual image
              ),
            ),
            const SizedBox(height: 20),
            Text(widget.name,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text(widget.degree,
                style: const TextStyle(fontSize: 18, color: Colors.grey)),
            const SizedBox(height: 10),

            Align(
                alignment: Alignment.center,
                child: Text(widget.speciality,
                    style: const TextStyle(fontSize: 20))),
            const SizedBox(height: 20),

            Text(widget.designation,
                style: const TextStyle(fontSize: 18, color: Colors.grey)),
            //  SizedBox(height: 10),

            Align(
              alignment: Alignment.topCenter,
              child: Text(widget.workplace,
                  style: const TextStyle(fontSize: 18, color: Colors.grey)),
            ),

            const SizedBox(height: 100),
            ElevatedButton(
              onPressed: () {
                print('Book Appointment');
                // @TODO: Add booking appointment logic

                // Add booking appointment logic
                // Navigator.of(context).push(MaterialPageRoute(
                //     builder: (context) => AppointmentTakingScreen()));
              },
              style: ElevatedButton.styleFrom(
                primary: Colors.blue,
                padding:
                    const EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                textStyle: const TextStyle(fontSize: 20),
              ),
              child: const Text('Book Appointment',
                  style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }
}
