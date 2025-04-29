const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const fetch = require('node-fetch'); // Instale 'node-fetch' para fazer requisições HTTP

const PORT = 3000;

// URLs das APIs do SheetDB para as planilhas de cadastro e indicações
const cadastroSheetURL = 'https://sheetdb.io/api/v1/9lbrxfr2n91uk'; // Planilha de cadastro
const indicacaoSheetURL = 'https://sheetdb.io/api/v1/tna8nw65xufqg'; // Planilha de indicações

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Definir o caminho do arquivo
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './login.html'; // Página principal é o login
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    // Se for POST para cadastro
    if (pathname === '/cadastro' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { nome, email, senha, cpf } = JSON.parse(body);

            // Enviar os dados para a planilha de cadastro
            const dadosCadastro = { nome, email, senha, cpf };
            fetch(cadastroSheetURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([dadosCadastro]),
            })
            .then(response => {
                if (response.ok) {
                    console.log('Cadastro enviado com sucesso');
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                } else {
                    res.writeHead(500);
                    res.end('Erro ao cadastrar');
                }
            })
            .catch(error => {
                console.error("Erro ao enviar os dados para a planilha de cadastro:", error);
                res.writeHead(500);
                res.end('Erro ao cadastrar');
            });
        });
        return;
    }

    // Se for POST para login
    if (pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Tentativa de login:', body);
            // Aqui você pode validar login se quiser
            res.writeHead(302, { 'Location': '/dashboard.html' });
            res.end();
        });
        return;
    }

    // Se for POST para indicar cliente
    if (pathname === '/indicar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { cliente, email, telefone, empresa } = JSON.parse(body);

            // Enviar os dados para a planilha de indicações
            const dadosIndicacao = { cliente, email, telefone, empresa };
            fetch(indicacaoSheetURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([dadosIndicacao]),
            })
            .then(response => {
                if (response.ok) {
                    console.log('Indicação enviada com sucesso');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Indicação enviada com sucesso!' }));
                } else {
                    res.writeHead(500);
                    res.end('Erro ao enviar a indicação');
                }
            })
            .catch(error => {
                console.error("Erro ao enviar os dados para a planilha de indicação:", error);
                res.writeHead(500);
                res.end('Erro ao enviar a indicação');
            });
        });
        return;
    }

    // Se for GET para Minhas Indicações (mostrar indicações)
    if (pathname === '/minhas-indicacoes' && req.method === 'GET') {
        fetch(indicacaoSheetURL)
            .then(response => response.json())
            .then(data => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            })
            .catch(error => {
                console.error("Erro ao carregar as indicações:", error);
                res.writeHead(500);
                res.end('Erro ao carregar as indicações');
            });
        return;
    }

    // Ler arquivos (html, css, js, imagens)
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', (err, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Erro interno do servidor: ' + error.code);
            }
        } else {
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
