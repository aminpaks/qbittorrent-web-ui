import { useNotificationsState, useDispatchNotification } from './context';
import { Snackbar, Alert } from '../material-ui-core';
import { mStyles } from '../common';
import { useEffect } from 'react';

const useStyles = mStyles(() => ({
  containerRoot: {
    left: 0,
    bottom: 30,
    width: '100%',
    position: 'fixed',
    zIndex: 999,

    '& .custom--snackbar': {
      position: 'absolute',
      transition: '300ms ease-in-out bottom',
    },
  },
}));

export const Notifications = () => {
  const classes = useStyles();
  const { queue } = useNotificationsState();
  const { remove, cleanup } = useDispatchNotification();

  useEffect(() => {
    // Clean up
    const timerIds = queue.map(({ id, state }) => {
      if (state === 'remove') {
        return window.setTimeout(() => {
          cleanup({ id });
        }, 600);
      }
      return -1;
    });
    // Delay the clean up till next render
    return () => {
      timerIds.forEach(id => window.clearTimeout(id));
    };
  }, [queue]);

  return (
    <div className={classes.containerRoot}>
      {queue.map(({ id, message, state, severity }, index) => (
        <Snackbar
          key={id}
          className="custom--snackbar"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={state === 'idle'}
          autoHideDuration={severity === 'info' ? 8000 : null}
          onClose={event => {
            if (event === null) {
              remove({ id });
            }
          }}
          style={{ bottom: index * 64 }}
        >
          <Alert
            onClose={() => {
              remove({ id });
            }}
            elevation={6}
            variant="filled"
            severity={severity}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};
