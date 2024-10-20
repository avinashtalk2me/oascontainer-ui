// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import "./App.css";
// import "./index.css";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import store from "./store/store";
// import { SplashScreen } from "@capacitor/splash-screen";



// const container = document.getElementById('root');
// const root = ReactDOM.createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
//   () => SplashScreen.hide()
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen';

const container = document.getElementById('root');


if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
  SplashScreen.hide(); // Call the SplashScreen.hide() separately
} else {
  console.error('Root container missing in the DOM.');
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
