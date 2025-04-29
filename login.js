document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    fetch('https://sheetdb.io/api/v1/9lbrxfr2n91uk')
        .then(response => response.json())
        .then(usuarios => {
            const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                // Salva o nome da empresa no localStorage
                localStorage.setItem('empresa', usuarioEncontrado.empresa);

                // Redireciona para o dashboard
                window.location.href = "/dashboard.html";
            } else {
                alert("Email ou senha inválidos.");
            }
        })
        .catch(error => console.error("Erro ao buscar usuários:", error));
});
