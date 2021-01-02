import { AutoSizer } from 'react-virtualized';
import { Table, Column, TableCellProps } from 'react-virtualized';
import { colorAlpha, humanFileSize } from '../../utils';
import { DayJs, mStyles } from '../common';
import { useTorrentsState } from '../State';
import { getTorrentStateIcon, getTorrentStateString } from './utils';

const useStyles = mStyles(({ typography, palette, spacing }) => ({
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      borderTop: 'none',
      borderRightWidth: 1,
      fontWeight: typography.fontWeightBold,
    },
    '& .ReactVirtualized__Table__Grid': {
      outline: 'none',
    },
    '& .ReactVirtualized__Table__rowColumn, & .ReactVirtualized__Table__headerColumn': {
      padding: spacing(1),
    },
    '& .MuiSvgIcon-root': {
      verticalAlign: 'text-bottom',
    },
  },
  tableHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${palette.divider}`,
    '&:nth-child(even)': {
      backgroundColor: colorAlpha(palette.common.black, 0.03).string(),
    },
    '&:not(:first-of-type)': {},
  },
}));

const addedOnRenderer = ({ cellData }: TableCellProps) => DayJs(cellData * 1000).format('YYYY-MM-DD HH:mm A');
const ratioRenderer = ({ cellData }: TableCellProps) => cellData.toFixed(2);
const stateRenderer = ({ cellData }: TableCellProps) => (
  <>
    {getTorrentStateIcon(cellData)} <span>{getTorrentStateString(cellData)}</span>
  </>
);
const sizeRenderer = ({ cellData }: TableCellProps) => humanFileSize(cellData);

export const TorrentsContainer = () => {
  const classes = useStyles();
  const torrents = useTorrentsState();
  const torrentList = Object.values(torrents);

  return (
    <AutoSizer>
      {({ width, height }) => (
        <>
          <Table
            width={width}
            height={height}
            headerHeight={40}
            rowHeight={32}
            rowCount={torrentList.length}
            rowGetter={({ index }) => torrentList[index]}
            className={classes.table}
            rowClassName={classes.tableHeaderRow}
          >
            <Column width={60} label="#" dataKey="index" />
            <Column width={400} label="Name" dataKey="name" />
            <Column width={50} label="Ratio" dataKey="ratio" cellRenderer={ratioRenderer} />
            <Column width={100} label="Status" dataKey="state" cellRenderer={stateRenderer} />
            <Column width={120} label="Size" dataKey="size" cellRenderer={sizeRenderer} />
            <Column width={180} label="Added On" dataKey="added_on" cellRenderer={addedOnRenderer} />
          </Table>
        </>
      )}
    </AutoSizer>
  );
};
