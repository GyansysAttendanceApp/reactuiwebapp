import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Stack } from '@mui/material';

export default function DatePickerValue({ value, onchange, views }) {
  console.log(dayjs(new Date()).format('YYYY-MM-DD'), 'date value');
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
        <Stack sx={{ width: '100%' }}>
          {views && views.length ? (
            <DatePicker
              views={views}
              value={value}
              onChange={(newValue) => onchange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    style: {
                      padding: 0,
                    },
                  }}
                />
              )}
            />
          ) : (
            <DatePicker
              value={value}
              onChange={(newValue) => onchange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    style: {
                      padding: 0,
                    },
                  }}
                />
              )}
            />
          )}
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
}
