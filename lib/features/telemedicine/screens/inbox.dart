import 'dart:convert';

import 'package:amazon_clone_tutorial/constants/global_variables.dart';
import 'package:amazon_clone_tutorial/features/telemedicine/widget/appointment_card.dart';
import 'package:amazon_clone_tutorial/models/appointment.dart';
import 'package:amazon_clone_tutorial/models/user.dart';
import 'package:amazon_clone_tutorial/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

class InboxScreen extends StatefulWidget {
  static const String routeName = "/inbox_screen";
  const InboxScreen({Key? key}) : super(key: key);

  @override
  State<InboxScreen> createState() => _InboxScreenState();
}

class _InboxScreenState extends State<InboxScreen> {
  Future<List<Appointment>> fetchData(BuildContext context) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    // print("token " + );
    // Simulate fetching data from an API or database
    final url = Uri.parse('$uri/telemedicine_api/inbox');
    final response = await http.get(url, headers: {
      'Content-Type': 'application/json',
      'x-auth-token': userProvider.user.token
    });
    final responseData = json.decode(response.body);
    print(responseData);
    if (responseData.runtimeType == List) {
      return List.generate(responseData.length, (index) {
        return Appointment(
          userId: userProvider.user.id == responseData[index]['user_one']["_id"]
              ? responseData[index]['user_two']["_id"]
              : responseData[index]['user_one']["_id"],
          name: userProvider.user.id == responseData[index]['user_one']["_id"]
              ? responseData[index]['user_two']["name"]
              : responseData[index]['user_one']["name"],
          appointmentTime: "2021-09-01T12:00:00.000Z",
          image_url: responseData[index]['user_one']["doctor_data"]
                  ["image_url"] ??
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        );
      });
    }

    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: AppBar(
          flexibleSpace: Container(
            decoration: const BoxDecoration(
              gradient: GlobalVariables.appBarGradient,
            ),
          ),
          title: const Text("All appointments"),
        ),
      ),
      body: FutureBuilder<List<Appointment>>(
        future: fetchData(context),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child:
                  CircularProgressIndicator(), // Show a loading indicator while fetching data
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text("Error: ${snapshot.error}"),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text("No appointments available."),
            );
          } else {
            // Data has been fetched successfully, render the ListView
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                final appointment = snapshot.data![index];
                return AppointmentCard(appointment: appointment);
              },
            );
          }
        },
      ),
    );
  }
}
