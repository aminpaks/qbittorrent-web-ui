import { TableColumn } from './types';

export const tableColumns: TableColumn[] = [
  { label: '#', dataKey: 'index', width: 40, align: 'right' },
  { label: 'Name', dataKey: 'name', width: 460 },
  { label: 'Ratio', dataKey: 'ratio', width: 50, align: 'right' },
  { label: 'Progress', dataKey: 'progress', width: 120 },
  { label: 'Status', dataKey: 'state', width: 140 },
  { label: 'Size', dataKey: 'size', width: 80, align: 'right' },
  { label: 'Seeds', dataKey: 'num_seeds', width: 80, align: 'right' },
  { label: 'Peers', dataKey: 'num_leechs', width: 80, align: 'right' },
  { label: 'Total Size', dataKey: 'total_size', width: 100, align: 'right' },
  { label: 'Downloaded', dataKey: 'downloaded', width: 100, align: 'right' },
  { label: 'Uploaded', dataKey: 'uploaded', width: 100, align: 'right' },
  { label: 'S Download', dataKey: 'downloaded_session', width: 100, align: 'right' },
  { label: 'S Upload', dataKey: 'uploaded_session', width: 100, align: 'right' },
  { label: 'Down Speed', dataKey: 'dlspeed', width: 100, align: 'right' },
  { label: 'Up Speed', dataKey: 'upspeed', width: 100, align: 'right' },
  { label: 'Down Limit', dataKey: 'dl_limit', width: 100, align: 'right' },
  { label: 'Up Limit', dataKey: 'up_limit', width: 100, align: 'right' },
  { label: 'Added On', dataKey: 'added_on', width: 180 },
  { label: '', dataKey: 'action', width: 40 },
];

export const getTableColumn = (index: number): TableColumn | null =>
  index >= 0 && index < tableColumns.length ? tableColumns[index] : null;

export const getColumnWidth: (p: { index: number }) => number = ({ index }) => {
  switch (index) {
    default:
      return tableColumns[index]?.width ?? 40;
  }
};

export const isFirstCell = (index: number) => index === 0;
export const isLastCell = (index: number) => index === tableColumns.length - 1;
