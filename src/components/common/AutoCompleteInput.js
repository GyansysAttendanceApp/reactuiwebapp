import { Autocomplete, Box, Button, TextField } from '@mui/material';
import React from 'react';
import constraints from '../../constraints';

const AutoCompleteInput = ({query,setQuery,suggestions,handleSearch,handleFetchHistory,handleReset}) => {
  return (
    <Box display={'flex'} gap={2} alignItems={'center'} maxHeight='6.010016694490818vh' >

    <Box display={'flex'} flexGrow={1}>
      <Autocomplete
        fullWidth
        value={query}
        onChange={(event, value) => setQuery(value || '')}
        inputValue={query}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue || '');
        }}
        options={suggestions}
        renderInput={(params) => (
          <TextField
            {...params}
            label={constraints.DATATABLE.SEARCH.LABEL}
            variant="outlined"
            size="small"
          />
        )}
      />
    </Box>
    <Box display={'flex'} gap={'0.8rem'} alignItems={'center'}>
    <Button variant="contained" onClick={handleSearch}>
      {constraints.DATATABLE.BUTTON.FETCH}
    </Button>
    <Button variant="contained" onClick={handleFetchHistory}>
      {constraints.DATATABLE.BUTTON.FETCH_HISTORY}
    </Button>
    <Button variant="contained" onClick={handleReset}>
      {constraints.DATATABLE.BUTTON.CLEAR}
    </Button>
  </Box>
  </Box>
  );
};

export default AutoCompleteInput;
