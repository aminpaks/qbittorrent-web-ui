import DayJs from 'dayjs';
import DayJsUtc from 'dayjs/plugin/utc';
import DayJsTimezone from 'dayjs/plugin/timezone';
import mStyles from '@material-ui/core/styles/makeStyles';
import useMQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

DayJs.extend(DayJsUtc);
DayJs.extend(DayJsTimezone);

export { mStyles, useMQuery, DayJs };
