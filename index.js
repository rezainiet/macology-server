const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://dbUserCreative:ncfaL7kfIkQwb8B9@cluster0.f76th.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db('macology').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const curosr = productCollection.find(query);
            const result = await curosr.toArray();
            res.send(result);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);

            res.send(product);
        })
    }
    finally {

    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is Running on Port');
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}/`)
})