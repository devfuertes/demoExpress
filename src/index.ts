import express from "express";
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
});

//app.listen(3000);
const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');});
