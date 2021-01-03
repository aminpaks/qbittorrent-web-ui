import { mStyles } from './common';
import { useServerState } from './State';
import { colorAlpha, humanFileSize } from '../utils';
import {
  ArrowUpwardIcon,
  ArrowDownwardIcon,
  GrainIcon,
  StorageIcon,
  WifiIcon,
  WifiOffIcon,
} from './materialUiIcons';

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
  const isInitializing = typeof connection_status !== 'string';
  const isConnected = connection_status === 'connected';

  return (
    <footer className={classes.footerRoot}>
      <div className={classes.footerContainer}>
        <div className="footer--connection">
          <span>{isConnected ? <WifiIcon fontSize="small" /> : <WifiOffIcon fontSize="small" />}</span>
          <span>{isConnected ? 'online' : 'offline'}</span>
        </div>
        <div>
          <span>
            <StorageIcon fontSize="small" />
          </span>
          <span>
            {typeof free_space_on_disk === 'number' ? humanFileSize(free_space_on_disk) : 'computing...'}
          </span>
          <span>
            <small>free</small>
          </span>
        </div>
        <div>
          <span>
            <GrainIcon fontSize="small" />
          </span>
          <span>{dht_nodes}</span>
          <span>
            <small>DHT nodes</small>
          </span>
        </div>
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
      </div>
    </footer>
  );
};
