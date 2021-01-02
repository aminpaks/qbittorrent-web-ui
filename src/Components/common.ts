import DayJs from 'dayjs';
import DayJsUtc from 'dayjs/plugin/utc';
import DayJsTimezone from 'dayjs/plugin/timezone';
import mStyles from '@material-ui/core/styles/makeStyles';

DayJs.extend(DayJsUtc);
DayJs.extend(DayJsTimezone);

export { mStyles, DayJs };
