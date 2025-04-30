document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio normal do formulário

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    fetch('https://sheetdb.io/api/v1/9lbrxfr2n91uk') // Substitua pelo link correto
        .then(response => response.json())
        .then(usuarios => {
            // Busca o usuário que corresponde ao email e senha fornecidos
            const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                // Salva o nome da empresa e outras informações no localStorage
                localStorage.setItem('empresa', usuarioEncontrado.empresa);
                localStorage.setItem('nome', usuarioEncontrado.nome); // Adicionando o nome do usuário (opcional)

                // Redireciona para o dashboard
                window.location.href = "dashboard.html"; // Caminho relativo para o dashboard
            } else {
                alert("Email ou senha inválidos.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuários:", error);
            alert("Erro ao tentar fazer login.");
        });
});
