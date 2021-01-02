import { FC, ReactElement } from 'react';
import { mStyles } from '../common';
import { AppBar, Typography } from '../materialUiCore';

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

const DefaultHeader: FC<{ className: string; qbtVersion: string }> = ({
  className,
  qbtVersion,
}) => {
  return (
    <div className={className}>
      <Typography variant="body1">qBittorrent {qbtVersion}</Typography>
    </div>
  );
};

export const MainLayout: FC<{
  header?: ReactElement;
  qbtVersion: string;
  variant?: 'full' | 'compact';
}> = ({ header, qbtVersion, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainLayoutRoot}>
      <AppBar position="static">
        {header || <DefaultHeader className={classes.appBarContainer} qbtVersion={qbtVersion} />}
      </AppBar>
      <div className={classes.mainLayoutContainer}>{children}</div>
    </div>
  );
};
