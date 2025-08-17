// utils/timeUtils.js
export const intervalToMilliseconds = (interval) => {
  if (!interval) return 0;
  
  // Разбираем строку формата "HH:MM:SS.sss"
  const [hours, minutes, seconds] = interval.split(':').map(parseFloat);
  
  return (
    (hours * 3600 + 
     minutes * 60 + 
     seconds) * 1000
  );
};

export const secondsToPostgresInterval = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${hours}:${minutes}:${secs}`;
};

export const formatGameTime = (ms) => {
  if (ms === 0 || ms === null || ms === undefined) return '0.000';
  
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || hours > 0) result += `${minutes}m `;
  result += `${seconds}s`;
  
  return result;
};