const express = require('express')
const app = express()
const port = 3000

app.get('/health', (req, res) => {
    res.send('All good!')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})