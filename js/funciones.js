import Citas from './classes/Citas.js'
import UI from './classes/UI.js'
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js';


const ui = new UI();
const administrarCitas = new Citas();
export let DB;


const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}


let editando = false;

export function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}


export function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        //Nos permite editar registros
        objectStore.put(citaObj);
        ui.imprimirAlerta('Guardado Correctamente');
        transaction.oncomplete = function(){
            console.log('Transacción Completada');
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            editando = false;
        }
        transaction.onerror = function(){
            console.log('Hubo un error en la transacción');

        }
        

    } else {
        // Nuevo Registro

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Insertar Regstro en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilitar onjectStore
        const objectStore = transaction.objectStore('citas');

        //para actualizar .put y para eliminar .delete
        objectStore.add(citaObj);

        transaction.oncomplete = function(){
            console.log('Transacción Completada');
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }
              
        transaction.onerror = function(){
            console.log('Hubo un error en la transacción');

        }

        
       
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

export function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


export function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
     //Habilitar onjectStore
     const objectStore = transaction.objectStore('citas');

     //para actualizar .put y para eliminar .delete
     objectStore.delete(id);

     transaction.oncomplete = function(){
        console.log(`Cita ${id} eliminada`);
        ui.imprimirCitas()
    }
    transaction.onerror = function(){
        console.log('Hubo un error en la transacción');

    }

    
}

export function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}

export function citaDB(){
    //Crear base de datos version 1.0. Se crea con open + nombre BD + version
    let citaDB = window.indexedDB.open('citas',1);
    
    
    //Si hay error, metodo de indexDb, puede pasar que el navegador no soporte indexDB
    citaDB.onerror = function(){
    console.log('Hubo un error a la hora de crear la BD');
    }
    
    
    //si se creo correctamente
    citaDB.onsuccess = function(){
        console.log('Base de datos creada correctamente');
        DB = citaDB.result;
        //Mstrar citas al cargar pero indexDB ya esta listo
        ui.imprimirCitas();
    }
    
    
    //Configuracion de la base de datos, cuando creas la bd, tienes columnas que son autoincrementables, es cuando creas las tablas
    citaDB.onupgradeneeded = function(e){
        //se ejecuta una vez cuando se crea la BD
        const db = e.target.result; //referencia a la BD
        
        
        //nos permitira crear las columnas de nuestra BD
        const objectStore = db.createObjectStore('citas', { //lo usaremos en la base de datos cita
        //este es el objeto de configuración
        keyPath: 'id', //indice
        autoIncrement: true
    });
    //Definir las columnas nombre columnas + nombre keypath o la referencia para llamar a esa tabla + opciones
    objectStore.createIndex('mascota', 'mascota', { unique: false});
    objectStore.createIndex('propietario', 'propietario', { unique: false});//no puede haber dos emails iguales
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    objectStore.createIndex('fecha', 'fecha', { unique: false});
    objectStore.createIndex('hora', 'hora', { unique: false});
    objectStore.createIndex('sintomas', 'sintomas', { unique: false});
    objectStore.createIndex('id', 'id', { unique: true});
    }
}

    
