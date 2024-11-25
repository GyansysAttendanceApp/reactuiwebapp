import { createTheme } from '@mui/material/styles'
import { colors } from '../../colors/Color'

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
    // fontSize: "0.875rem",
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
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 300,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 300,
    },
    button: {
      textTransform: 'none', // Prevent button text from being capitalized
    },
  },

  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       padding: "8px 16px",
    //       borderRadius: 4,
    //       fontWeight: 600,
    //     },
    //   },
    // },

    // MuiInputBase: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 4,
    //       padding: '8px 12px',
    //     },
    //   },
    // },

    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       marginBottom: '16px',
    //     },
    //   },
    // },

    // MuiDatePicker: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#ffffff',
    //       borderRadius: 4,
    //     },
    //   },
    // },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.6rem',
        },
        head: {
          background: '#f0f0f0',
          padding: '0.8rem',
        },
        body: {
          padding: '0.4rem',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1670b9',
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
            color: '#1670b9', // Custom primary color when active
          },
        },
      },
    },
  },
})

export default theme
