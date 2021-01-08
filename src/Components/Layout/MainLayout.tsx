import { FC, ReactElement } from 'react';
import AppHeader from '../header';
import { AppStatusBar } from '../AppStatusBar';
import { mStyles } from '../common';
import { AppBar } from '../materialUiCore';

const useStyles = mStyles(({ spacing }) => ({
  mainLayoutRoot: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mainLayoutContainer: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    flexDirection: 'column',
    padding: spacing(2),
    paddingBottom: 0,
  },
  appBarContainer: {
    padding: spacing(2),
  },
}));

export const MainLayout: FC<{
  header?: ReactElement;
  statusBar?: ReactElement;
  qbtVersion: string;
}> = ({ header, statusBar, qbtVersion, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainLayoutRoot}>
      <AppBar position="static">{header || <AppHeader qbtVersion={qbtVersion} />}</AppBar>
      <div className={classes.mainLayoutContainer}>{children}</div>
      {statusBar || <AppStatusBar />}
    </div>
  );
};
