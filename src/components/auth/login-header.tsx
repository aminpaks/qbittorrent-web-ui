import { mStyles } from '../common';
import { Typography } from '../material-ui-core';

const useStyles = mStyles(({ spacing }) => ({
  loginHeaderRoot: {
    padding: spacing(2),
  },
}));

export const LoginHeader = () => {
  const classes = useStyles();

  return (
    <div className={classes.loginHeaderRoot}>
      <Typography variant="body1" component="h1">
        qBittorrent
      </Typography>
    </div>
  );
};
