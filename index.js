const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process?.env?.DB_USER}:${process?.env?.DB_PASS}@cluster0.f76th.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db('macology').collection('products');

        // Auth

        app.post('/login', async (req, res) => {
            const user = req.body;
            const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accesstoken });
        })

        // service
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
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    qty: data.newQty
                },
            }
            console.log(updateDoc);
            const result = await productCollection.updateOne(
                filter,
                updateDoc,
                options
            )
            res.send(result);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);

            res.send(result);
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.get('/allproducts', async (req, res) => {
            const query = {};
            const curosr = productCollection.find(query);
            const result = await curosr.toArray();
            res.send(result);
        });

        app.get('/allproducts/:supplier', async (req, res) => {
            const supplier = req.params.supplier;
            const query = { supp: supplier };
            const items = productCollection.find(query);
            const result = await items.toArray();
            res.send(result);
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