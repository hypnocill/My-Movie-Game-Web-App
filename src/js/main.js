//main
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {createStore, compose} from 'redux';
import {Provider} from 'react-redux';
import firebase,  {firebaseRef, FBprovider} from './firebase/firebase';

//store & actions
import configureStore from './store/configureStore';
import * as actions from './actions/actions';

//theme
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//Theme Customization
import themeStyle from './theme/themeStyle';

const muiTheme = getMuiTheme(themeStyle);

injectTapEventPlugin();

//Components
import Layout from './components/Layout.js';
import BeforePlay from './components/BeforePlay.js';
import Play from './components/Play.js';
import Login from './components/Login.js';
import About from './components/About.js';
import Home from './components/Home.js';
import Redirect from './components/Redirect.js';
import Stats from './components/Stats.js';
import End from './components/End.js';

//Styles
import '../css/main.scss';

const store = configureStore();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.login());
    //console.log(user);
  } else {
    store.dispatch(actions.logout());
  }
});

function redirectReset(previousRoute, nextRoute){
  store.dispatch(actions.resetCountDown());
}

function onLeaveEnd(prevState){
  store.dispatch(actions.wipeOldGuessedMovies());
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Layout} >
          <IndexRoute component={Home} />
            <Route path="beforeplay" component={BeforePlay} />
            <Route path="play" component={Play} />
            <Route path="login" component={Login} />
            <Route path="about" component={About} />
            <Route path="stats" component={Stats} />
            <Route path="end" component={End} onLeave={onLeaveEnd}/>
            <Route path="redirect" component={Redirect} onEnter={redirectReset} />
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);
