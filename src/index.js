
import '../node_modules/@babel/polyfill';

import style from "./main.css";
import { Config } from "@jamartinm/jsapi/src/Config";
import { Igeaweb } from "../node_modules/@jamartinm/jsapi/src/IgeaWeb";

import { App } from './app/App';

import '@jamartinm/jsapi/src/IgeaSimpleTable';
import '@jamartinm/jsapi/src/IgeaTreeLayers';
import '@jamartinm/jsapi/src/IgeaEntityList';
import '@jamartinm/jsapi/src/IgeaLayerSelector';
import '@jamartinm/jsapi/src/IgeaLayerSelector2';
import '@jamartinm/jsapi/src/IgeaModal';
import '@jamartinm/jsapi/src/IgeaModal2';
import '@jamartinm/jsapi/src/IgeaLogin';
import '@jamartinm/jsapi/src/IgeaBasicSearch'



console.log("-----------------------Arrancando APP IgeaWeb------------------------------")
console.log("Config:",Config)
// Config.SERVER_ROOT='http://localhost:8880/igea/rest';

// El Salvador
Config.SERVER_ROOT='https://igea.indra.es:8443/igeaserver/rest';
Config.ZOOM_ORIG_LAT='13.746453';
Config.ZOOM_ORIG_LON='-88.931098';

var app=new App(Config); 
window.app = app; // export igeaWeb
// igeaWeb.login("igeaweb","xx");

