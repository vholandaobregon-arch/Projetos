document.addEventListener("DOMContentLoaded", () => {
    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById("cidade");
    const resultado = document.getElementById("resultado");

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(response => response.json())
        .then(estados => {
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            estados.forEach(estado => {
                const option = document.createElement("option");
                option.value = estado.sigla;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar estados:", error));

    estadoSelect.addEventListener("change", () => {
        const uf = estadoSelect.value;
        const estadoNome = estadoSelect.options[estadoSelect.selectedIndex].text;

        cidadeSelect.innerHTML = "";
        resultado.textContent = "";

        if (uf) {
            cidadeSelect.disabled = false;
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
                .then(response => response.json())
                .then(cidades => {
                    cidades.sort((a, b) => a.nome.localeCompare(b.nome));

                    cidades.forEach(cidade => {
                        const option = document.createElement("option");
                        option.value = cidade.nome;
                        option.textContent = cidade.nome;
                        cidadeSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Erro ao carregar cidades:", error));
        } else {
            cidadeSelect.disabled = true;
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Selecione um estado primeiro";
            cidadeSelect.appendChild(option);
        }
    });

    cidadeSelect.addEventListener("change", () => {
        const cidade = cidadeSelect.value;
        const estadoNome = estadoSelect.options[estadoSelect.selectedIndex].text;

        if (cidade) {
            resultado.textContent = `Você selecionou: ${cidade} - ${estadoNome}`;
        } else {
            resultado.textContent = "";
        }
    });
});
