document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos das abas e do menu
  const indicarClientesTab = document.getElementById("formIndicarClientes");
  const minhasIndicacoesTab = document.getElementById("minhasIndicacoesTab");
  const indicarClientesLink = document.getElementById("indicarClientes");
  const minhasIndicacoesLink = document.getElementById("minhasIndicacoes");

  // Exibe a aba de "Indicar Clientes" por padrão
  indicarClientesTab.style.display = "block";
  minhasIndicacoesTab.style.display = "none";

  // Lógica para alternar entre as abas
  indicarClientesLink.addEventListener("click", function () {
    indicarClientesTab.style.display = "block";
    minhasIndicacoesTab.style.display = "none";
  });

  minhasIndicacoesLink.addEventListener("click", function () {
    indicarClientesTab.style.display = "none";
    minhasIndicacoesTab.style.display = "block";
    carregarMinhasIndicacoes(); // Carrega as indicações na aba Minhas Indicações
  });

  // Recupera o nome da empresa armazenado no login
  const nomeEmpresa = localStorage.getItem("empresa") || "Empresa não encontrada";

  // Função para carregar as indicações da planilha
  function carregarMinhasIndicacoes() {
    fetch('https://sheetdb.io/api/v1/tna8nw65xufqg') // URL da sua planilha
      .then(response => response.json())
      .then(data => {
        const tabela = document.getElementById("indicacoesTable").getElementsByTagName('tbody')[0];
        tabela.innerHTML = ''; // Limpa a tabela antes de inserir novas linhas

        // Filtrar as indicações pelo nome da empresa
        const minhasIndicacoes = data.filter(indicacao => indicacao.empresa === nomeEmpresa);

        minhasIndicacoes.forEach(indicacao => {
          const row = tabela.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3); // Nova célula para empresa

          cell1.textContent = indicacao.cliente || "";
          cell2.textContent = indicacao.email || "";
          cell3.textContent = indicacao.telefone || "";
          cell4.textContent = indicacao.empresa || "";
        });
      })
      .catch(error => console.error("Erro ao carregar as indicações:", error));
  }

  // Lógica para enviar nova indicação
  document.getElementById("formIndicar").addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeCliente = document.getElementById("clienteNome").value;
    const emailCliente = document.getElementById("clienteEmail").value;
    const telefoneCliente = document.getElementById("clienteTelefone").value;

    const dadosIndicacao = {
      cliente: nomeCliente,
      email: emailCliente,
      telefone: telefoneCliente,
      empresa: nomeEmpresa
    };

    fetch('https://sheetdb.io/api/v1/tna8nw65xufqg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([dadosIndicacao])
    })
    .then(response => {
      if (response.ok) {
        alert('Indicação enviada com sucesso!');
        document.getElementById("formIndicar").reset();
      } else {
        alert('Erro ao enviar a indicação.');
      }
    })
    .catch(error => console.error("Erro ao enviar a indicação:", error));
  });

  // Botão de logoff (opcional)
  document.getElementById("logoffButton").addEventListener("click", function () {
    localStorage.clear();
    window.location.href = "index.html";
  });
});
