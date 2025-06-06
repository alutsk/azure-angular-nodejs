const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT; // Choose your desired port

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist', 'angular-express-azure', 'browser')));

// Handle all routes by serving the index.html file
app.get('*', (req, res) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.sendFile(path.join(__dirname, 'dist', 'angular-express-azure', 'browser', 'index.html'));

  // console.log('NONCE token: ', null);



  // // path to file
  // const filePath = path.resolve(__dirname, 'dist', 'browser', 'index.html');

  // // read the file
  // fs.readFile(filePath, 'utf8', function (err, data) {
  //   if (err) {
  //       return console.log(err);
  //   }

  //   // generate nonce and set it on header
  //   // res.locals.nonce = uuidv4().replace(/\-/g, '');
  //   // const nonce = uuidv4().replace(/\-/g, '');
  //   // res.header('Content-Security-Policy', "default-src 'self';style-src 'self' `'nonce-${res.locals.nonce}'`;"

  //   // replace the special string with nonce
  //   // const result = data.replace('NODE_CSP_NONCE', nonce);
  //   console.log('NONCE token: ', nonce);
  //   res.send(result);
  // });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
