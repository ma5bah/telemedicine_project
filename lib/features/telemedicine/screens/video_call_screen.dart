// // Flutter imports:
// import 'package:flutter/material.dart';
// import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';

// class CallPage extends StatefulWidget {
//   const CallPage({Key? key}) : super(key: key);

//   @override
//   State<StatefulWidget> createState() => CallPageState();
// }

// class CallPageState extends State<CallPage> {
//   ZegoUIKitPrebuiltCallController? callController;

//   @override
//   void initState() {
//     super.initState();
//     callController = ZegoUIKitPrebuiltCallController();
//   }

//   @override
//   void dispose() {
//     super.dispose();
//     callController = null;
//   }

//   @override
//   Widget build(BuildContext context) {
//     final arguments = (ModalRoute.of(context)?.settings.arguments ??
//         <String, String>{}) as Map<String, String>;
//     final callID = arguments[PageParam.call_id] ?? '';

//     return SafeArea(
//       child: ZegoUIKitPrebuiltCall(
//         appID: 1927057603 /*input your AppID*/,
//         appSign:
//             "7fa1cadba11e4b90312fd8ffe28b8cc88a151b587e7235363b567cbeb62e3404" /*input your AppSign*/,
//         userID: currentUser.id,
//         userName: currentUser.name,
//         callID: callID,
//         controller: callController,
//         config: ZegoUIKitPrebuiltCallConfig.oneOnOneVideoCall()

//           /// support minimizing
//           ..topMenuBarConfig.isVisible = true
//           ..topMenuBarConfig.buttons = [
//             ZegoMenuBarButtonName.minimizingButton,
//             ZegoMenuBarButtonName.showMemberListButton,
//           ]
//           ..avatarBuilder = customAvatarBuilder
//           ..onOnlySelfInRoom = (context) {
//             if (PrebuiltCallMiniOverlayPageState.idle !=
//                 ZegoUIKitPrebuiltCallMiniOverlayMachine().state()) {
//               /// now is minimizing state, not need to navigate, just switch to idle
//               ZegoUIKitPrebuiltCallMiniOverlayMachine().switchToIdle();
//             } else {
//               Navigator.of(context).pop();
//             }
//           },
//       ),
//     );
//   }
// }
