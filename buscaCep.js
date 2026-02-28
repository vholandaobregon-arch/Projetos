document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("buscar");
    botao.addEventListener("click", buscarEndereco);
});

function buscarEndereco() {
    const cep = document.getElementById("cep").value.trim();
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "";

    if (!/^\d{8}$/.test(cep)) {
        resultado.innerHTML = "<span style='color: red;'>CEP inválido. Digite 8 números.</span>";
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                resultado.innerHTML = "<span style='color: red;'>CEP não encontrado.</span>";
            } else {
                resultado.innerHTML = `
                    <strong>Endereço:</strong><br>
                    Rua: ${data.logradouro || "N/A"}<br>
                    Bairro: ${data.bairro || "N/A"}<br>
                    Cidade: ${data.localidade}<br>
                    Estado: ${data.uf}
                `;
            }
        })
        .catch(error => {
            resultado.innerHTML = "<span style='color: red;'>Erro ao buscar o CEP. Tente novamente.</span>";
            console.error("Erro na requisição:", error);
        });
}
