const express = require('express');
const { sequelize } = require('./src/config/config');
const { authRoutes } = require('./src/routes/authRoutes');
const { protectedRoutes } = require('./src/routes/protectedRoutes');
const { alunoRoutes } = require('./src/routes/alunoRoutes');
const { professorRoutes } = require('./src/routes/professorRoutes');
const { exercicioRoutes } = require('./src/routes/exercicioRoutes');
const { aulaRoutes } = require('./src/routes/aulaRoutes');
const { fichaRoutes } = require('./src/routes/fichaRoutes');
const { fichaExercicioRoutes } = require('./src/routes/fichaexercicioRoutes');
const cors = require('cors');
const os = require('os');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/professores', professorRoutes);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/ficha-exercicios-admin', fichaExercicioRoutes);

const PORT = process.env.PORT || 3000;

// 🔹 Função para obter o IP local
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// 🔹 Iniciar servidor e sincronizar banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados conectado!');
  const ip = getLocalIp();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse via navegador: http://${ip}:${PORT}`);
  });
});

module.exports =  { app };  
