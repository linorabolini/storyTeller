import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { makeMainRoutes } from "./routes";
import * as firebase from "firebase";

const routes = makeMainRoutes();

var config = {
    apiKey: "AIzaSyB1fFCn_AHoobfWOA1KcBCNRzUejJG8NpI",
    authDomain: "seismic-handler-193419.firebaseapp.com",
    databaseURL: "https://seismic-handler-193419.firebaseio.com",
    projectId: "seismic-handler-193419",
    storageBucket: "",
    messagingSenderId: "845700112717"
};
firebase.initializeApp(config);

ReactDOM.render(routes, document.getElementById("root"));
registerServiceWorker();
