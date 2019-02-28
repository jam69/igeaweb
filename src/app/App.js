
import {
    Entity,
    IgeaWeb,
    Toolbar,
    IgeaLayerSelector2,
    IgeaSimpleTable,
    IgeaBasicSearch,
    IgeaTreeLayers,
    IgeaEntityDetail
} from '@jamartinm/jsapi/dist/main.js';
 
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
        let xx=IgeaWeb;
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
       
        

        // first ask for layers and set LayersTree 
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

         
        // QuerySelector from querys panel, set layers, categories and action when change
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
                this.igeaWeb.getBasicSearchFields(ci).then( fds =>{
                    let basicQuery=document.getElementById('basicSearch');
                    basicQuery.queryFields=fds;
                    this.showTab("tab-basic");
                });
                this.fillHelpAttribs(ci);
            }
        });

        // Add locate button to results modal panel
        let modal=document.getElementById('modalResults');
        modal.title='Entities Found'
        this.resultTable=new IgeaSimpleTable();
        modal.modalBody= this.resultTable;
        modal.addFooterButton("Locate","", ()=>{
                let entidad= this.resultTable.selected;
                if(entidad){
                    this.igeaWeb.placeEntityMarker(entidad);
                }
        });
        modal.addFooterButton("Detail","", ()=>{
            let entidad= this.resultTable.selected;
            if(entidad){
                let modalDetail=document.getElementById('modalDetail');
                if(entidad){
                     detail.entity=entidad;
                    let cd= this.igeaWeb.getLayerDescription(entidad._ci);
                    modalDetail.title=cd.displayName
                    modalDetail.modalBody=detail;
                    modalDetail.open();
                }
            }   
        });

        // Add locate button to detail dialog
        let modalDetail=document.getElementById('modalDetail');
        let detail=new IgeaEntityDetail();
        modalDetail.addFooterButton("Locate","", 
            ()=>  {
                let modalDetail=document.getElementById('modalDetail');
    
                this.igeaWeb.placeEntityMarker(detail.entity)
            });
                    
                
            
        
        //  define toolbar
        let toolbar=new Toolbar();

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
                    // if(e.hasOwnProperty('_ci')){
                    if('_ci' in e){
                        this.igeaWeb.placeEntityMarker(e,0);
                    }
                })
            .catch(error=> this.alertError("Not Found any entity. " + error))
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
        
        toolbar.addButtonToolbar("Clear Edits","/img/lupa_icono.png",
            () =>  this.igeaWeb.clearEdits()
        );    
        
        toolbar.addButtonToolbar("Refresh","/img/zoom-refresh.png",
            () =>  this.igeaWeb.refresh()
        );
        
        toolbar.addButtonToolbar("Edit2","/img/zoom-refresh.png",
            () =>  this.igeaWeb.edicion2()
        );

        toolbar.addButtonToolbar("Edition","/img/zoom-refresh.png",
            () =>  this.igeaWeb.edicion()
        );

        toolbar.addButtonToolbar("Poly","/img/selec_area.gif",
            () => this.igeaWeb.digitalizeArea('Poly')
                    .then( g=>{
                         console.log("Digitalizado!!!!",g);
                         this.igeaWeb.queryGraphic(this.selectedLayer,g,'intersect')
                            .then(entities=>{
                                    console.log("Found ",entities)
                                    this.showEntities(entities);
                            });
                    })
        );

        toolbar.addButtonToolbar("Rectangle","/img/selec_area.gif",
            () => this.igeaWeb.digitalizeArea('Rectangle')
                    .then( g=>{
                         console.log("Digitalizado!!!!",g);
                         this.igeaWeb.queryGraphic(this.selectedLayer,g,'intersect')
                            .then(entities=>{
                                    console.log("Found ",entities)
                                    this.showEntities(entities);
                            });
                    })
        );

        toolbar.addButtonToolbar("Circle","/img/selec_area.gif",
            () => this.igeaWeb.digitalizeCircle()
                    .then( ret =>{
                        let g=ret[0];
                        let distance=ret[1];
                         console.log("Digitalizado!!!!",g);
                         this.igeaWeb.queryGraphic(this.selectedLayer,g,'within',distance)
                            .then(entities=>{
                                    console.log("Found ",entities)
                                    this.showEntities(entities);
                            });
                    })
        );
                    
        

        /* Adds a combo for selecting layers */
        this.igeaWeb.addLayerSelector(toolbar,
            layer =>  this.selectedLayer=layer);
         

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
        if(cond==''){
            let ta=document.getElementById('sql-query');
            cond=ta.value;
        }
        this.igeaWeb.queryEntities(classId,cond,true)
            .then( r =>{
                console.log("Resultados",r);
                this._hideModal('queryContainer');
                this.showEntities(r);
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
               
                let tablaResult=new IgeaSimpleTable();
                tablaResult.entities=ents;

                let modal=document.getElementById('miModal');
                modal.setBody(tablaResult);
            });
    }

    showEntities(ents){
       
        this.resultTable.entities=ents;

        let modal=document.getElementById('modalResults');
        // modal.title='Entities Found'
        // modal.modalBody=this.resultTable;
        // modal.addFooterButton("Locate","", ()=>{
        //         let entidad=this.resultTable.selected;
        //         if(entidad){
        //             console.log("Hay que localizar ",entidad);
        //             this.igeaWeb.placeEntityMarker(entidad);
        //             // this.zoomEntidad(entidad);
        //         }
        //     })
        modal.vis=true; 
    }

    fillHelpAttribs(classId){
        let div=document.getElementById('help-attribs');
        while(div.firstChild){
			div.removeChild(div.firstChild);
		}

        let table=document.createElement("table");
        this.igeaWeb.queryAttributes(classId).then( c =>{
            c.forEach(ad => {
                /* AttributeDescriptor ad */
                let tr=document.createElement("tr");

                let td=document.createElement("td");
                td.appendChild(document.createTextNode(ad.name));
                tr.appendChild(td);

                td=document.createElement("td");
                td.appendChild(document.createTextNode(ad.displayName));
                tr.appendChild(td);

                td=document.createElement("td");
                td.appendChild(document.createTextNode(ad.editor));  // fieldType
                tr.appendChild(td);

                table.appendChild(tr);
            })
        })

        div.appendChild(table);
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


    show(elementId){
        let element=document.getElementById(elementId);
        element.style.display='block';
        this.className+='show';
    }
    hide(elementId){
        let element=document.getElementById(elementId);
        element.style.display='none';
        this.className.replace(/^show$/, '');
    }

    showTab(elementId){
        let element=document.getElementById(elementId);
        // element.style.display='block';
        // this.classList.add('show');
        // get Parent
        let p=element.parentElement;
        for( let i=0;i< p.childElementCount;i++){
            let panel=p.children[i];
            if (panel.id==elementId){
                panel.style.display='block';
                panel.className += 'show';
            }else{
                panel.style.display='none';
                panel.className.replace(/^show$/, '');
            }
        }
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