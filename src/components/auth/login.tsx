import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '../material-ui-core';
import { LockOpenIcon } from '../material-ui-icons';
import { mStyles } from '../common';
import { AppHeader } from '../header/app-header';
import { MainLayout } from '../layout';
import { useAppVersionQuery, useLoginMutation } from '../data';
import { storageGet, storageRemove, storageSet } from '../../utils';
import { useNotifications } from '../notifications';
import { getErrorMessage } from '../../api';
import { WEB_UI_VERSION } from '../../constant';

const LOGIN_USERNAME = 'loginUsername';
const LOGIN_PASSWORD = 'loginPassword';
const LOGIN_REMEMBER_ME = 'loginRememberMe';

const useStyles = mStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  loginRoot: {
    display: 'block',
    flex: '0 0 auto',
    paddingTop: '14vh',
  },
}));

export const Login: FC = () => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { create } = useNotifications();
  const [isRememberMe, setRememberMe] = useState(storageGet(LOGIN_REMEMBER_ME, false));
  const [state, setState] = useState({
    username: isRememberMe ? storageGet(LOGIN_USERNAME, '') : '',
    password: isRememberMe ? atob(storageGet(LOGIN_PASSWORD, '')) : '',
  });
  const classes = useStyles();

  const { username, password } = state;
  const { data: appVersion } = useAppVersionQuery();
  const { mutate: tryLogin, isLoading, isSuccess } = useLoginMutation({
    onError: error => {
      create({
        message: formatMessage(
          { defaultMessage: `Login failed, {reason}` },
          { reason: getErrorMessage(error) }
        ),
        severity: 'error',
      });
    },
  });

  const handleLogin = () => tryLogin(state);
  const handleKeyPress = ({ code }: { code: string }) => {
    if (code === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    if (isSuccess || appVersion) {
      // Authorization is valid
      history.push('/');
    }
  }, [isSuccess, appVersion]);

  return (
    <MainLayout header={<AppHeader qbtVersion="" />} qbtVersion="" className={classes.container}>
      <section className={classes.loginRoot}>
        <Box marginBottom={2} component="header">
          <Typography variant="h4" component="h1">
            <FormattedMessage defaultMessage="Authentication" />
          </Typography>
        </Box>

        <article>
          <TextField
            label={<FormattedMessage defaultMessage="Username" />}
            value={username}
            onKeyPress={handleKeyPress}
            onChange={({ target }) =>
              setState({
                username: isRememberMe ? storageSet(LOGIN_USERNAME, target.value) : target.value,
                password,
              })
            }
          />
          <TextField
            label={<FormattedMessage defaultMessage="Password" />}
            value={password}
            type="password"
            onKeyPress={handleKeyPress}
            onChange={({ target }) =>
              setState({
                username,
                password: isRememberMe
                  ? (storageSet(LOGIN_PASSWORD, btoa(target.value)), target.value)
                  : target.value,
              })
            }
          />
          <Button
            color="primary"
            variant="contained"
            disabled={!(username && password) || isLoading}
            endIcon={isLoading ? <CircularProgress size={16} /> : <LockOpenIcon />}
            onClick={handleLogin}
          >
            <FormattedMessage defaultMessage="Login" />
          </Button>

          <Box>
            <FormControlLabel
              label={<FormattedMessage defaultMessage="Remember me" />}
              control={
                <Checkbox
                  color="primary"
                  checked={isRememberMe}
                  onChange={({ target }) => {
                    const value = target.checked;
                    if (value === false) {
                      storageRemove(LOGIN_USERNAME);
                      storageRemove(LOGIN_PASSWORD);
                    } else {
                      storageSet(LOGIN_USERNAME, username);
                      storageSet(LOGIN_PASSWORD, btoa(password));
                    }
                    setRememberMe(storageSet(LOGIN_REMEMBER_ME, target.checked));
                  }}
                />
              }
            />
          </Box>
        </article>
      </section>
    </MainLayout>
  );
};
