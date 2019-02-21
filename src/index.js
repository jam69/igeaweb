
import '../node_modules/@babel/polyfill';

import style from "./main.css";

import 'leaflet/dist/leaflet-src';
import 'leaflet.pm/dist/leaflet.pm.min';
// import '../node_modules/jquery/dist/jquery'


// import  '@jamartinm/jsapi/dist/igeaweb.bundle.js';
import {Config} from '@jamartinm/jsapi/dist/main.js';
import {IgeaWeb,TableDescriptor} from '@jamartinm/jsapi/dist/main.js';
// import {IgeaWebLib} from '@jamartinm/jsapi/dist/igeaweb.bundle.js';

// import {IgeaTreeLayers,IgeaBasicSearch,IgeaWeb} from '../node_modules/@jamartinm/jsapi/dist/main.js';

// import { Config } from "@jamartinm/jsapi/src/Config";
// import { IgeaWeb } from "@jamartinm/jsapi/src/IgeaWeb";
// import '@jamartinm/jsapi/src/IgeaSimpleTable';
// import '@jamartinm/jsapi/src/IgeaTreeLayers';
// import '@jamartinm/jsapi/src/IgeaEntityList';
// import '@jamartinm/jsapi/src/IgeaLayerSelector';
// import '@jamartinm/jsapi/src/IgeaLayerSelector2';
// import '@jamartinm/jsapi/src/IgeaModal';
// import '@jamartinm/jsapi/src/IgeaModal2';
// import '@jamartinm/jsapi/src/IgeaLogin';
// import '@jamartinm/jsapi/src/IgeaBasicSearch' 






import { App } from './app/App';


console.log("-----------------------Arrancando APP IgeaWeb------------------------------")
console.log("Config:",Config)

// let a= new TableDescriptor();
// let kk2=IgeaWebLib;
// let kk=IgeaWebLib.exports;
// // let k=IgeaWeb();
// let x=new IgeaWeb({hola:'hola'});

Config.SERVER_ROOT='http://localhost:8880/igea/rest';
Config.ZOOM_ORIG_LAT= '40.41678';  // MADRID-lat
Config.ZOOM_ORIG_LON= '-3.7038';  // MADRID-lon

// El Salvador
//  Config.SERVER_ROOT='https://igea.indra.es:8443/igeaserver/rest';
// Config.SERVER_ROOT='https://172.22.218.186:8443/igeaserver/rest';
//  Config.ZOOM_ORIG_LAT='13.64549';
//  Config.ZOOM_ORIG_LON='-88.90617';




let app=new App(Config);
window.app = app; // export igeaWeb
// igeaWeb.login("igeaweb","xx");

