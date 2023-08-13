const express = require('express')
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w6iptv2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('productCollection').collection('products')
        const userCollection = client.db('productCollection').collection('user')
        const orderCollection = client.db('productCollection').collection('orders')
           //get products
        app.get('/products', async (req, res) => {
            const query = {}
            const limit = parseInt(req?.query?.limit)
            const result = await productsCollection.find(query).limit(limit).toArray()
            res.send(result)
        })
        // register user
        app.post('/register', async(req,res) => {
            const body = req.body;
            const phone = body.phone;
            const query = {phone: phone}
            const exist = await userCollection.findOne(query)
            if(exist){
                res.status(200).json({
                    ok: false,
                    message: 'This user is already registered'
                })
                return
            }
            const result = await userCollection.insertOne(body)
            res.status(200).json({
                ok: true,
                data: result
            })
        })
       // user login
       app.post('/login',async(req,res) =>{
        const body = req.body;
        const phone  = body.phone;
        const password = body.password;
        const query = {phone: phone}
        const isExists = await userCollection.findOne(query);
        console.log(isExists);
        
        if(isExists && isExists.password === password){
            res.status(200).json({
                ok: true  
            })
            return
        }else {
            res.status(200).json({
                ok: false
            })
            return
        }
       })
       // add order
       app.post('/addProduct',async(req,res) =>{
           const body = req.body;
           const result = await orderCollection.insertOne(body);
        res.status(200).json({
            ok: true,
        })
       })
      app.get('/getOrder',async(req,res) =>{
        const phone = req.query.user;
        const query = {phone: phone}
        const order = await orderCollection.find(query).toArray()
        res.status(200).json({
            ok: true,
            data: order
        })
      }) 
      app.delete('/delete',async(req,res) =>{
        const id = req.query.id;
        const query = {_id: new ObjectId(id)}
        const result = await orderCollection.deleteOne(query)
        res.status(200).json({
            ok: true
        })
      })
    }
    finally {

    }
}

run().catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Server running successfully')
 
})

app.listen(port, () => {
  console.log(`Repliq server listening on port ${port}`)
})