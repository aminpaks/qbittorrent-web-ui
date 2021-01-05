import clsx from 'clsx';
import { CSSProperties, FC, RefObject, useRef } from 'react';
import { Torrent } from '../../api';
import { cellRenderer } from './renderers';
import { getTableColumn } from './columns';
import { CellTargetHandler, ExtendedTorrentKeys } from './types';

export const HeaderCell: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
  const column = getTableColumn(index);

  if (!column) {
    return null;
  }

  const { label, align } = column;

  return (
    <div className="header--cell" style={{ ...style, textAlign: align }}>
      <span>{label}</span>
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
    isSelected: boolean;
    onMenuOpen: CellTargetHandler;
    onSelect: CellTargetHandler;
  }
> = ({ style, rowIndex, columnIndex, dataKey, children, isSelected, onMenuOpen, onSelect, ...props }) => {
  const elRef = (useRef(undefined) as unknown) as RefObject<HTMLDivElement>;
  const data = (props as unknown) as Record<ExtendedTorrentKeys, unknown>;
  const dataValue = dataKey != null ? data[dataKey] : undefined;

  return (
    <div
      ref={elRef}
      className={clsx('body--cell', rowIndex % 2 === 0 ? 'even' : 'odd', {
        selected: isSelected,
      })}
      style={style}
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();

        const { currentTarget } = event;

        onSelect(currentTarget, 'select');
      }}
      onContextMenu={event => {
        event.preventDefault();
        event.stopPropagation();

        const { currentTarget } = event;

        onSelect(currentTarget, 'context');
        onMenuOpen(currentTarget, 'context');
      }}
      data-row-index={rowIndex}
      data-torrent-hash={data.hash}
    >
      {cellRenderer(dataKey, dataValue, data)}
    </div>
  );
};
