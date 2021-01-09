import './Components/common';
import './Components/materialUiCore';
import './Components/materialUiIcons';

import(/* webpackChunkName: "app" */ './Components/Root').then(({ renderApp }) => renderApp());
