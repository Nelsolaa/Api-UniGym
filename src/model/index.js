const { sequelize } = require('../config/config'); 

const { Aluno } = require('./AlunosDb');        
const { Professor } = require('./ProfessoresDb');  
const { Aula } = require('./AulasDb');           
const { Exercicio } = require('./ExerciciosDb');   
const { Ficha } = require('./FichasDb');
const { FichaExercicio } = require('./FichaExerciciosDb');

console.log("Iniciando definição de associações...");

// --- Relação: Aula <-> Professor ---
Professor.hasMany(Aula, {
  foreignKey: 'professor_id',
  as: 'aulas_dadas' 
});
Aula.belongsTo(Professor, {
  foreignKey: 'professor_id',
  as: 'professor'
});

// --- Relação: Aula <-> Aluno ---
Aluno.hasMany(Aula, {
  foreignKey: 'aluno_id',
  as: 'aulas_agendadas'
});
Aula.belongsTo(Aluno, {
  foreignKey: 'aluno_id',
  as: 'aluno'
});

// --- Relação: Ficha <-> Exercicio (Muitos-para-Muitos) ---
Ficha.belongsToMany(Exercicio, {
  through: FichaExercicio,      
  foreignKey: 'ficha_id',       
  otherKey: 'exercicio_id',   
  as: 'exercicios'            
});
Exercicio.belongsToMany(Ficha, {
  through: FichaExercicio,
  foreignKey: 'exercicio_id',
  otherKey: 'ficha_id',
  as: 'fichas'                
});

console.log("Associações definidas com sucesso.");

const db = {
  sequelize,
  Aluno,
  Professor,
  Aula,
  Exercicio,
  Ficha,
  FichaExercicio, 
};

module.exports = db;