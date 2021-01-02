import { FC } from 'react';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import pink from '@material-ui/core/colors/pink';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    fontSize: 12,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          cursor: 'default',
        },
        'body .MuiFormControl-root': {
          margin: 8,
        },
      },
    },
  },
});

export const ThemeProvider: FC = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
