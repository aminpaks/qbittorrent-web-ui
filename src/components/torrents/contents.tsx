import { mStyles } from '../common';
import { useTorrentContents } from '../data/torrent-contents';
import { useUiState } from '../state';

const useStyles = mStyles(({ breakpoints }) => ({
  rootContainer: {},
  content: {
    width: '100%',
    maxHeight: '50px',
    overflow: 'auto',
    [breakpoints.down('sm')]: {
      background: 'red',
    },
  },
  table: {
    maxWidth: '200%',
    '& td': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      overflowText: 'eclipse',
    },
  },
}));

export const TorrentContents = () => {
  const classes = useStyles();
  const [{ torrentListSelection }] = useUiState();

  const [firstSelection] = torrentListSelection;

  const { data } = useTorrentContents(firstSelection);

  return (
    <div className={classes.rootContainer}>
      Contents --
      {!data ? (
        <div>Loading...</div>
      ) : (
        <div className={classes.content}>
          {data.length > 0 ? (
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Progress</th>
                  <th>Download Priority</th>
                  <th>Remaining</th>
                  <th>Availability</th>
                </tr>
              </thead>
              {data?.map((file, idx) => (
                <tr key={idx}>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>{file.progress}</td>
                  <td>{file.priority}</td>
                  <td>{JSON.stringify(file.piece_range)}</td>
                  <td>{file.availability}</td>
                </tr>
              ))}
            </table>
          ) : (
            <div>EMPTY</div>
          )}
        </div>
      )}
    </div>
  );
};
