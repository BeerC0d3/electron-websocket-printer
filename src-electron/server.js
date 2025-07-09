const express = require('express');
const app = express();
const port = 3000; // Choose an available port

app.get('/', (req, res) => {
  res.send('Hello from Electron Express Server src-electron!');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// const http = require('http');
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('¡Hola desde el servidor Node.js src!\n');
// });

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Servidor escuchando en http://localhost:${port}`);
// });
