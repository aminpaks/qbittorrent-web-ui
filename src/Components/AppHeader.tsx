import { FC } from 'react';
import { useIntl } from 'react-intl';
import { mStyles } from './common';
import { Typography, Grid, Box } from './materialUiCore';

const useHeaderStyles = mStyles(({ spacing, palette }) => ({
  headerRoot: {
    '& .MuiGrid-item': {
      display: 'flex',
      '& > *': {
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center',
      },
    },
  },
  columnRight: {
    justifyContent: 'flex-end',
  },
}));

export const AppHeader: FC<{ qbtVersion: string }> = ({ qbtVersion }) => {
  const classes = useHeaderStyles();
  const intl = useIntl();

  return (
    <Box className={classes.headerRoot} padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="body1">qBittorrent {qbtVersion}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.columnRight}>
          <Box>Language: {intl.locale}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};
