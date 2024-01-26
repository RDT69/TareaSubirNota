var express =  require('express');
var app = express();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


app.get('/', (req, res) => {
    res.send("Hola mundo");
});

app.get('/api/telepizza', (req, res) => {
    res.send("api de telepi con método GET");
});

app.use(express.static('public'));


app.get('/api/telepizza/:id', (req, res) => {
   let id = req.params.id;
   res.send("Pizza con id: " + id); 
});