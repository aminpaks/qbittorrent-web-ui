import { FormattedMessage } from 'react-intl';
import { TableColumn } from './types';

export const tableColumns: TableColumn[] = [
  { label: '#', dataKey: 'index', width: 40, align: 'right' },
  {
    label: <FormattedMessage defaultMessage="Name" tagName="span" />,
    dataKey: 'name',
    width: 460,
  },
  {
    label: <FormattedMessage defaultMessage="Ratio" tagName="span" />,
    dataKey: 'ratio',
    width: 50,
    align: 'right',
  },
  { label: <FormattedMessage defaultMessage="Progress" tagName="span" />, dataKey: 'progress', width: 120 },
  { label: <FormattedMessage defaultMessage="Status" tagName="span" />, dataKey: 'state', width: 140 },
  {
    label: <FormattedMessage defaultMessage="Size" tagName="span" />,
    dataKey: 'size',
    width: 80,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Seeds" tagName="span" />,
    dataKey: 'num_seeds',
    width: 80,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Peers" tagName="span" />,
    dataKey: 'num_leechs',
    width: 80,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Total Size" tagName="span" />,
    dataKey: 'total_size',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Downloaded" tagName="span" />,
    dataKey: 'downloaded',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Uploaded" tagName="span" />,
    dataKey: 'uploaded',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="S Download" tagName="span" />,
    dataKey: 'downloaded_session',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="S Upload" tagName="span" />,
    dataKey: 'uploaded_session',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Down Speed" tagName="span" />,
    dataKey: 'dlspeed',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Up Speed" tagName="span" />,
    dataKey: 'upspeed',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Down Limit" tagName="span" />,
    dataKey: 'dl_limit',
    width: 100,
    align: 'right',
  },
  {
    label: <FormattedMessage defaultMessage="Up Limit" tagName="span" />,
    dataKey: 'up_limit',
    width: 100,
    align: 'right',
  },
  { label: <FormattedMessage defaultMessage="Added On" tagName="span" />, dataKey: 'added_on', width: 180 },
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
