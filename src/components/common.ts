import DayJs from 'dayjs';
import DayJsUtc from 'dayjs/plugin/utc';
import DayJsTimezone from 'dayjs/plugin/timezone';
import DayJsUpdateLocale from 'dayjs/plugin/updateLocale';
import DayJsRelativeTime from 'dayjs/plugin/relativeTime';
import mStyles from '@material-ui/core/styles/makeStyles';
import useMQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

DayJs.extend(DayJsUtc);
DayJs.extend(DayJsTimezone);
DayJs.extend(DayJsRelativeTime);
DayJs.extend(DayJsUpdateLocale);

export const dayjsUpdateLocale = (lang: string, locale: object) => {
  DayJs.updateLocale(lang, locale);
};

export { mStyles, useMQuery, DayJs };
