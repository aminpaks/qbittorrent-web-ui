import { FC } from 'react';
import { ScrollSync, AutoSizer, Grid } from 'react-virtualized';
import { mStyles } from '../common';
import { colorAlpha } from '../../utils';
import { useTorrentsState, useUiState } from '../state';
import { getTableColumn, getColumnWidth, tableColumns } from './columns';
import { getTorrentOrElse } from './utils';
import { BodyCell, HeaderCell } from './cell';

export const HEADER_CELL_HEIGHT = 44;
export const ROW_CELL_HEIGHT = 32;

const useStyles = mStyles(({ palette, typography }) => ({
  tableRoot: {
    overflow: 'hidden',
  },
  tableHeader: {
    outline: 'none',
    overflow: 'hidden !important',
    fontWeight: typography.fontWeightBold,
    '& .header--cell': {
      display: 'flex',
      alignItems: 'center',
      padding: '1px 6px 0px',
      border: 'none',
      borderBottom: `1px solid ${colorAlpha('#000', 0.03).string()}`,
    },
  },
  tableBody: {
    outline: 'none',
    '& .body--cell': {
      padding: '7px 6px 8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      border: 'none',
      borderTop: `1px solid ${palette.divider}`,
      transition: `130ms ease background-color`,

      '&.even': {
        backgroundColor: colorAlpha(palette.common.black, 0.03).string(),
      },
      '&.selected': {
        backgroundColor: colorAlpha(palette.primary.light, 0.2).string(),
      },

      '& *': {
        pointerEvents: 'none',
      },
    },
    '& .MuiSvgIcon-root': {
      verticalAlign: 'text-bottom',
    },
  },
}));

export const TorrentList: FC = () => {
  const classes = useStyles();
  const { hashList, collection } = useTorrentsState();
  const [{ torrentListSelection }, { updateContextMenuIsOpen }] = useUiState();

  return (
    <ScrollSync>
      {({ onScroll, scrollLeft }) => (
        <AutoSizer>
          {({ width, height }) => (
            <div className={classes.tableRoot} style={{ width, height }}>
              <Grid
                width={width}
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
                width={width}
                height={height - HEADER_CELL_HEIGHT}
                rowCount={hashList.length}
                rowHeight={ROW_CELL_HEIGHT}
                columnCount={tableColumns.length}
                columnWidth={getColumnWidth}
                cellRenderer={({ key, rowIndex, style, columnIndex }) => {
                  const torrent = getTorrentOrElse(rowIndex, hashList, collection);
                  const currentItemHash = torrent.hash || '';
                  const dataKey = getTableColumn(columnIndex)?.dataKey || 'invalid';
                  return (
                    <BodyCell
                      {...torrent}
                      key={key}
                      index={torrent.priority ?? 0}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      style={style}
                      dataKey={dataKey}
                      hash={currentItemHash}
                      onContextMenuOpen={(selection?: string[]) => {
                        const list = (selection || torrentListSelection).map(hash => collection[hash]);
                        updateContextMenuIsOpen({ value: true, list });
                      }}
                    />
                  );
                }}
                overscanRowCount={8}
                overscanColumnCount={3}
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
