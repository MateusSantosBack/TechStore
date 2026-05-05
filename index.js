const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// ================= CONEXÃO =================
const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    database: 'techstore'
});

conectar.connect((err) => {
    if (err) {
        console.log('Erro ao conectar:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});

// ================= HOME =================
app.get('/', (req, res) => {
    conectar.query('SELECT * FROM produtos', (err, produtos) => {
        if (err) return res.send('Erro produtos');

        conectar.query('SELECT * FROM clientes', (err2, clientes) => {
            if (err2) return res.send('Erro clientes');

            res.render('index', { produtos, clientes });
        });
    });
});

// ================= PÁGINAS =================
app.get('/cadastro_produto', (req, res) => {
    res.render('cadastro_produto');
});

app.get('/cadastro_cliente', (req, res) => {
    res.render('cadastro_cliente');
});

// ================= PRODUTOS =================

// CREATE
app.post('/produtos/salvar', (req, res) => {
    const { nome, preco, categoria } = req.body;

    if (!nome || !preco || !categoria) {
        return res.send('Preencha todos os campos');
    }

    conectar.query(
        'INSERT INTO produtos VALUES (NULL,?,?,?)',
        [nome, preco, categoria],
        (err) => {
            if (err) return res.send('Erro ao cadastrar');
            res.redirect('/');
        }
    );
});

// DELETE
app.post('/produtos/deletar', (req, res) => {
    const { id } = req.body;


    conectar.query(
        'DELETE FROM produtos WHERE id=?',
        [id],
        (err) => {
            if (err) return res.send('Erro ao deletar');
            res.redirect('/');
        }
    );
});

// UPDATE
app.post('/produtos/atualizar', (req, res) => {
    const { id, nome, preco, categoria } = req.body;

    if (!id || !nome || !preco || !categoria) {
        return res.send('Preencha todos os campos');
    }

    conectar.query(
        'UPDATE produtos SET nome=?, preco=?, categoria=? WHERE id=?',
        [nome, preco, categoria, id],
        (err) => {
            if (err) return res.send('Erro ao atualizar');
            res.redirect('/');
        }
    );
});

// EDITAR PRODUTO
app.get('/produtos/editar/:id', (req, res) => {
    conectar.query(
        'SELECT * FROM produtos WHERE id=?',
        [req.params.id],
        (err, result) => {
            if (err) return res.send('Erro ao buscar produto');
            res.render('editar_produto', { produto: result[0] });
        }
    );
});

// ================= CLIENTES =================

// CREATE
app.post('/clientes/salvar', (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.send('Preencha todos os campos');
    }

    if (telefone.length < 10 || telefone.length > 15) {
        return res.send('Telefone inválido');
    }

    conectar.query(
        'INSERT INTO clientes VALUES (NULL,?,?,?)',
        [nome, email, telefone],
        (err) => {
            if (err) return res.send('Erro ao cadastrar');
            res.redirect('/');
        }
    );
});

// DELETE
app.post('/clientes/deletar', (req, res) => {
    const { id } = req.body;

    if (!id) return res.send('ID inválido');

    conectar.query(
        'DELETE FROM clientes WHERE id=?',
        [id],
        (err) => {
            if (err) return res.send('Erro ao deletar');
            res.redirect('/');
        }
    );
});

// UPDATE
app.post('/clientes/atualizar', (req, res) => {
    const { id, nome, email, telefone } = req.body;

    if (!id || !nome || !email || !telefone) {
        return res.send('Preencha todos os campos');
    }

    if (telefone.length < 10 || telefone.length > 11) {
        return res.send('Telefone inválido');
    }

    conectar.query(
        'UPDATE clientes SET nome=?, email=?, telefone=? WHERE id=?',
        [nome, email, telefone, id],
        (err) => {
            if (err) return res.send('Erro ao atualizar');
            res.redirect('/');
        }
    );
});

// EDITAR CLIENTE
app.get('/clientes/editar/:id', (req, res) => {
    conectar.query(
        'SELECT * FROM clientes WHERE id=?',
        [req.params.id],
        (err, result) => {
            if (err) return res.send('Erro ao buscar cliente');
            res.render('editar_cliente', { cliente: result[0] });
        }
    );
});

// ================= SERVER =================
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});