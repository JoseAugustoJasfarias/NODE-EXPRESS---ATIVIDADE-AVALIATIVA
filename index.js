const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');

const { alunos, filtrarNome, filtrarMedia, router } = require('./alunos');
const bodyParser = require('body-parser');

// Desafio 4 Aplicando o Morgan
const morgan = require('morgan');

app.use('/alunos', router);

/* app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); */



/* app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  if (!contentType || contentType.indexOf('application/json') !== 0) {
    return res
      .status(400)
      .json({ error: 'Content-Type deve ser application/json' });
  }
  next();
});
 */

app.use(morgan('dev'));

// Essa foi a solução proposta, porém decidi deixar mais funcional amostrando o db.json que está mais completo

// Listar todos alunos contidos no array alunos

/* app.get('/alunos', (req, res) => {
  res.send(alunos);
});
 */

// Lista o db.json com os dados atuais de todos os Alunos
app.get('/alunos', (req, res) => {
  fs.readFile('./db.json', (error, data) => {
    if (error) throw error;
    res.send(JSON.parse(data));
  });
});



// Listar alunos por nome
// Padrão de URL utilizado na consulta http://localhost:3000/alunos/nome?nome=Rosa

app.get('/alunos/nome', (req, res) => {
  const nome = req.query.nome;
  if (nome) {
    const alunoFiltrado = filtrarNome(nome);
    if (alunoFiltrado.length > 0) {
      res.send(alunoFiltrado);
    } else {
      res.status(404).send('Nenhum aluno encontrado com esse nome.');
    }
  } else {
    res.status(400).send('Nome não fornecido como parâmetro.');
  }
});

// Listar alunos por media
// Padrão de URL utilizado na consulta http://localhost:3000/alunos/media?media=5

app.get('/alunos/media', (req, res) => {
  const media = req.query.media;
  if (media) {
    fs.readFile('./db.json', (error, data) => {
      if (error) throw error;
      const alunos = JSON.parse(data);
      const alunoFiltrado = alunos.filter(aluno => aluno.media >= media);
      if (alunoFiltrado.length > 0) {
        res.send(alunoFiltrado);
      } else {
        res.status(404).send('Nenhum aluno encontrado com essa média.');
      }
    });
  } else {
    res.status(400).send('Média não fornecida como parâmetro.');
  }
});






// Deletar aluno por index

app.delete('/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('./db.json', (error, data) => {
    if (error) throw error;
    const listaAlunos = JSON.parse(data);
    const index = listaAlunos.findIndex(aluno => aluno.id === id);
    if (index === -1) {
      res.status(404).json({
        message: `Não foi possível encontrar o aluno de id ${id}.`
      });
    } else {
      const alunoExcluido = listaAlunos.splice(index, 1)[0];
      fs.writeFile('./db.json', JSON.stringify(listaAlunos), error => {
        if (error) throw error;
        res.json({
          message: `Aluno ${alunoExcluido.nome} foi excluído com sucesso.`,
          alunoExcluido
        });
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000 http://localhost:3000');
});
