var express = require('express');
let cors = require('cors');
var morgan = require('morgan');
var app = express();

const consuntable_params= ['nombre', 'ingredientes', 'precio']
const PORT = 3000;
const PIZZAS = require('./telepizza');


app.use(cors());
app.use(morgan('dev'));
app.use (express.json());
app.use(express.static('public'));



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


app.get('/', (req, res) => {
    res.send("telepizza");
});


app.get('/api/telepizza', (req, res) => {
    if (req.query.ingredientes) {
        let pizzasFiltradas = PIZZAS.filter(pizza =>
            pizza.ingredientes.includes(req.query.ingredientes)
        );
        res.json({
            success: true,
            Message: "Listado de pizzas filtradas por ingredientes",
            data: {
                count: pizzasFiltradas.length,
                pizzas: pizzasFiltradas
            }
        });
    } else {
        res.json({
            success: true,
            Message: "Listado de todas las pizzas",
            data: {
                count: PIZZAS.length,
                pizzas: PIZZAS
            }
        });
    }
});

app.get('/api/telepizza/:id', (req, res) => {
    const id = req.params.id;
    const filter = PIZZAS.filter(pizza => pizza.id == id);
    if (filter.length > 0) {
        res.json({
            success: true,
            message: "Se ha encontrado la pizza con id : " + id,
            data: filter[0]
        });
    } else {
        res.status(404).json({
            success: false,
            error_code: 4321,
            message: "No se encuentran la pizza con el id: " + id
        });
    }
});

// app.post('/api/telepizza', (req, res) => {
//         let newPizza = req.body;
//         newPizza.id = idNew ++;
//         PIZZAS.push(newPizza);
//         res.status(201).json(newPizza);
// });

//Comprobación de datos obligatorios, a partir de la petición POST.
app.post('/api/telepizza', (req, res) => {
    let newPizza = req.body;
    if (newPizza.nombre && newPizza.precio && newPizza.ingredientes) {
        newPizza.id = PIZZAS.length + 1;
        PIZZAS.push(newPizza);
        res.status(201).json(newPizza);
    } else {
        res.status(400).json({
            success: false,
            message: "Faltan datos obligatorios",
            data: newPizza
        });
    }
});

//Comprobacion para modificar al cliente, mediante la petición PUT

app.put('/api/telepizza/:id', (req, res) => {
    let id = req.params.id;
    let filtro = PIZZAS.filter(pizza => pizza.id == id);
    if(filtro.length==0){
        res.status(404).json({
            success: false,
            error_code: 4322,
            message: "No se encuentra ninguna pizza con id: " + id,
        })
    } else {
        let newDats = req.body;
        let oldDats = filtro[0];
        MergeRecursive(oldDats, newDats);
        res.json({
            success: true,
            message: "Pizza modificada con éxito",
            data: oldDats
        })
    }
});

//Eliminar pizza, mediante la petición DELETE

app.delete('/api/telepizza/:id', (req, res) => {
    let id = req.params.id;
    let index = PIZZAS.findIndex((pizza)=> pizza.id == id);
    console.log(index);
    
    if(index < 0){
        res.status(404).json({
            success: false,
            error_code: 4323,
            message: "No se encuentra la pizza que quiere eliminar con id: " + id,
        });
    } else {
      let deletePizza= PIZZAS.splice(index, 1);
      res.json({
        success: true,
        message: "Pizza eliminada con éxito",
        data: deletePizza
      });  
    }
});


function MergeRecursive(obj1, obj2) {
    for (let p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  }