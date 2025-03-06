const express = require('express');
const {sequelize} = require('./src/config/config');
const { authRoutes } = require('./src/routes/authRoutes');
const {protectedRoutes} = require('./src/routes/protectedRoutes');
const { linkRoutes } = require('./src/routes/linkRoutes');
const {userRoutes} = require('./src/routes/userRoutes');
const cors = require('cors');


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/users', userRoutes )
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/links', linkRoutes);

const PORT = process.env.PORT || 3000;

// 🔹 Iniciar servidor e sincronizar banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados conectado!');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
