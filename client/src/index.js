
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';
import {  CssBaseline } from '@material-ui/core';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ShuffleVisionStore from './reducers/ShuffleVisionStore';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#333',
      },
      secondary: {
        main: '#464646',
        light: '#FFF'
      },
      background:{
        default:'#212121'
      },
      text:{
        primary: '#FFF',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
    typography:{
      h3:{
        color: '#9999999',
        fontSize: "1.75rem",
      },
      h4:{
        color: '#999999',
        fontSize: "1rem",
      },
      h5:{
        color: '#999999',
        fontSize: ".75rem",
      }

    }
  });

  const store = createStore(ShuffleVisionStore);

  console.log(store.getState());
  console.log("THEME", theme);


ReactDOM.render(
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <CssBaseline>
                <Provider store = { store }>
                    <App />
                </Provider>
            </CssBaseline>
        </MuiThemeProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();