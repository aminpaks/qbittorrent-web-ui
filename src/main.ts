import './components/common';
import './components/material-ui-core';
import './components/material-ui-icons';

import(/* webpackChunkName: "app" */ './components/root').then(({ renderApp }) => renderApp());
