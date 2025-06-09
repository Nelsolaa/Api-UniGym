const { sequelize } = require('../config/config'); // Sua conexão Sequelize

// ==========================================================
// 1. IMPORTA TODOS OS SEUS MODELOS
// ==========================================================
// 👇👇👇 VERIFIQUE OS NOMES DOS ARQUIVOS E OBJETOS EXPORTADOS! 👇👇👇
const { Aluno } = require('./AlunosDb');         // Ex: Arquivo AlunosDb.js exporta { Aluno }
const { Professor } = require('./ProfessoresDb');  // Ex: Arquivo ProfessoresDb.js exporta { Professor }
const { Aula } = require('./AulasDb');           // Ex: Arquivo AulasDb.js exporta { Aula }
const { Exercicio } = require('./ExerciciosDb');   // Ex: Arquivo ExerciciosDb.js exporta { Exercicio }
const { Ficha } = require('./FichasDb');
const { FichaExercicio } = require('./FichaExerciciosDb');

// ==========================================================
// 2. DEFINE TODAS AS ASSOCIAÇÕES
// ==========================================================
console.log("Iniciando definição de associações...");

// --- Relação: Aula <-> Professor ---
Professor.hasMany(Aula, {
  foreignKey: 'professor_id',
  as: 'aulas_dadas' // Apelido para as aulas que um professor dá
});
Aula.belongsTo(Professor, {
  foreignKey: 'professor_id',
  as: 'professor'
});

// --- Relação: Aula <-> Aluno ---
Aluno.hasMany(Aula, {
  foreignKey: 'aluno_id',
  as: 'aulas_agendadas' // Apelido para as aulas que um aluno tem
});
Aula.belongsTo(Aluno, {
  foreignKey: 'aluno_id',
  as: 'aluno'
});

// --- Relação: Ficha <-> Exercicio (Muitos-para-Muitos) ---
// Uma Ficha pode ter Muitos Exercicios, e um Exercicio pode estar em Muitas Fichas,
// usando FichaExercicio como tabela intermediária.
Ficha.belongsToMany(Exercicio, {
  through: FichaExercicio,      // Tabela de junção
  foreignKey: 'ficha_id',       // Chave em FichaExercicio que aponta para Ficha
  otherKey: 'exercicio_id',   // Chave em FichaExercicio que aponta para Exercicio
  as: 'exercicios'            // Apelido para acessar os exercícios de uma ficha
});
Exercicio.belongsToMany(Ficha, {
  through: FichaExercicio,
  foreignKey: 'exercicio_id',
  otherKey: 'ficha_id',
  as: 'fichas'                // Apelido para acessar as fichas de um exercício
});

console.log("Associações definidas com sucesso.");

// ==========================================================
// 3. EXPORTA TUDO
// ==========================================================
const db = {
  sequelize,
  Aluno,
  Professor,
  Aula,
  Exercicio,
  Ficha,
  FichaExercicio, // Exportar o modelo da tabela de junção pode ser útil
};

module.exports = db;