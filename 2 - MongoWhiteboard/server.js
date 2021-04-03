const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fs = require('fs');

const port = process.env.PORT || 7840;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//beginning of the MongoDB part but not completed, the images are only saved in local in the saved_images folder
/*const MongoClient = require('mongodb').MongoClient;
const DATABASE_NAME = 'MongoWhiteboard';
const DATABASE_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;
MongoClient.connect(DATABASE_URL, function (err, user) {
  let db = user.db(DATABASE_NAME);
  let collection = db.collection('IMAGES');
  console.log("Successfuly connected to database");
});*/

app.use(express.static('public'));

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection');
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs);
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs);
  })
})

//new endpoint that send the list of uploaded images
app.post('/uploaded_images', jsonParser, function (req, res) {
  const body = req.body;
  if (!body) {
    console.log('error with your body');
  }
  else {
    var user = body.user;
    var date = body.date;
    let data = body.url.replace(/^data:image\/\w+;base64,/, "");
    var buffer = Buffer.from(data, 'base64');
    var filename = `${user} ${date}.png`;
    //allow us to save localy our images
    fs.writeFile(`./saved_images/${filename}`, buffer, function (err) {
      if (err) {
        return (console.log(err));
      }
      else {
        console.log(`Your file is saved as : ${filename}`);
      }
    });
  }
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

