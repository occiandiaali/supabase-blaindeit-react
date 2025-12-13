export default function addMinutes(time, minutesToAdd) {
  let [hours, minutes] = time.split(":").map(Number);
  minutes += minutesToAdd;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

//console.log(addMinutes("17:00", 10)); // Outputs: "17:10"
