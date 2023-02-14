require('dotenv').config();

const { leerInput, inquirerMenu, pausaMenu, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');
 

console.clear();

const main = async() => {

    const busquedas = new Busquedas();
    let opt = '';
    
    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                
                //mostrar mensaje
                const termino_busqueda = await leerInput('Ciudad:');
                //buscar los lugares
                const lugares = await busquedas.ciudad(termino_busqueda);
                //seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // obtener datos clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                //mostrar resultado
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:',lugarSel.lat);
                console.log('Lng:',lugarSel.lng);
                console.log('Temp:', clima.temp);
                console.log('Min:', clima.min);
                console.log('Max:', clima.max);
                console.log(`Cómo está el clima: ${clima.desc.yellow}`);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => { 
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);

                });
                break;
        }

       if (opt !== 0) await pausaMenu();
    
    }while(opt !== 0);

};

main();