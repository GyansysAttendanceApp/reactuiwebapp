import dayjs from 'dayjs';

export const formatDateWithTime = (value) => {
  if (value) {
    return dayjs(value).format('DD-MM-YYYY hh:mm');
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

export const  trimString= (value,sliceLength=4) => {
    if(value){
        const text=value.slice(value.length-sliceLength,value.length);
        return text
    }
   else{
    return value;
   }
  };


