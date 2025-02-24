function convertTimeToJktZone(time) {
  const now = new Date(); // Get current date
  const [hours, minutes] = time.split(':').map(Number); // Parse time input
  now.setUTCHours(hours - 7, minutes, 0, 0); // Adjust for Jakarta timezone (UTC+7)
  return now.toISOString(); // Return ISO string
}

function convertTimeToISO(time) {
  const today = new Date().toISOString().split('T')[0]; // Mengambil tanggal hari ini dalam format YYYY-MM-DD
  return `${today}T${time}:00.000Z`; // Menggabungkan dengan waktu, tambahkan detik dan milidetik
}

function formatTime(val) {
  var date = new Date(val);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculateTimeDifference(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  let differenceInMinutes = endTotalMinutes - startTotalMinutes;

  if (differenceInMinutes < 0) {
    differenceInMinutes += 24 * 60; // 24 jam dalam menit
  }

  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  return { hours, minutes };
}

export {
  convertTimeToJktZone,
  convertTimeToISO,
  formatTime,
  calculateTimeDifference,
};
