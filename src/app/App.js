

// import {IgeaTreeLayers,IgeaBasicSearch,Entity,IgeaSimpleTable,IgeaWeb,Toolbar} from '@jamartinm/jsapi/dist/scripts.js';

import { IgeaWeb } from "@jamartinm/jsapi/src/IgeaWeb";
import { Toolbar } from "@jamartinm/jsapi/src/Toolbar";

import {LayersTree, AttributeDescriptor,Entity} from "@jamartinm/jsapi/src/APIClasses";
import { IgeaSimpleTable } from "@jamartinm/jsapi/src/IgeaSimpleTable";
import { IgeaBasicSearch } from "@jamartinm/jsapi/src/IgeaBasicSearch";



/**
 * Application Demo IGEA-Web 
 * 
 * 
        // vars:
        // MAP_ID {string}          nombre del mapa
        // layers {LayersTree}      Arbol de capas (con su estado)
        // selectedLayer {}         Layer selected in toolbar

 */

 export class App {

    constructor(config){
        this.igeaWeb=new IgeaWeb(config);
    }

    login(user, password){

        this.MAP_ID="Map1"; 
        
        this.igeaWeb.login(user,password)
            .then ( () => {
                 this.igeaWeb.initMap(this.MAP_ID)
                    .then( () => {
                        // console.log("Inicializado Mapa");     
                        this.igeaWeb.getCapas().then( c => {
                            this._showToolbar();
                    })
                })
            })
            .catch(error => this.alertError("Not logged"));
    }

    _showToolbar(){
       
        let toolbar=new Toolbar();

        this.layers={};
        this.igeaWeb.getLayers(this.MAP_ID)
            .then( data =>{
                this.layers=data 
                let layersTree=document.getElementById('layersTree');
                layersTree.root=data;
                let refreshButton=document.getElementById('applyChangesButton');
                refreshButton.setAttribute("disabled",true);
                layersTree.button=refreshButton;
        });

         
        this.igeaWeb.getCapas().then( data =>{
            let querySelector=document.getElementById('queryLayerSelector');
            querySelector.igeaLayers=data;
        });

        this.igeaWeb.getCategories().then( cats =>{
            let querySelector=document.getElementById('queryLayerSelector');
            querySelector.igeaCategories=cats;
        });

        let querySelector=document.getElementById('queryLayerSelector');
        querySelector.addEventListener('change', ev =>{
           
            let ci=querySelector.val;
            if(ci){ // ignore null values
                console.log("Ha cambiado la clase !!!!!",ci );
                this.igeaWeb.getBasicSearchFields(ci).then( fds =>{
                    let basicQuery=document.getElementById('basicSearch');
                    basicQuery.queryFields=fds;
                });
            }

        });
            
        

        toolbar.addButtonToolbar("Layers","/img/lupa_icono.png",
        () =>{
            this._toggleModal('treeContainer');
        });

        toolbar.addButtonToolbar("Querys","/img/lupa_icono.png",
        () =>{
            this._toggleModal('queryContainer');
        });
        
        toolbar.addButtonToolbar("Pick","/img/lupa_icono.png",
        () =>
        this.igeaWeb.pickEntidad()
            .then(
                e => {
                    console.log(" picastes ",e);
                    if(e instanceof Entity){
                        this.igeaWeb.placeEntityMarker(e);
                    }
                })
            .catch(error=> this.alertError("Not Found any entity"))
        );

        toolbar.addButtonToolbar("Pick2","/img/lupa_icono.png",
        () =>
            this.igeaWeb.pickEntidad()
                .then(
                    e => {
                        console.log(" picastes ",e);
                        if(e instanceof Entity){
                            this.igeaWeb.getEntity(e['_ci'],e['_key'])
                                .then( ent => this.igeaWeb.placeEntityMarker(ent,1));
                        }
                    })
                .catch(error=> this.alertError("Not Found any entity"))
        );
        toolbar.addButtonToolbar("Clear Picks","/img/lupa_icono.png",
            () =>  this.igeaWeb.removeAllMarkers()
            );
        toolbar.addButtonToolbar("Refresh","/img/zoom-refresh.png",
            () =>  this.igeaWeb.refresh()
        );
        toolbar.addButtonToolbar("Edition","/img/zoom-refresh.png",
            () =>  this.igeaWeb.edicion()
        );
        toolbar.addButtonToolbar("Poly","/img/selec_area.gif",
            () => this.igeaWeb.digitalizeSurfacePromise()
                    .then( g=>{
                         console.log("Digitalizado!!!!",g);
                         this.igeaWeb.queryGraphic(this.selectedLayer,g,'intersected')
                            .then(entities=>{
                                    console.log("Found ",entities)
                                    this.showEntities(entities);
                            });
                    })
        );

        /* Adds a combo for selecting layers */
        // toolbar.addLayerSelector( layer =>  this.selectedLayer=layer);
        this.igeaWeb.addLayerSelector(toolbar,layer =>  this.selectedLayer=layer);
        

        // dropdown  menu in toolbar example
        
        // toolbar.addDropdownToolbar( "sub-menu", "img",[
        //     { 
        //         txt:"op1",
        //         img:"img1",
        //         action: () => {console.log("KKK 1",this,this.igeaWeb); }   
        //     },
        //     { 
        //         txt:"op2",
        //         img:"img2",
        //         action: () => {console.log("KKK 2",this,this.igeaWeb); }   
        //     },
        //     { 
        //         txt:"op3",
        //         img:"img3",
        //         action: () => {console.log("KKK 3",this,this.igeaWeb); }   
        //     },
        //     { 
        //         txt:"op4",
        //         img:"img4",
        //         action: () => {console.log("KKK 4",this,this.igeaWeb); }   
        //     }
        // ]);

    
        /* external toolbar  */
        // let tb=toolbar.createNavBar();
        // let x=document.getElementById('tbar');
        // x.appendChild(tb);

        /* integrated toolbar */
        this.igeaWeb.createToolbar(toolbar);
    }

    /**
     * Our method for logging application messages 
     * 
     * @param {*} txt 
     */
    alertSuccess(txt){
        console.log(txt);
        let alertElement=document.getElementById('alert-component');
        let msg=`<div class="alert alert-success" id="alertText">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Success!</strong> ${txt} </a>.
        </div>`;
        alertElement.innerHTML=msg;
    }

    /**
      * Our method for logging application error messages
      * 
      * @param {*} txt 
      */
    alertError(txt){
        console.error(txt);
        let alertElement=document.getElementById('alert-component');
        let msg=`<div class="alert alert-danger alert-dismissible fade show" id="alertText">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Error!</strong> ${txt} </a>.
        </div>`;
        alertElement.innerHTML=msg;
    }
  
    applyChanges(ev){
        console.log("Apply changes");
        this.igeaWeb.updateLayers(this.MAP_ID, this.layers)
            .then( () => {
                    this.igeaWeb.refresh()
                    console.log("Disable => ",ev.target)
                    // ev.target.classList.add("disabled")
                    ev.target.setAttribute("disabled",true);
                }
            );         
    }


    doSelect(){
        let layerSelector=document.getElementById('queryLayerSelector');
        let classId=layerSelector.val;
        let basicSearch=document.getElementById('basicSearch');
        let cond=basicSearch.queryCondition;
        this.igeaWeb.queryEntities(classId,cond,true)
            .then( r =>{
                console.log("Resultados",r);
                let table=new IgeaSimpleTable();
                table.entities=r;
                let modal=document.getElementById('modalResults');
                modal.title='Query '+layerSelector.selectedLayer.displayName;
                modal._modalBody.appendChild(table);  // todo remove lo anterior
                // this._showModal('modalResults')
                modal.vis=true;

                this._hideModal('queryContainer');
            }
        );
    }

    _showModal(id){
        let modal=document.getElementById(id);
        modal.style.display="block";
    }

    _hideModal(id){
        let modal=document.getElementById(id);
        modal.style.display="none";
    }

    /**
     * 
     * @param {*} id 
     * @returns {boolean} new state (true means open)
     */
    _toggleModal(id){
        let modal=document.getElementById(id);
        modal.classList.toggle("show");
        if( modal.style.display=="none" || modal.style.display=="" ){
            modal.style.display="block";
            return true;
        }else{
            modal.style.display="none";
            return false;
        }
    }

    /**
     * 
     * @param {*} layerName 
     * @deprecated
     */
    changeLayerBase(layerName){
        // let layer = $('#baseLayer').val();
        this.igeaWeb.changeBaseLayer(layerName);
    }
    
    /**
     * @deprecated
     * 
     * @param {*} data 
     */
    setCapasOnCombo(data){
        console.log("Recibidas las capas",data);
        let combo=$('#classSelect');
        // $.each(data,function(i,cd){ // forEach classDescriptor
        //     combo.append(new Option(cd.displayName,cd.classId));
        // })
        data.forEach(// forEach classDescriptor
            cd =>  combo.append(new Option(cd.displayName,cd.classId))
        );
    
    }

    localiza(){
        let ci=$('#classSelect').val();
        let cm=$('#codeInput').val();
        this.igeaWeb.getEntity(ci,cm).then( ent => this.zoomEntidad(ent));
    }
   
    zoomEntidad(ent){
        // igeaWeb.convierteMerOld(ent['_mer'],this,center);
        this.igeaWeb.convierteMer(ent['_mer']).then(r => this.center(r));
    }

    center(coords){
        this.igeaWeb.centerMap(coords,16);
    }

        
    /**
     * @deprecated
     * 
     * @param {*} data 
     */
    setCapasOnCombo2(data){
        // console.log("Recibidas las capas",data);
        // let combo=$('#classSelect2');
        // $.each(data,function(i,cd){ // forRach classDescriptor
        //     combo.append(new Option(cd.displayName,cd.classId));
        // })
        let combo=document.getElementById('classSelect2');
        combo.layers=data;
    }

        
    /**
     * @deprecated
     */
    getLayers(){
        this.igeaWeb.getLayers(this.MAP_ID)
            .then( layers => this.showLayers(layers));
    }
  
        
    /**
     * @deprecated
     * 
     */
    showLayers(data){
        console.log("Recibidos layers");
        this.layers=data; // salvamos los layers
        let layersTree=document.getElementById('layersTree');
        layersTree.root=data;
    }

        
    /**
     * @deprecated
     * 
     */
    changeLayers(){
        console.log("Actualizamos layers");
        this.igeaWeb.updateLayers(this.MAP_ID,this.layers)
            .then( newLayers => this.updatedLayers(newLayers));
    }

    updatedLayers(){
        // refresh
        console.log("Layers Actualizads -> refresh ");
        this.igeaWeb.refresh();
    }




    // queryAttributes(){
    //     let ci=$('#classSelect2').val();
    //     this.igeaWeb.queryAttributes(ci)
    //         .then( attrs=> this.fillAttributes(attrs));
    // }

    // /**
    //  * 
    //  * @param {[AttributeDescriptor]} data 
    //  */
    // fillAttributes(data){
    //     // console.log("Recibidos attributos: ",data);
    //     let combo=$('#listaAtributos');
    //     $.each(data,function(i,attr){ // forRach classDescriptor
    //         combo.append(new Option(attr.displayName,attr.name));
    //     })
    // }
    
    listEntities(){
        // let ci=$('#classSelect2').val();
        let combo=document.getElementById('classSelect2');
        let ci=combo.val;
        let sql=$('#conditionInput').val();
        let decode=$('#decodeInput').is(':checked'); 
        
        this.igeaWeb.queryEntities(ci,sql,decode).
            then( ents=> {
                // this.fillList(ents);

                // let listaResultados=document.getElementById('listaResultados');
                // listaResultados.data = ents;

                // this.createTable('tablaResultados',ents)
                // console.log("Metemos los resultados en la tabla")
                // let tablaResultados=$('#tablaResultados');
                // let tablaResultados=document.getElementById('tablaResultados');
                
                // tablaResultados.entities = ents;
                // tablaResultados.conBorde=true;
                // tablaResultados.border=0;
                // tablaResultados.cambiaDatos(ents);
                // tablaResultados.dataList=ents;
                // tablaResultados.render();

                // let tablaResultados2=document.getElementById('tablaResultados2');
                
                // tablaResultados2.entities = ents;
                // tablaResultados2.conBorde=true;
                // tablaResultados2.border=0;

                let tablaResult=new IgeaSimpleTable();
                tablaResult.entities=ents;

                let modal=document.getElementById('miModal');
                modal.setBody(tablaResult);
            });
    }

    showEntities(ents){
        let tablaResult=new IgeaSimpleTable();
        tablaResult.entities=ents;

        let modal=document.getElementById('miModal');
        modal.setBody(tablaResult);
    }
    
    /**
     * 
     * @param {[Entity]} data 
     */
    // fillList(data){
    //     // console.log("Recibidos datos: ",data);
    //     let lista=$('#listaResultados');
    //     lista.empty();
    //     $.each(data,function(i,rec){ // forRach classDescriptor
    //         lista.append('<li>'+rec['_key']+'   '+rec['_desc']+'</li>');
    //     })

        
    // }

    pickEntidad(){
        this.igeaWeb.pickEntidad(this.MAP_ID)
                .then( ent =>_entidadSeleccionada(ent));
    }

    /**
     * 
     * @param {Entity} entidad 
     */
    _entidadSeleccionada(entidad){
        console.log("Pickada ",entidad);
        if(entidad){
            this.igeaWeb.placeEntityMarker(entidad);
        }
    }

    digitalizePoint(){
        this.igeaWeb.digitalizePoint();
    }

    digitalizeLine(){
        this.igeaWeb.digitalizeLine();
    }

    digitalizeSurface(){
        this.igeaWeb.digitalizeSurface();
    }

    edit(){
        this.igeaWeb.edicion();
    }



  

    showDialog(id){
        let modal = document.getElementById(id);
        modal.abrete();

    }

    hideDialog(id){
        let modal = document.getElementById(id);
        modal.cierrate();
    }

/**
 * 
 * @param {HTMLElement} element 
 */
    // showModal(elementIdCont,elementId){
    //     let elementDiv = document.getElementById(elementIdCont);
    //     let txt=
    //     `<div class="modal fade" id="${elementId}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
    //     <div class="modal-dialog modal-xl" role="document">
    //       <div class="modal-content">
    //         <div class="modal-header">
    //           <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
    //           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    //             <span aria-hidden="true">&times;</span>
    //           </button>
    //         </div>
    //         <div class="modal-body">
    //           ...
    //         </div>
    //         <div class="modal-footer">
    //           <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    //           <button type="button" class="btn btn-primary">Save changes</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>`;
    //  elementDiv.innerHTML=txt;    

    // //   let myTableDiv = document.getElementById(elementId);
    // //   let k=$(myTableDiv);
    // //   k.modal('show');


    // //   let aux = document.getElementById(elementId);
    // //    aux.css("display","block");
    // //   aux.classList.add('show');
    //     // aux.modal('show');
    
    // }

 }