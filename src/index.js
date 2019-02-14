
import '../node_modules/@babel/polyfill';

import style from "./main.css";
import { Config } from "../node_modules/@jamartinm/jsapi/src/Config";
import { Igeaweb } from "../node_modules/@jamartinm/jsapi/src/IgeaWeb";

import { App } from './app/App';

import './app/Components';
import './app/IgeaSimpleTable';
import './app/IgeaTreeLayers';
import './app/IgeaEntityList';
import './app/IgeaLayerSelector';
import './app/IgeaLayerSelector2';
import './app/IgeaModal';
import './app/IgeaModal2';
import './app/IgeaLogin';
import './app/IgeaBasicSearch'



console.log("-----------------------Arrancando APP IgeaWeb------------------------------")
console.log("Config:",Config)
Config.SERVER_ROOT='http://localhost:8880/igea/rest';

var app=new App(Config); 
window.app = app; // export igeaWeb
// igeaWeb.login("igeaweb","xx");

