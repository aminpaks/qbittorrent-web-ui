import scrollbarSize from 'dom-helpers/scrollbarSize';
import { FC, useEffect, useState } from 'react';
import { ScrollSync, AutoSizer, Grid } from 'react-virtualized';
import { mStyles } from '../common';
import { colorAlpha } from '../../utils';
import { useTorrentsState } from '../State';
import { getTableColumn, getColumnWidth, tableColumns } from './columns';
import { getRowData, getTorrentHash, getTorrentOrElse } from './utils';
import { BodyCell, HeaderCell } from './Cell';
import { CellTargetHandler } from './types';

const HEADER_CELL_HEIGHT = 44;
const ROW_CELL_HEIGHT = 32;

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

export const TorrentList: FC<{ onMenuOpen: CellTargetHandler }> = ({ onMenuOpen }) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(-1);
  const { hashList, collection } = useTorrentsState();
  const sbSize = scrollbarSize();

  useEffect(() => {
    function handler() {
      setSelectedRow(-1);
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  });

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
                    columnIndex={columnIndex}
                    isSelected={selectedRow === rowIndex}
                    style={style}
                    dataKey={getTableColumn(columnIndex)?.dataKey || 'invalid'}
                    hash={getTorrentHash(rowIndex, hashList)}
                    onMenuOpen={onMenuOpen}
                    onSelect={(element, eventType) => {
                      const { index = -1 } = getRowData(element);
                      setSelectedRow(current => {
                        if (eventType === 'context') {
                          return index;
                        } else {
                          return current === index ? -1 : index;
                        }
                      });
                    }}
                  />
                )}
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
