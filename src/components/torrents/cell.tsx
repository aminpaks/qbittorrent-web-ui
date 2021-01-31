import clsx from 'clsx';
import { FC, CSSProperties } from 'react';
import { Torrent } from '../../api';
import { cellRenderer } from './renderers';
import { getTableColumn } from './columns';
import { ExtendedTorrentKeys } from './types';
import { useTorrentSortFilterState, useUiState } from '../state';
import { ArrowDropDownIcon } from '../material-ui-icons';

export const HeaderCell: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
  const [{ column: sortedBy, asc: isSortingAsc }, updateSortFilter] = useTorrentSortFilterState();
  const column = getTableColumn(index);

  if (!column) {
    return null;
  }

  const { label, align, dataKey } = column;
  const isSortedBy = dataKey === sortedBy;

  return (
    <div
      className={clsx('header--cell', {
        'right-align': align === 'right',
      })}
      style={style}
      onClick={() => {
        if (dataKey !== 'action' && dataKey !== 'invalid') {
          let column = dataKey;
          if (dataKey === 'num_seeds') {
            column = 'num_complete';
          } else if (dataKey === 'num_leechs') {
            column = 'num_incomplete';
          }
          updateSortFilter({ column });
        }
      }}
    >
      <span>{label}</span>
      <span className={clsx({ 'sorted-by': isSortedBy, 'sorting-desc': isSortedBy && !isSortingAsc })}>
        <ArrowDropDownIcon fontSize="small" />
      </span>
    </div>
  );
};

export const BodyCell: FC<
  Partial<Torrent> & {
    hash?: string;
    rowIndex: number;
    columnIndex: number;
    index: number;
    dataKey: ExtendedTorrentKeys;
    style: object;
  }
> = ({ style, rowIndex, columnIndex, dataKey, children, ...props }) => {
  const [{ torrentListSelection }, { updateContextMenuIsOpen, updateTorrentSelectionList }] = useUiState();
  const data = (props as unknown) as Record<ExtendedTorrentKeys, unknown>;
  const dataValue = dataKey != null ? data[dataKey] : undefined;
  const hash = data.hash as string;
  const isSelected = torrentListSelection.indexOf(hash) >= 0;

  return data.hash ? (
    <div
      className={clsx('body--cell', rowIndex % 2 === 0 ? 'even' : 'odd', {
        selected: isSelected,
      })}
      style={style}
      onContextMenu={event => {
        event.preventDefault();
        event.stopPropagation();

        // Update if the current item is not in the selection
        if (torrentListSelection.indexOf(hash) < 0) {
          updateTorrentSelectionList({
            type: 'only',
            list: [data.hash as string],
          });
        }
        updateContextMenuIsOpen({ value: true });
      }}
      data-row-index={rowIndex}
      data-torrent-hash={data.hash}
    >
      {cellRenderer(dataKey, dataValue, data)}
    </div>
  ) : null;
};
