class Appointment {
  final String userId;
  final String doctorName;
  final String appointmentTime;
  final String image_url;

  Appointment({
    required this.userId,
    required this.doctorName,
    required this.appointmentTime,
    this.image_url = 'https://picsum.photos/250?image=9',
  });
}
