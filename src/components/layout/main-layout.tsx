import clsx from 'clsx';
import { FC, ReactElement, useState } from 'react';
import AppHeader from '../header';
import { AppStatusBar } from '../app-statusbar';
import { mStyles } from '../common';
import { AppBar } from '../material-ui-core';
import { useWindowResize } from '../utils';

const useStyles = mStyles(() => ({
  mainLayoutRoot: {
    width: '100vw',
    height: 'var(--height)',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  mainLayoutContainer: {
    display: 'inline-block',
    flex: '1 0 auto',
    position: 'relative',
  },
  mainLayoutContainerHolder: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    display: 'flex',
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

  useWindowResize(({ height }) => {
    document.body.style.setProperty('--height', `${height}px`);
  });

  return (
    <div className={classes.mainLayoutRoot}>
      <AppBar position="static">{header || <AppHeader qbtVersion={qbtVersion} />}</AppBar>
      <div className={classes.mainLayoutContainer}>
        <div className={classes.mainLayoutContainerHolder}>
          {sideBar}
          <div className={clsx(classes.appChildren, className)}>{children}</div>
        </div>
      </div>
      {statusBar || <AppStatusBar />}
    </div>
  );
};
