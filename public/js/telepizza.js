const URL_BASE = "http://localhost:3000/api";

const TBODY = document.querySelector("tbody");
const NOMBRE = document.getElementById("nombre");
const INGREDIENTES = document.getElementById("ingredientes");
const PRECIO = document.getElementById("precio");
const ID = document.getElementById('id');
const MESSAGE = document.getElementById('message');


function loadPizzas() {
    TBODY.innerHTML = `
    <tr>
        <td coldspan="4">Cargando... </td>
    </tr>
    `;
    fetch(URL_BASE + '/telepizza')
        .then(res => res.json())
        .then(json => {
            const pizzas = json.data.pizzas;
            console.log(pizzas);
            TBODY.innerHTML = '';
            pizzas.forEach(pizza => {
                let line = document.createElement("tr");
                line.innerHTML = `
            <td>${pizza.id}</td>
            <td>${pizza.nombre}</td>
            <td>${pizza.ingredientes}</td>
            <td>${pizza.precio}</td>
            <td coslspan="2"> 
            <img src="img/editar.png" alt="editar" onclick="loadPizza(${pizza.id})"/>
            <img src="img/eliminar.png" alt="eliminar" onclick="eliminarPizza(${pizza.id})" />
            </td>
            `;
                TBODY.appendChild(line);
            });
        })
}

function loadPizza(id) {
    fetch(URL_BASE + '/telepizza/' + id)
    .then(res => res.json())
    .then(json => {
        let pizza = json.data;
        ID.value = pizza.id;
        NOMBRE.value = pizza.nombre;
        INGREDIENTES.value = pizza.ingredientes;
        PRECIO.value = pizza.precio;
    });
}

function crearPizza() {
    let pizza = {
        "nombre": NOMBRE.value,
        "ingredientes": INGREDIENTES.value,
        "precio": PRECIO.value
    };

    fetch(URL_BASE + '/telepizza', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pizza)
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
    })
    loadPizzas();
}

function modificarPizza() {
    let id = ID.value;
    let nombre = NOMBRE.value;
    let ingredientes = INGREDIENTES.value;
    let precio = PRECIO.value;
    let pizza = {
        "nombre": nombre,
        "ingredientes": ingredientes,
        "precio": precio
    };
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pizza)
    };
    fetch(URL_BASE + '/telepizza/' + id, options)
    .then(res => res.json())
    .then(json => {
        console.log(json);
    })
    loadPizzas();
}


function eliminarPizza(id) {
    fetch(URL_BASE + '/telepizza/' + id, {
      method: 'delete'
    })
    .then(res => res.json())
    .catch(err => MESSAGE.innerHTML = "Error de conexión")
    .then(json => {
      if (json.success) {
        console.log(json);   
      }
    });
    loadPizzas();
  }
loadPizzas();