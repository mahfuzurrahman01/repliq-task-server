const express = require('express')
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; 

app.get('/', (req, res) => {
  res.send('Server running successfully')
})

app.listen(port, () => {
  console.log(`Repliq server listening on port ${port}`)
})