import { FC, ReactNode } from 'react';
import { Box, Typography } from './materialUiCore';
import { mStyles } from './common';

const useStyles = mStyles(({ spacing, palette }) => ({
  displayErrorRoot: {
    flex: '0 1 auto',
    margin: `${spacing(2)}px auto`,
    '& header': {
      marginBottom: spacing(1.4),
      paddingBottom: spacing(0.8),
      borderBottom: `1px solid ${palette.grey.A200}`,
    },
  },
  paperRoot: {
    padding: spacing(4),
  },
}));

export const DisplayError: FC<{ title: ReactNode; message?: string }> = ({
  title,
  message,
  children = <Typography variant="body1">{message}</Typography>,
}) => {
  const classes = useStyles();

  return (
    <section className={classes.displayErrorRoot}>
      <Box marginBottom={2} paddingBottom={2.2} component="header">
        <Typography color="error" variant="h5" component="h2">
          {title}
        </Typography>
      </Box>
      <article>{children}</article>
    </section>
  );
};
