import clsx from 'clsx';
import { CSSProperties, FC, memo, MouseEventHandler } from 'react';
import { Torrent } from '../../api';
import { cellRenderer } from './renderers';
import { getTableColumn } from './columns';
import { CellTargetHandler, ExtendedTorrentKeys } from './types';

export const HeaderCell: FC<{ index: number; style: CSSProperties }> = memo(({ index, style }) => {
  const column = getTableColumn(index);

  if (!column) {
    return null;
  }

  const { label, align } = column;

  if (align) {
    style.textAlign = align;
  }

  return (
    <div className="header--cell" style={style}>
      <span>{label}</span>
    </div>
  );
});

export const BodyCell: FC<
  Partial<Torrent> & {
    hash?: string;
    rowIndex: number;
    columnIndex: number;
    index: number;
    dataKey: ExtendedTorrentKeys;
    style: object;
    isSelected: boolean;
    onAction: MouseEventHandler;
    onMenuOpen: CellTargetHandler;
    onSelect: CellTargetHandler;
  }
> = memo(
  ({
    style,
    rowIndex,
    columnIndex,
    dataKey,
    children,
    isSelected,
    onAction,
    onMenuOpen,
    onSelect,
    ...props
  }) => {
    const data = (props as unknown) as Record<ExtendedTorrentKeys, unknown>;
    const dataValue = dataKey != null ? data[dataKey] : undefined;

    return (
      <div
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
  }
);
