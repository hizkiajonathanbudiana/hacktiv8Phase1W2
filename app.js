const express = require('express');
const app = express();
const port = 3000;
const router = require('./routers/router');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(router);

app.listen(port, () => {
  console.log(`DIY Platform app listening on port ${port}`);
});
