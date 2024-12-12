var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('socket.io')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const { error } = require('console')
const cors = require('cors');

var dbUrl = 'mongodb+srv://vickychen:Module13Assi@stocknode.0rvsu.mongodb.net/'

app.use(cors());
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
/*
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    product: {
      productid: { type: Number, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      instock: { type: Boolean, default: true }
    }
  });
*/
const productSchema = new mongoose.Schema({
      id: { type: Number, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      instock: { type: Boolean, default: true }
    
  });

  // Create the model
const Message = mongoose.model('message', productSchema);

/*
var Message = mongoose.model('message', {
    id: String,
    category: String,
    price: String,
    name: String,
})
*/

async function getProducts() {
    try {
        //const messages = await Message.find({}, { _id: 0, __v: 0 });
        const messages = await Message.find()
        console.log(messages)
        //console.log(Array.from(messages))
        console.log(Array.isArray(messages))
        return messages;
    } catch (err) {
        console.error('Error retrieving messages', err)
    }
}

app.get('/products', async (req, res) => {
    console.log("getting API is invoked")

    var messages = await getProducts()
    console.log(messages.length)
    res.json(messages)
    //res.json([{ id: 1733815567574, category: 'test', price: '1', name: 'test' }])
    //res.status(200).send(JSON.stringify({ id: 1733815567574, category: 'test', price: '1', name: 'test' }))
})

app.post('/products', (req, res) => {
    var message = new Message(req.body);
    
    message.save()
        .then( () => {
            console.log('output complete')
            //io.emit('message', req.body)
            console.log(req.body)
            //res.sendStatus(200)
            res.status(201).json(message)
        })
        .catch( (err) => {
            res.sendStatus(500)
            return console.log('err')
        })
})

app.delete('/products/:id', async (req, res) => {
    try {
        await Message.deleteOne({id: req.params.id });
        res.sendStatus(204);  // No content
    } catch (err) {
        res.status(500).send('Error deleting product');
    }
});

/* Due to limitation of client web UI, the API has not been tested */
app.patch('/products/:id', async (req, res) => {
    try {
        const input_id = req.params.id;
        const input_fields = req.body;

        const search_res = await Message.findOneAndUpdate(
            { id: input_id },
            { $set: input_fields },
            { new: true }
        );

        if (!search_res) {
            return res.status(404).json({ error: 'Item is not found' });
        }

        res.status(200).json(search_res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

io.on('connection', (socket) => {
    console.log('a user is connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongoDB database connection');
    })
    .catch((err) => {
      console.error('Connection failed', err);
    });

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})