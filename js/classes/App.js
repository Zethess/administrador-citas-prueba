
import { datosCita,nuevaCita,citaDB,crearCliente } from '../funciones.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from '../selectores.js';

class App {
    constructor() {
        this.initApp();
    }

    initApp() {
        // Eventos
        eventListeners();
        function eventListeners() {
            mascotaInput.addEventListener('change', datosCita);
            propietarioInput.addEventListener('change', datosCita);
            telefonoInput.addEventListener('change', datosCita);
            fechaInput.addEventListener('change', datosCita);
            horaInput.addEventListener('change', datosCita);
            sintomasInput.addEventListener('change', datosCita);

            // Formulario nuevas citas
            formulario.addEventListener('submit', nuevaCita);
            document.addEventListener('DOMContentLoaded', ()=>{
                citaDB();
                setTimeout(() => {
                crearCliente();
                },5000);
            })
                
        }

    }
}

export default App;