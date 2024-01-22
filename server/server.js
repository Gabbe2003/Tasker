require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verify');
const corsOptions = require('./middleware/cors');
const PORT = process.env.PORT || 8000;


const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('tiny'));

app.use('/register', require('./routes/login/register'));
app.use('/auth', require('./routes/login/login'));
app.use('/refresh', require('./routes/login/refresh'));
app.use('/logout', require('./routes/login/logout'));
app.use('/get', require('./routes/api/getFolder'));
app.use('/delete', require('./routes/api/deleteFolder'));
app.use(verifyJWT);
app.use('/put', require('./routes/api/updateFolder'));
app.use('/post', require('./routes/api/postFolder'));
app.get('/test', (req, res) => {
  res.send('Test route works');
});

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`Server running on Port ${PORT}`);
  app.listen(PORT);
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
