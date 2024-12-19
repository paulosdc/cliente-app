const express = require('express');
const path = require('path');
const app = express();

const appName = 'cliente-app';
app.use(express.static(path.join(__dirname, 'dist', appName)));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', appName, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});