import Citas from './classes/Citas.js'
import UI from './classes/UI.js'
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js';


const ui = new UI();
const administrarCitas = new Citas();

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

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Mostrar mensaje de que todo esta bien...
        ui.imprimirAlerta('Se agregó correctamente')
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas(administrarCitas);

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
    administrarCitas.eliminarCita(id);

    ui.imprimirCitas(administrarCitas)
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
    let citaDB = window.indexedDB.open('cita',1);
    
    
    //Si hay error, metodo de indexDb, puede pasar que el navegador no soporte indexDB
    citaDB.onerror = function(){
    console.log('Hubo un error a la hora de crear la BD');
    }
    
    
    //si se creo correctamente
    citaDB.onsuccess = function(){
        console.log('Base de datos creada correctamente');
        DB = citaDB.result;
    }
    
    
    //Configuracion de la base de datos, cuando creas la bd, tienes columnas que son autoincrementables, es cuando creas las tablas
    citaDB.onupgradeneeded = function(e){
        //se ejecuta una vez cuando se crea la BD
        const db = e.target.result; //referencia a la BD
        
        
        //nos permitira crear las columnas de nuestra BD
        const objectStore = db.createObjectStore('cita', { //lo usaremos en la base de datos cita
        //este es el objeto de configuración
        keyPath: 'cita',
        autoIncrement: true
    });
    //Definir las columnas nombre columnas + nombre keypath o la referencia para llamar a esa tabla + opciones
    objectStore.createIndex('nombre', 'nombre', { unique: false});
    objectStore.createIndex('email', 'email', { unique: true});//no puede haber dos emails iguales
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    objectStore.createIndex('telefono', 'telefono', { unique: false});
    }
}

export function crearCliente(){
    //Para poder trabajar con las diferentes operaciones de una BD en IndexDB, se utilizan las transacciones
    let transaction = DB.transaction(['cita'], 'readwrite'); //se realizara en la BD cita y luego se indica el modo
    transaction.oncomplete = function(){
    console.log('Transacción Completada');
    }
    
    
    transaction.onerror = function(){
    console.log('Hubo un error en la transacción');
    }
    const objectStore = transaction.objectStore('cita');
    
    
    const nuevoCliente = {
        telefono: 192319419,
        nombre: 'Juan',
        email: 'correo@correo.com'
    }
    //para actualizar .put y para eliminar .delete
    const peticion = objectStore.add(nuevoCliente);
    console.log(peticion);

}
    
