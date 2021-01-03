import scrollbarSize from 'dom-helpers/scrollbarSize';
import { FC, MouseEventHandler } from 'react';
import { ScrollSync, AutoSizer, Grid } from 'react-virtualized';
import { mStyles } from '../common';
import { colorAlpha } from '../../utils';
import { useTorrentsState } from '../State';
import { getTableColumn, tableColumns } from './columns';
import { getColumnWidth, getTorrentHash, getTorrentOrElse } from './utils';
import { BodyCell, HeaderCell } from './Cell';

const HEADER_CELL_HEIGHT = 40;
const ROW_CELL_HEIGHT = 32;

const useStyles = mStyles(({ spacing, palette, typography }) => ({
  tableRoot: {
    overflow: 'hidden',
  },
  tableHeader: {
    overflow: 'hidden !important',
    fontWeight: typography.fontWeightBold,
    '& .header--cell': {
      padding: '11px 11px 10px',
      borderBottom: `1px solid ${palette.divider}`,
    },
  },
  tableBody: {
    outline: 'none',
    '& .body--cell': {
      padding: '7px 8px 8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderTop: `1px solid ${palette.divider}`,

      '&.even': {
        backgroundColor: colorAlpha(palette.common.black, 0.03).string(),
      },
    },
    '& .MuiSvgIcon-root': {
      verticalAlign: 'text-bottom',
    },
  },
}));

export const TorrentList: FC<{ onAction: MouseEventHandler }> = ({ onAction }) => {
  const classes = useStyles();
  const { hashList, collection } = useTorrentsState();
  const sbSize = scrollbarSize();

  return (
    <ScrollSync>
      {({ onScroll, scrollLeft }) => (
        <AutoSizer>
          {({ width, height }) => (
            <div className={classes.tableRoot} style={{ width, height }}>
              <Grid
                width={width - sbSize}
                height={HEADER_CELL_HEIGHT}
                rowCount={1}
                rowHeight={HEADER_CELL_HEIGHT}
                columnCount={tableColumns.length}
                columnWidth={getColumnWidth}
                scrollLeft={scrollLeft}
                cellRenderer={({ key, columnIndex, style }) => (
                  <HeaderCell key={key} index={columnIndex} style={style} />
                )}
                className={classes.tableHeader}
              />
              <Grid
                width={width - sbSize}
                height={height - HEADER_CELL_HEIGHT - sbSize}
                rowCount={hashList.length}
                rowHeight={ROW_CELL_HEIGHT}
                columnCount={tableColumns.length}
                columnWidth={getColumnWidth}
                cellRenderer={({ key, rowIndex, style, columnIndex }) => (
                  <BodyCell
                    {...getTorrentOrElse(rowIndex, hashList, collection)}
                    key={key}
                    index={rowIndex + 1}
                    rowIndex={rowIndex}
                    style={style}
                    dataKey={getTableColumn(columnIndex)?.dataKey || 'invalid'}
                    hash={getTorrentHash(rowIndex, hashList)}
                    onAction={onAction}
                  />
                )}
                overscanRowCount={10}
                className={classes.tableBody}
                onScroll={onScroll}
              />
            </div>
          )}
        </AutoSizer>
      )}
    </ScrollSync>
  );
};
