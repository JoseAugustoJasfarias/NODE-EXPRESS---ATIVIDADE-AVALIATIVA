const fs = require('fs');
const express = require('express');
const router = express.Router();
const app = express();



const alunos = [
  {
    nome: 'Carlos Augusto ',
    media: 7.5
  },
  {
    nome: 'Rafaela Oliveira ',
    media: 9
  },
  {
    nome: 'Felipe Soares ',
    media: 5.5
  },
  {
    nome: 'Yumi',
    media: 10
  },
  {
    nome: 'Pedro Jorge ',
    media: 3
  },
  {
    nome: 'Rosa Maria ',
    media: 6.5
  },
  {
    nome: 'Maicon Andrade ',
    media: 8.5
  },
  {
    nome: 'Jennifer Almeida',
    media: 4.9
  }
];


// Adicionar novo aluno
// Padrão de URL utilizado na consulta  http://localhost:3000/alunos/novo
router.post('/novo', (req, res) => {
  const { nome, matricula, media } = req.body || {};

  if (nome && media && matricula) {
    const novoAluno = { nome, media, matricula };
    fs.readFile('./db.json', (error, data) => {
      if (error) throw error;
      const listaAlunos = JSON.parse(data);
      
      // Verifica se já existe um aluno com a mesma matrícula
      const alunoExistente = listaAlunos.find(aluno => aluno.matricula === matricula);
      
      if (alunoExistente) {
        res.status(400).json({
          message: `O aluno com matrícula ${matricula} já existe!`
        });
      } else {
        listaAlunos.push(novoAluno);
        fs.writeFile('./db.json', JSON.stringify(listaAlunos), error => {
          if (error) throw error;
          res.json(
            `Adicionado com sucesso: Matrícula: ${matricula}, Nome: ${nome}, Média: ${media}`
          );
        });
      }
    });
  } else {
    res.status(400).json({
      message: 'Dados inválidos! O nome, matricula e a média são obrigatórios.'
    });
  }
});


 

// Atualizar aluno por index


 

function filtrarNome(nome) {
  return alunos.filter(aluno =>
    aluno.nome.toLocaleLowerCase().includes(nome.toLocaleLowerCase())
  );
}

const filtrarMedia = media => {
  return alunos.filter(aluno => aluno.media >= media);
};

module.exports = {
  alunos,
  filtrarNome,
  filtrarMedia,
  router
};
