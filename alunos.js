const fs = require('fs');
const express = require('express');
const router = express.Router();




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


// Deletar aluno por index
// Padrão de URL utilizado na consulta http://localhost:3000/alunos/1
router.delete('/:index', (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile('./db.json', (error, data) => {
    if (error) throw error;
    const listaAlunos = JSON.parse(data);

    if (index >= 0 && index < listaAlunos.length) {
      listaAlunos.splice(index, 1);
      fs.writeFile('./db.json', JSON.stringify(listaAlunos), error => {
        if (error) throw error;
        res.json(`Aluno na posição ${index} deletado com sucesso.`);
      });
    } else {
      res.status(400).json({
        message: `Índice ${index} inválido!`
      });
    }
  });
});



// Atualizar aluno por index
// Padrão de URL utilizado na consulta http://localhost:3000/alunos/1

router.put('/:index', (req, res) => {
  const { index } = req.params;
  const { nome, matricula, media } = req.body || {};

  if (nome && media && matricula) {
    const novoAluno = { nome, media, matricula };
    fs.readFile('./db.json', (error, data) => {
      if (error) throw error;
      const listaAlunos = JSON.parse(data);
      
      // Verifica se a posição é válida
      if (index < 0 || index >= listaAlunos.length) {
        res.status(400).json({
          message: `A posição ${index} não é válida!`
        });
      } else {
        // Atualiza os dados do aluno na lista
        listaAlunos[index] = { ...listaAlunos[index], ...novoAluno };
        fs.writeFile('./db.json', JSON.stringify(listaAlunos), error => {
          if (error) throw error;
          res.json(
            `Atualizado com sucesso: Matrícula: ${matricula}, Nome: ${nome}, Média: ${media}`
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
