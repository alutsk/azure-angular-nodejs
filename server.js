const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT; // Choose your desired port

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist', 'angular-express-azure', 'browser'), { index: false }));

// Handle all routes by serving the index.html file
app.get('*', (req, res) => {
  // res.setHeader('X-Frame-Options', 'DENY');
  // res.sendFile(path.join(__dirname, 'dist', 'angular-express-azure', 'browser', 'index.html'));

  // console.log('NONCE token: ', null);



  // path to file
  const filePath = path.resolve(__dirname, 'dist', 'angular-express-azure', 'browser', 'index.html');

  // read the file
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    // generate nonce and set it on header
    // res.locals.nonce = uuidv4().replace(/\-/g, '');
    // const nonce = uuidv4().replace(/\-/g, '');
    // // replace the special string with nonce
    // const result = data.replace('NODE_CSP_NONCE', nonce);

    const { cspHeader, cspContent } = useCSP(data);

    // console.log('NONCE token: ', nonce);
    console.log('Request path: ', req.path);

    res.header('Content-Security-Policy', cspHeader);
    res.send(cspContent);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function useCSP(content) {
  const nonce = crypto.randomUUID();

    // TODO: figure out how to extract from environment
  const gatewayApiEndpoint = 'https://dev-gateway-apim.azure-api.net';
  const stripeLibEndpoint = 'https://js.stripe.com/v3/';
  const blobStorage = 'https://devstorageaccstg.blob.core.windows.net';

  const defaultSrc = `default-src 'self' ${gatewayApiEndpoint}`;
  const connectSrc = `connect-src 'self' https://maps.googleapis.com ${gatewayApiEndpoint}`;
  const scriptSrc = `script-src 'self' https://maps.googleapis.com ${stripeLibEndpoint} 'nonce-${nonce}'`;
  const styleSrc = `style-src 'self' 'nonce-${nonce}'`;
  const imgSrc = `img-src 'self' data: ${blobStorage}`;
  const frameSrc = `frame-src 'self' ${stripeLibEndpoint}`;
  const frameAncestor = `frame-ancestors 'none'`;

  console.log('NONCE token: ', nonce);
  // console.log('Request path: ', req.path);

  return {
    // cspHeader: `${defaultSrc}; ${connectSrc}; ${styleSrc}; ${scriptSrc}; ${imgSrc}; ${frameSrc}; ${frameAncestor};`,
    cspHeader: `default-src 'self' 'nonce-${nonce}'`,
    cspContent: content.replace('NODE_CSP_NONCE', nonce),
  }
}
