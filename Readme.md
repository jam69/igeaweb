
### IGEA basics 
Igea es un GIS (Sistema de Información Geográfica) fácilmente adapatable y totalmente dinámico.
Tiene su propia organización de los datos que facilita la gestión de grandes volumenes de datos

## Organización de datos
Los datos se organizan en "Clases". En el caso de un sistema de gestión de la red eléctrica, clases
puende ser "Subestaciones", "Transformadores", "tramos", "interruptores",...
Los datos de cada clase pueden estar en tablas diferentes, bases de datos diferentes, e incluso no 
tener tablas, por ejemplo, capas WFS (Web Feature Service). También pueden ser referencias a otro
servidor de IGEA, o incluso ser una agrupación de tablas (por ejemplo para varias zonas geográficas,
incluso cada una con su propia proyección)

Cada clase tiene una información básica que consiste en:
- Un 'ID numérico' que nos permite identificar la clase (classId) de una forma unívoca
- Una forma de obtener un ID de la entidad dentro de la clase (classMember) o 'key'. Normalmente es 
el nombre de un campo
- Una forma de obtener la geometría de la entidad (normalmente es el nombre de un campo)
- Una forma de obtener los datos (class-iterator) que es una especie de "url" que define como obtener
los registros. Esta URL tiene mas información que una url normal, ya que añade la forma en que está
codificada. 

''' 
Por ejemplo 
 "SQL4:ORACLE:HOST:BDATOS" 
 Indica que se se use el modo4 de SQL (que permite tener trabajos de la larga duracion), sobre una
 base de datos Oracle, localizada en HOST (su IP o dns), con nombre (o SID) BDATOS,... y otros
 parámetros que necesite como el usuario,...
 ''' 
     
Las clases tienen una serie de atributos, que están definidos en una "tabla de configuración". Esta
tabla de configuración define los "nombres bonitos de los campos", la forma que se presentan, los 
permisos de los usuarios, ...   
También se define como se describe un registro, por ejemplo usando un campo de terminado o varios.
Todos la programación de igea usan esa configuración, así que TODOS los programas, librerías,.. de 
IGEA funcionan en cualquier instalación sin cambiar nada del código. Aparte de las rutinas normales
se pueden añadir funciones nuevas dependientes de cada instalación.

A los registros de estas "tablas" o "clases" se les llama "Entidades". Es decir 'Entidad' es cada 
uno de los elementos (gráficos o no) de la base de datos de IGEA. Las entidades se identifican por 
su ClassID (el ID de la clase a la que pertenecen) y su ClassMember (el valor de su clave dentro 
dentro de la clase). Normalmente se ve como "1008:44444444" que sería el registro con clave 
"4444444", dentro de la clase con ID numero "1008".

La forma de presentar cada campo viene definido en esas tablas de configuración como el "editor". El
editor es una cadena de texto, que cada sistema (cliente java pesado, web,...) interpreta como la
forma de presentar un dato al cliente (p.ej las fechas, o los campos codificados). Estos editores
se pueden definir e implementar en cada instalación.

Las relaciones entre tablas también están definidos por las "tablas de configuración". En IGEA se
añade el concepto "Camino", que es una agrupación de relaciones. Por ejemplo en el caso eléctrico
tenemos un camino "situado en" que nos indica cada componente donde esta, así pues de desde una
subestación podemos, usando las relaciones de este camino, obtener los paques, celdas, interruptores,
elementos de seguridad, etc,... que están situados en ella.

En resumen:
+ IGEA es un sistema de información geográfica, es decir una base de datos relacional con
datos geográficos.
+ En cada instalación de IGEA se encuentra la definición de sus datos, agrupados por "capas", "layers",
"clases", o "tablas", o como queramos llamarlas.
+ Las Clases pueden estar almacenadas en multitud de soportes, (otros servidores, bases de datos de
diferentes tipos, ficheros,...) que no afectan a la funcionalidad de las aplicaciones.
+ Cada item de ellos se llama "Entidad" o "registros" y se identifica por la clase a la que pertenecen
y su identificador (o clave) dentro de la clase
+ Las relaciones entre tablas, los atributos de las entidades, la forma en que se muestran, etc,.. 
están definidas en la configuración al arrancar la aplicación.


### Application Basics
Esta es una aplicación de ejemplo de uso de la librería IGEAWebApi (IGEAWebApi.tgz)
Esta hecha en ES6 (EcmaScript 6) y utiliza ciertas utilidades para generar JS básico que se pueda
ejecutar en cualquier navegador (está probado en Chrome)

#### Instalacion


#### Uso 
Al abrirse la página lo primero que hace es "login" al servidor configurado. Eso está en el fichero
"index.js" e "index.html".

Si pulsamos en el boton "layers", nos aparece una ventana emergente donde están todas las capas de la
aplicación. Si pulsamos sobre el triángulo se abre o cierra el árbol para mostrar mas o menos capas.
Si se pulsa sobre la X, las activamos o desactivamos. Si pulsamos sobre una "agregación" de capas, se
activan/desactivan todos sus descendientes. El último nivel de árbol son los textos configurados para
cada capa. Para aplicar los cambios sobre el mapa hay que pulsar el botón de "actualizar capas". Para
ocultar esta ventana, volver a pinchar en la toolbar el botón de layers.

Si pulsamos en el botón "querys", nos aparece una ventana emergente con los campos para hacer peticiones
sobre la base de datos.
Seleccionamos en el primer combo la "categoria" de las capas, y el segundo combo la "capa" que sobre
la que haremos la consulta.
Al seleccionar la capa, en la pestaña de "basic", nos aparecen los campos "basicos" para querys de 
dicha capa. Rellenamos alguno de ellos y  pulsamos el boton de "Table". Se hará la peticion con el 
"AND" de todos los campos rellenos.
Si activamos la pestaña de "query", entonces no sale un area de texto para que introduzcamos una
condicion SQL. En la parte superior nos aparecen los campos de esa entidad y una descripción.
Se pueden anidar las condiciones usando parentesis y los operadores AND, OR y NOT. Para cada campo
podemos utilizar los operadores '=','!=','>','>=','<','<=', 'LIKE', 'IN'
Si usamos 'LIKE' se pueden usar patrones tipo oracle, es decir '%' es un comodin para cualquier 
caracter y cualquier numero de veces, y '_' es un comodín para un sólo caracter.
Al hacer un query, o la pinchar en la "X" de la parte superior derecha, la ventana desaparece. 
También desaparece si volvemos a pinchar en la toolbar.

Una vez pulsado el boton "tabla", se hace la petición al servidor, y se abre un nuevo panel con la
tabla de resultados.
En la tabla de resultados podemos seleccionar un registro pinchando sobre él, y luego podemos
aplicar los botones de abajo. 
El botón "Locate" localiza la entidad seleccionada en el mapa, mostrando un marcador y moviendo
el mapa para que se vea.
El botón "Detail" abre otro panel, con la entidad seleccionada y todos sus atributos
Si pinchamos en la "X" de la parte superior derecha, el panel de resultados desaparece.

Si en la toolbar pinchamos sobre el botón "PICK", se cambia el cursor sobre el mapa y permite
seleccionar entidades sobre él. Si no hay nada donde pinchamos, aparece un mensaje de error en 
rojo en la parte inferior del mapa. Si encuentra una entidad, aparece un marcador sobre la 
entidad del mapa mostrando su clase, clave y descripción.

En la toolbar debemos seleccionar una clase antes de hacer picks por area.
Seleccionamos una clase y luego pinchamos sobre uno de los botones de pick por área (botón de 
selección por polígono, por rectangulo o por círculo). Al finalizar la digitalización de la 
forma, se hace un query gráfico en el servidor sobre la clase seleccionada en la toolbar,
y los resultados se muestran en el panel de resultados igual que los querys por campos.






