import { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';
import { TableHeaderProps } from 'react-virtualized';
import { DayJs } from '../common';
import { IconButton, LinearProgress, Menu, MenuItem } from '../materialUiCore';
import { MoreVertIcon } from '../materialUiIcons';
import { getTorrentStateIcon, getTorrentStateString } from './utils';
import { formatPercentage, humanFileSize } from '../../utils';
import { Torrent, TorrentState } from '../../api';
import { ExtendedTorrentKeys } from './columns';

const DivBox: FC<CSSProperties> = ({
  textAlign,
  display,
  alignItems,
  flex,
  flexBasis,
  paddingLeft,
  children,
}) => {
  return <div style={{ display, textAlign, flex, flexBasis, alignItems, paddingLeft }}>{children}</div>;
};

export const dateCellRenderer = (value: number) => DayJs(value * 1000).format('YYYY-MM-DD HH:mm A');
export const ratioCellRenderer = (value: number) => <DivBox textAlign="right">{value.toFixed(2)}</DivBox>;
export const statusCellRenderer = (value: TorrentState) => (
  <>
    {getTorrentStateIcon(value)} <span>{getTorrentStateString(value)}</span>
  </>
);
export const sizeCellRenderer = (value: number = 0) => (
  <div style={{ textAlign: 'right' }}>{humanFileSize(value)}</div>
);
export const speedCellRenderer = (value: number = 0) => (
  <DivBox textAlign="right">
    {value <= 0 ? (
      'Unlimited'
    ) : (
      <>
        {humanFileSize(value)}
        <small>/s</small>
      </>
    )}
  </DivBox>
);
export const progressCellRenderer = (value: number) => (
  <DivBox display="flex" alignItems="center" flexBasis="100%">
    <DivBox flex="1 1 50%">
      <LinearProgress variant="determinate" value={value * 100} />
    </DivBox>
    <DivBox flex="0 0 auto" paddingLeft={4}>
      {formatPercentage(value * 100)}%
    </DivBox>
  </DivBox>
);
export const seedPeersCellRenderer = (value: number = 0, total: number = 0) => (
  <DivBox textAlign="right">
    {value}
    {total > 0 && <small>({total})</small>}
  </DivBox>
);

const ActionMore: FC<{ hash: string; onClick: MouseEventHandler }> = ({ hash, onClick }) => {
  return (
    <IconButton aria-label="More" size="small" onClick={onClick} data-hash={hash}>
      <MoreVertIcon fontSize="small" color="inherit" />
    </IconButton>
  );
};
export const actionCellRenderer = (value: any) => {
  const { hash, onClick } = value;
  return <ActionMore hash={hash} onClick={onClick} />;
};

export const rightAlignHeaderRenderer = ({ label }: TableHeaderProps) => (
  <DivBox textAlign="right">{label}</DivBox>
);

const defaultRenderer = (value: unknown, style: CSSProperties = {}): ReactNode => (
  <DivBox {...style}>{value != null ? String(value) : null}</DivBox>
);

export const cellRenderer = (
  key: ExtendedTorrentKeys,
  value: unknown,
  data: Record<ExtendedTorrentKeys, unknown>
): ReactNode => {
  switch (key) {
    case 'invalid':
      return 'INVALID!';
    case 'index':
      return defaultRenderer(value, { textAlign: 'right' });
    case 'ratio':
      return ratioCellRenderer(value as number);
    case 'state':
      return statusCellRenderer(value as TorrentState);
    case 'size':
    case 'total_size':
    case 'downloaded':
    case 'uploaded':
    case 'downloaded_session':
    case 'uploaded_session':
      return sizeCellRenderer(value as number);
    case 'progress':
      return progressCellRenderer(value as number);
    case 'num_seeds':
    case 'num_leechs':
      return seedPeersCellRenderer(
        value as number,
        key === 'num_seeds' ? (data['num_complete'] as number) : (data['num_incomplete'] as number)
      );
    case 'added_on':
      return dateCellRenderer(value as number);
    case 'upspeed':
    case 'dlspeed':
      return speedCellRenderer(value as number);
    case 'dl_limit':
    case 'up_limit':
      return speedCellRenderer(value as number);
    default:
      return defaultRenderer(value);
  }
};
