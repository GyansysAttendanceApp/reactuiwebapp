import dayjs from 'dayjs';

export const formatDateWithTime = (value) => {
  if (value) {
    const dateObj = new Date(value);
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    return formattedDate;
  } else {
    return '';
  }
};

export const formatDateWithoutTime = (value) => {
  if (value) {
    return dayjs(value).format('DD-MM-YYYY');
  } else {
    return '';
  }
};

export const weekdaysTypeAccordingToDate = (IsWeekDay, IsHoliday) => {
  return IsWeekDay ? (IsHoliday ? 'Holiday' : 'Workday') : 'Weekend';
};

export const trimString = (value, sliceLength = 4) => {
  if (value) {
    const text = value.slice(value.length - sliceLength, value.length);
    return text;
  } else {
    return value;
  }
};

export const generateMonthDates = (year, month) => {
  const date = new Date(year, month - 1, 1);
  const dates = [];
  console.log(dates);

  const lastDay = new Date(year, month, 0).getDate();

  for (let i = 1; i <= lastDay; i++) {
    date.setDate(i);
    dates.push(dayjs(new Date(dates)).format('DD-MMM'));
  }

  return dates;
};
