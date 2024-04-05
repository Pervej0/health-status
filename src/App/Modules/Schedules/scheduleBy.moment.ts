// import { Schedule } from "@prisma/client";
// import moment from "moment";
// import { TSchedule } from "./schedule.interface";
// import { addHours, addMinutes, format } from "date-fns";

// export const createScheduleDB = async (payload: TSchedule) => {
//   const { startDate, endDate, startTime, endTime } = payload;

//   const openingStartDate = new Date(startDate);
//   const closingEndDate = new Date(startDate);
//   const interval = 30;

//   while (openingStartDate <= closingEndDate) {
//     const startDateTime = new Date(
//       addMinutes(
//         addHours(
//           `${format(openingStartDate, "yyyy-mm-dd")}`,
//           Number(startTime.split(":")[0])
//         ),
//         Number(startTime.split(":")[1])
//       )
//     );

//     const endDateTime = new Date(
//       addMinutes(
//         addHours(
//           `${format(closingEndDate, "yyyy-mm-dd")}`,
//           Number(startTime.split(":")[0])
//         ),
//         Number(endTime.split(":")[1])
//       )
//     );

//     while (startDateTime < endDateTime) {
//       const schedule = {
//         startDateTime: startDateTime,
//         endDateTime: addMinutes(startDateTime, interval),
//       };
//       console.log(schedule, "er");
//       // 2nd loop condition
//       startDateTime.setMinutes(startDateTime.getMinutes() + interval);
//     }
//     // first loop condition
//     openingStartDate.setDate(openingStartDate.getDate() + 1);
//   }
// };
