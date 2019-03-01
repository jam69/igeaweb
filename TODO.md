
####    Cosas que faltan por hacer

## Gestion de los css
Por ahora, los estilos están en el fichero main.css de la aplicacion. Pero deberían estar
junto a los componentes, agruparse y distribuirse junto con el .js
(Revisar la configuracion del css-webpack para encontrar los *.css dentro del directorio de
fuentes,agruparlos en un fichero y copiarlos al directorio de distribucion)

## Quitar la dependencia de Bootstrap
Ahora estamos usando estilos de bootstrap que nos hace que dependamos de la libreria, sin 
embargo, no podemos usar toda la funcionalidad, por ejemplo los collapsibles, los popup,...
La idea sería quitar esa dependencia y añadir nuestros propios estilos y funcionalidad.
Las dependencias están en:
- Los botones (btn, btn-secundary,....)
- La Toolbar (nav-link, nav-item, nav-xxx)
- Dialogos (modal-header, modal-content, modal-xxx)
- Los Tabs ( tab-item, tab-xxx)
- Los Mensajes (alert-xxx)
- Hacer una clase con las funciones necesarias (showModal(), collapse(),activeTab(),....)

## Adecuar la gestion de la capa base del plano
- Quitar los proveedores de la libreria base y permitir su "registro"
    * método registerBaseLayer(nombre, url, ...)
    * método getRegisteredBaseLayers()
    * método selectBaseLayer
- Crear el componente de selección

## Gestión de las ampliaciones
Igual que en el dialogo está el método de addButtonToFooter, hay que implementar los metodos
addButtonToRecord(), para añadir acciones a los registros de la tabla.

## Mejorar el estilo de la toolbar
Mejorar los estilos y funcionalidad de los "dropDown"
Hacer la toolbar "collapsable"

## Componentes
* Terminar y usar IgeaEntityList
* Añadir las opciones de encoded/decoded en los querys
* Añadir las opciones que limitan los campos en los querys (all,basic,keys, y las vistas )
* Añadir las opciones de exportar (usando JS)
* Añadir las opciones de exportar desde el servidor (planos e informes)

## Resalte de entidades en el mapa y filtros
Modificar la representación de ciertas entidades según condición (incluido de una lista de entidades)

## Añadir la funcionalidad de Edición
* Componente listado de tareas
* Creacion/Activacion de tareas

## Añadir la funcionalidad de edicion Grafica
* Digitalizar Punto (hecho)
* Digitializar Linea (hecho)
* Digitalizar Superficie (hecho)
* Funcionalidad de Snap (seguramente falte un nuevo servicio REST)

## Añadir la funcionalidad de edicion Alfa
* Crear el componente de edicion (a partir de IgeaEntityDetail)
* Crear los editores para los tipos básicos
* Añadir los botones de Borrar entidad

## Añadir la funcionalidad del Arbol de capas (navegacion por relaciones)
Faltaría copiar la funcionalidad y componentes de la ventana de detalle y el
árbol de relaciones de Angular.

## Añadir la ventana de query-avanzado (similar a Angular)
Faltaría copiar la funcionalidad y componentes de de la ventana de Angular

## Localizacion mapa
* Ventana localizar Entidad: Seleccion de clase y clave del elemento a buscar  
* Ventana Localizar Coordenadas: Introducir coordenadas (WGS/UTM) y localizar
* Ventana Multi-busqueda: Panel de texto y buscar en las "busqueda rápida"
   - En una serie de campos y tablas determinados (p.ej nombre, matricula y descripción de CT, de subestacion,... (indices Lucene))
   - En un servicio internet (apple, google, ...)
 
 






