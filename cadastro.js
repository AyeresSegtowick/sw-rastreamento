document.getElementById("cadastroForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio normal do formulário
  
  const nome = document.getElementById("nome").value;
  const empresa = document.getElementById("empresa").value;
  const cpfcnpj = document.getElementById("cpfcnpj").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  
  // Pega a data atual no formato "dd/mm/yyyy"
  const dataCadastro = new Date().toLocaleDateString("pt-BR");
  
  console.log("Dados a serem enviados:", { nome, empresa, cpfcnpj, email, senha, dataCadastro });

  // Cria o objeto de dados
  const dadosCadastro = {
    nome: nome,
    empresa: empresa,
    cpfcnpj: cpfcnpj,
    email: email,
    senha: senha,
    dataCadastro: dataCadastro
  };

  // Envia os dados para a planilha usando a API do SheetDB
  fetch('https://sheetdb.io/api/v1/9lbrxfr2n91uk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([dadosCadastro]) // Envia os dados como um array
  })
  .then(response => response.json())
  .then(data => {
    console.log("Resposta da planilha:", data); // Verifique a resposta
    if (data) {
      alert('Cadastro realizado com sucesso!');
      // Limpa o formulário após o envio
      document.getElementById("cadastroForm").reset();
      // Redireciona para a página de login
      window.location.href = "index.html"; // Redireciona para a página de login após cadastro
    } else {
      alert('Erro ao realizar o cadastro. Tente novamente.');
    }
  })
  .catch(error => {
    console.error('Erro ao enviar o cadastro:', error);
    alert('Erro ao realizar o cadastro. Tente novamente.');
  });
});
