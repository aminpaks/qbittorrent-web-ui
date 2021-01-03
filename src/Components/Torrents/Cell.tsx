import { CSSProperties, FC, memo, MouseEventHandler } from 'react';
import { Torrent } from '../../api';
import { cellRenderer } from './renderers';
import { ExtendedTorrentKeys, getTableColumn } from './columns';

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
    index: number;
    dataKey: ExtendedTorrentKeys;
    style: object;
    onAction: MouseEventHandler;
  }
> = memo(({ style, rowIndex, dataKey, children, ...props }) => {
  const data = (props as unknown) as Record<ExtendedTorrentKeys, unknown>;
  const dataValue = dataKey != null ? data[dataKey] : undefined;
  return (
    <div className={'body--cell ' + (rowIndex % 2 === 0 ? 'even' : 'odd')} style={style}>
      {cellRenderer(dataKey, dataValue, data)}
    </div>
  );
});
