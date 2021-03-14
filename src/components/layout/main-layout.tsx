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
  const [height, setHeight] = useState(0);
  const classes = useStyles({ height });

  useWindowResize(({ height }) => {
    setHeight(height);
    console.log({ height });
  });

  return (
    <div className={classes.mainLayoutRoot} style={{ '--height': `${height}px` } as any}>
      <AppBar position="static">{header || <AppHeader qbtVersion={qbtVersion} />}</AppBar>
      <div className={classes.mainLayoutContainer}>
        {sideBar}
        <div className={clsx(classes.appChildren, className)}>{children}</div>
      </div>
      {statusBar || <AppStatusBar />}
    </div>
  );
};
