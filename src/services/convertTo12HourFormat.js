function convertTo12HourFormat(time24) {
  const [hours, minutes, seconds] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert '0' or '12' hours to '12'
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  const time12 = `${hours12}:${paddedMinutes} ${period}`;
  return time12;
}

export default convertTo12HourFormat;
