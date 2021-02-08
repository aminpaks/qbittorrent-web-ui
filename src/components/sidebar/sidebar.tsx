import clsx from 'clsx';
import produce from 'immer';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { mStyles } from '../common';
import {
  Drawer,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '../material-ui-core';
import { ViewListIcon } from '../material-ui-icons';
import { Categories } from './categories';
import { colorAlpha, storageGet, storageSet, unsafeMutateDefaults } from '../../utils';

const SIDEBAR_SECTION_STATUS_KEY = 'sidebarSectionStatus';
const defaultSectionStatus = unsafeMutateDefaults<Record<'category', boolean>>({ category: true });

export const Sidebar = () => {
  const classes = useStyles();
  const [sectionStatus, setSectionStatus] = useState(
    defaultSectionStatus(storageGet(SIDEBAR_SECTION_STATUS_KEY, {} as Record<'category', boolean>))
  );
  const getHandleSectionToggle = useCallback((key: keyof typeof sectionStatus) => {
    return () => {
      setSectionStatus(s => {
        const updatedState = produce(s, draft => {
          draft[key] = !draft[key];
        });

        return storageSet(SIDEBAR_SECTION_STATUS_KEY, updatedState);
      });
    };
  }, []);

  const isAllSectionsCollapsed = !Object.values(sectionStatus).reduce((acc, b) => b && acc, true);

  return (
    <Drawer
      variant="permanent"
      className={clsx({ [classes.drawerClosed]: isAllSectionsCollapsed })}
      classes={{ root: classes.drawerRoot, paper: classes.drawerPaper }}
    >
      <Accordion
        square
        expanded={sectionStatus['category']}
        classes={{ root: classes.accordionRoot, expanded: classes.accordionExpanded }}
        onChange={getHandleSectionToggle('category')}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          classes={{ root: classes.accordionSummaryRoot, expanded: classes.accordionSummaryExpanded }}
        >
          <ViewListIcon color="action" />
          <Typography>
            <FormattedMessage defaultMessage="Categories" />
          </Typography>
          {sectionStatus['category'] ? '' : null}
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
          <Categories />
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
};

const useStyles = mStyles(({ spacing, palette }) => ({
  container: {
    minWidth: 200,
    flex: '0 0 200px',
    display: 'flex',
    borderRight: '3px solid #000',
  },
  drawerClosed: {
    width: spacing(6) + 1,
  },
  drawerRoot: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overflowX: 'hidden',
  },
  drawerPaper: {
    position: 'relative',
    backgroundColor: 'inherit',
    zIndex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  accordionRoot: {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$accordionExpanded': {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    '& .MuiListItem-root': {
      position: 'relative',
      '&::before': {
        left: spacing(6.8),
        bottom: 0,
        width: `calc(100% - ${spacing(6.8)}px)`,
        height: 1,
        display: 'block',
        content: '""',
        position: 'absolute',
        backgroundColor: colorAlpha(palette.divider, 0.08).toString(),
      },
    },
    '& .shouldShorten': {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      verticalAlign: 'text-bottom',
      maxWidth: spacing(24),
    },
  },
  accordionExpanded: {},
  accordionDetailsRoot: {
    padding: 0,
    '& .MuiListItemIcon-root': {
      minWidth: spacing(4.8),
    },
  },
  accordionSummaryRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    borderBottom: `1px solid ${palette.divider}`,

    '&$accordionSummaryExpanded': {
      minHeight: spacing(6),
    },
    '& $accordionSummaryExpanded': {
      margin: 0,
      marginRight: spacing(2),
    },
    '& .MuiSvgIcon-root': {
      marginLeft: spacing(0.5),
      marginRight: spacing(3),
      transition: '140ms ease-in-out margin-left',
      flex: '0 0 auto',
    },
    '& .MuiAccordionSummary-content': {
      maxWidth: '100%',
      '& .MuiTypography-root': {
        flex: '1 1 0px',
      },
    },
  },
  accordionSummaryExpanded: {},
}));
