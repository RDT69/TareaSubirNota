var express = require('express');
let cors = require('cors');
var morgan = require('morgan');

const PIZZAS = require('./pizzas');

var app = express();
app.use(cors());
app.use(morgan('dev'));

const PIZZAS = [
    { id: 1, name: "Barbacoa" },
    { id: 2, name: "Carbonara" },
    { id: 3, name: "Bacon Crispy" },
];

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


app.get('/', (req, res) => {
    res.send("Hola mundo");
});

app.use (express.json());

// app.get('/api/telepizza', (req, res) => {
//     res.json({
//         success: true,
//         Message: "Listado de pizzas",
//         data: {
//         count: PIZZAS.length,
//         pizzas: PIZZAS
//     }
//     });
// });

app.get('/api/telepizza', (req, res) => {
    let pizzas_ingredientes = PIZZAS.map(pizza =>{
        return {
            id: pizza.id,
            nombre: pizza.nombre,
        }
    })
    res.json({
        success: true,
        Message: "Listado de pizzas",
        data: {
            count: pizzas_ingredientes.length,
            pizzas: pizzas_ingredientes
            }
    })

})

app.use(express.static('public'));


app.get('/api/telepizza/:id', (req, res) => {
    let id = req.params.id;
    let filtro = PIZZAS.filter(pizza=>pizza.id==id);
    if(filtro.length>0){
        res.json({
            success: true,
            message: "Pizza encontrada con id: " + id,
            data: filtro[0]
        });
    } else {
        res.status(404).json({
            success: false,
            error_code: 4321,
            message: "No se encuentra ninguna pizza con id: " + id,
        });
    }
});

