import { FC, ReactElement } from 'react';
import AppHeader from '../header';
import { AppStatusBar } from '../app-statusbar';
import { mStyles } from '../common';
import { AppBar } from '../material-ui-core';
import clsx from 'clsx';

const useStyles = mStyles(({ spacing, zIndex }) => ({
  mainLayoutRoot: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mainLayoutContainer: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'flex-start',
  },
  appChildren: {
    height: '100%',
    flex: '1 0 auto',
  },
}));

export const MainLayout: FC<{
  header?: ReactElement;
  statusBar?: ReactElement;
  sideBar?: ReactElement;
  qbtVersion: string;
  className?: string;
}> = ({ header, statusBar, sideBar = <div />, qbtVersion, children, className }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainLayoutRoot}>
      <AppBar position="static">{header || <AppHeader qbtVersion={qbtVersion} />}</AppBar>
      <div className={classes.mainLayoutContainer}>
        {sideBar}
        <div className={clsx(classes.appChildren, className)}>{children}</div>
      </div>
      {statusBar || <AppStatusBar />}
    </div>
  );
};
