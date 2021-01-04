import { mStyles } from './common';
import { getConnectionStatusString, useServerState } from './State';
import { colorAlpha, humanFileSize } from '../utils';
import {
  ArrowUpwardIcon,
  ArrowDownwardIcon,
  GrainIcon,
  StorageIcon,
  WifiIcon,
  WifiOffIcon,
} from './materialUiIcons';
import { FormattedMessage } from 'react-intl';

const useStyles = mStyles(({ spacing }) => ({
  footerRoot: {
    minHeight: 34,
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    borderTop: `1px solid transparent`,
    borderTopColor: colorAlpha('#000', 0.02).string(),
    zIndex: 10,
    padding: spacing(1),

    '&::before': {
      top: 0,
      left: 0,
      width: '100%',
      height: 1,
      display: 'block',
      content: '""',
      position: 'absolute',
      backgroundColor: '#fff',
    },
  },
  footerContainer: {
    flex: '0 0 100%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& > div': {
      display: 'flex',
      flex: '0 0 auto',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingLeft: spacing(0.8),
      paddingRight: spacing(0.8),
      '&:not(:first-of-type)': {
        borderLeft: `1px solid ${colorAlpha('#000', 0.1).string()}`,
      },
      '&:not(:last-of-type)': {
        borderRight: `1px solid #fff`,
      },

      '& > span': {
        display: 'flex',
        marginLeft: spacing(0.3),
        marginRight: spacing(0.3),
        flex: '0 0 auto',
        alignItems: 'flex-end',
      },
    },
  },
}));

export const AppStatusBar = () => {
  const classes = useStyles();
  const {
    dht_nodes,
    dl_info_speed,
    dl_rate_limit,
    dl_info_data,
    up_info_speed,
    up_info_data,
    up_rate_limit,
    connection_status,
    free_space_on_disk,
  } = useServerState();
  const isConnected = connection_status == 'connected' || connection_status === 'firewalled';

  return (
    <footer className={classes.footerRoot}>
      <div className={classes.footerContainer}>
        <div className="footer--connection">
          <span>{isConnected ? <WifiIcon fontSize="small" /> : <WifiOffIcon fontSize="small" />}</span>
          <span>{getConnectionStatusString(connection_status)}</span>
        </div>
        {typeof free_space_on_disk === 'number' && (
          <div>
            <span>
              <StorageIcon fontSize="small" />
            </span>
            <span>{humanFileSize(free_space_on_disk)}</span>
            <span>
              <FormattedMessage defaultMessage="free" tagName="small" />
            </span>
          </div>
        )}
        {dht_nodes && (
          <div>
            <span>
              <GrainIcon fontSize="small" />
            </span>
            <span>{dht_nodes}</span>
            <span>
              <FormattedMessage defaultMessage="DHT nodes" tagName="small" />
            </span>
          </div>
        )}
        {typeof dl_info_speed === 'number' && (
          <div className="footer--download">
            <span>
              <ArrowDownwardIcon fontSize="small" />
            </span>
            <span>
              {humanFileSize(dl_info_speed)}
              <small>/s</small>
            </span>
            <span>
              [{humanFileSize(dl_rate_limit)}
              <small>/s</small>]
            </span>
            <span>({humanFileSize(dl_info_data)})</span>
          </div>
        )}
        {typeof up_info_speed == 'number' && (
          <div className="footer--upload">
            <span>
              <ArrowUpwardIcon fontSize="small" />
            </span>
            <span>
              {humanFileSize(up_info_speed)}
              <small>/s</small>
            </span>
            <span>
              [{humanFileSize(up_rate_limit)}
              <small>/s</small>]
            </span>
            <span>({humanFileSize(up_info_data)})</span>
          </div>
        )}
      </div>
    </footer>
  );
};
