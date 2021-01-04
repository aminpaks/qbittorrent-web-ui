import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '../materialUiCore';
import { LockOpenIcon } from '../materialUiIcons';
import { mStyles } from '../common';
import { AppHeader } from '../AppHeader';
import { MainLayout } from '../Layout';
import { DisplayApiError } from '../DisplayApiError';
import { useAppVersionQuery, useLoginMutation } from '../Data';
import { storageGet, storageRemove, storageSet } from '../../utils';
import { FormattedMessage } from 'react-intl';

const LOGIN_USERNAME = 'loginUsername';
const LOGIN_PASSWORD = 'loginPassword';
const LOGIN_REMEMBER_ME = 'loginRememberMe';

const useStyles = mStyles(({ spacing }) => ({
  loginRoot: {
    display: 'block',
    flex: '0 0 auto',
    paddingTop: '14vh',
  },
}));

export const Login: FC = () => {
  const history = useHistory();
  const [isRememberMe, setRememberMe] = useState(storageGet(LOGIN_REMEMBER_ME, false));
  const [state, setState] = useState({
    username: isRememberMe ? storageGet(LOGIN_USERNAME, '') : '',
    password: isRememberMe ? atob(storageGet(LOGIN_PASSWORD, '')) : '',
  });
  const classes = useStyles();

  const { username, password } = state;
  const { data: appVersion } = useAppVersionQuery();
  const { mutate: tryLogin, error, isLoading, isError, isSuccess } = useLoginMutation(() => {
    history.push('/');
  });

  const handleLogin = () => tryLogin(state);
  const handleKeyPress = ({ code }: { code: string }) => {
    if (code === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    if (appVersion) {
      console.log('application version', appVersion);
    }
  }, [isSuccess]);

  return (
    <MainLayout header={<AppHeader qbtVersion="" />} qbtVersion="">
      <section className={classes.loginRoot}>
        <Box marginBottom={2} component="header">
          <Typography variant="h4" component="h1">
            <FormattedMessage defaultMessage="Authentication" />
          </Typography>
        </Box>

        <DisplayApiError error={error} />

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
            endIcon={isLoading ? <CircularProgress /> : <LockOpenIcon />}
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
