import { FC } from 'react';
import pink from '@material-ui/core/colors/pink';
import indigo from '@material-ui/core/colors/indigo';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';

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
    MuiButton: {
      outlinedPrimary: indigo,
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          cursor: 'default',
          userSelect: 'none',
          '-webkit-font-smoothing': 'antialiased',
          '-webkit-touch-callout': 'none !important',
        },
        'body .MuiFormControl-root': {
          margin: 8,
        },
        'html,body': {
          height: 'var(--height)',
          overflow: 'hidden',
          '-webkit-overflow-scrolling': 'touch',
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
