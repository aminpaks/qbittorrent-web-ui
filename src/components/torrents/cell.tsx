import clsx from 'clsx';
import { FC, CSSProperties, useMemo } from 'react';
import { Torrent } from '../../api';
import { cellRenderer } from './renderers';
import { getTableColumn } from './columns';
import { ExtendedTorrentKeys } from './types';
import { useUiState } from '../state';

export const HeaderCell: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
  const column = getTableColumn(index);

  if (!column) {
    return null;
  }

  const { label, align } = column;

  return (
    <div
      className="header--cell"
      style={{ ...style, justifyContent: align === 'right' ? 'flex-end' : undefined }}
    >
      <span style={{ textAlign: align === 'right' ? align : undefined }}>{label}</span>
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
  const isSelected = useMemo(() => torrentListSelection.indexOf(hash) >= 0, [torrentListSelection]);

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
            list: [{ item: data as Torrent, type: 'only' }],
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
