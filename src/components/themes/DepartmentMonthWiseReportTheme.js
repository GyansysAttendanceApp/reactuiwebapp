import { createTheme } from '@mui/material/styles';
import { colors } from '../../colors/Color';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryColor,
    },
    secondary: {
      main: colors.secondaryColor,
    },
    gray: {
      main: colors.borderColor,
    },
    error: {
      main: colors.errorColor,
    },
    success: {
      main: colors.secondaryColor,
    },
    link: {
      main: colors.linkColor,
      hoverColor: colors.linkHoverColor,
    },

    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: colors.textColor,
      secondary: '#777777',
    },
  },

  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    // fontSize: "0.8rem",
    // fontWeight: 400,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    body3: {
      fontSize: '0.8rem',
      // fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 300,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 300,
    },
    button: {
      textTransform: 'none', // Prevent button text from being capitalized
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 16px',
          // borderRadius: 4,
          // fontWeight: 600,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        // Style the dropdown options
        // popper: {
        //   zIndex: 1300, // Make sure the dropdown has the right zIndex
        // },
        // This targets the individual options in the dropdown
        // listbox: {
        //   padding: 0,
        //   maxHeight: '200px',
        // },
        // Target individual option styles
        option: {
          // padding: '8px 16px',
          fontSize: '0.8rem',
          // fontWeight: 'normal',
          // '&[aria-selected="true"]': {
          //   backgroundColor: '#b3e0ff', // Highlight selected options
          //   fontWeight: 'bold',
          // },
          // '&:hover': {
          //   backgroundColor: '#f0f0f0', // Hover effect
          // },
        },
        noOptions: {
          fontSize: '0.8rem',
          // color: '#888', // Gray color for the "No options" text
          // fontStyle: 'italic', // Italicized font
          // textAlign: 'center', // Center the "No options" text
          // padding: '8px', // Add padding for the message
        },
      },
    },
    MuiInputBase: {
      // styleOverrides: {
      //   root: {
      //     // borderRadius: 4,
      //     // padding: '8px 12px',
      //     fontSize:'0.8rem'

      //   },
      // },
      defaultProps: {
        size: 'small', // Set default size to 'small'
      },
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          //  color:'red',
          padding: '8px 12px',
          // Default padding for 'small' size (you can adjust as needed)
          // padding: '18px',  // Customize the padding here for small size
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '0 8px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // borderRadius: 4,
          padding: '3px 12px',
          fontSize: '0.8rem',
          background: '#ffffff',
        },
        input: {
          padding: '6px 0',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // borderRadius: 4,
          // padding: '3px 12px',
          fontSize: '0.8rem',
          // background:'red'
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          boxSizing: 'border-box',
          height: '100%',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.6rem',
          fontSize: '0.8rem',
        },
        head: {
          background: '#f0f0f0',
          padding: '0.4rem',
          fontSize: '0.7rem',
          fontWeight: 'bold',
        },
        body: {
          padding: '0.35rem',
          fontSize: '0.7rem',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1670b9',
          position: 'sticky',
          top: 0,
          // padding:'1rem !important',
          textTransform: 'capitalize',
        },
      },
    },

    // MuiTableRow: {
    //   styleOverrides: {
    //     root: {
    //       '&:hover': {
    //         backgroundColor: '#f5f5f5', // Light grey hover effect
    //       },
    //     },
    //   },
    // },

    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#1670b9',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          padding: '0',
          minHeight: '37px',
          // backgroundColor: '#f0f0f0',
          borderRadius: '4px 4px 0 0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 5px -1px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: '6px 16px',
          fontSize: '0.875rem',
          fontWeight: 400,
          minHeight: '36px',
          borderRadius: '4px 4px 0 0',
          backgroundColor: '#f0f0f0',
          //  backgroundColor: '#fafafa',
          textTransform: 'none',
          '&.Mui-selected': {
            // color: '#1976d2',
            // backgroundColor:'#1e88e5',
            borderRadius: '4px 4px 0 0',
            backgroundColor: '#e0e0e0',
          },
          // '&:hover': {
          //   color: '#ff4081', // Set hover color for tabs
          // },
        },
      },
    },
    // MuiTabs: {
    //   styleOverrides: {
    //     root: {
    //       padding:0,
    //       backgroundColor: '#f0f0f0',
    //       borderRadius: '4px 4px 0 0',
    //       height:'4vh'
    //     },
    //   },
    // },
    // MuiTab: {
    //   styleOverrides: {
    //     root: {
    //       paddingTop: '0',
    //       paddingBottom:0,
    //       fontSize: '0.875rem',
    //       fontWeight: 'bold',
    //       color:'#000'
    //     },
    //   },
    // },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#5DADE2',
          boxShadow: 'none',
          font: '0.8rem',

          '&:before': {
            display: 'none', // Hide default border line
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          // backgroundColor: '#6200ea',
          minHeight: '37px',
          color: '#fff',
          // padding: '10px 20px',
          // borderRadius: '4px',
          '&.Mui-expanded': {
            minHeight: '37px',

            // body:{
            //   background: '#759bb3c9',

            // }
            // color: '#fff',
            // // padding: '10px 20px',
            // borderRadius: '4px',
            // margin:0,
            // backgroundColor: '#3700b3', // Darker purple when expanded
          },
        },
        content: {
          margin: '0',
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Light gray background for the content area
          padding: '10px 20px',
        },
      },
    },
  },
});

export default theme;
