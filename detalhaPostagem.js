document.addEventListener("DOMContentLoaded", () => {
    const autorSelect = document.getElementById("autor");
    const postagensDiv = document.getElementById("postagens");

    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(usuarios => {
            usuarios.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario.id;
                option.textContent = usuario.name;
                autorSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar autores:", error));

    autorSelect.addEventListener("change", () => {
        const autorId = autorSelect.value;
        postagensDiv.innerHTML = "";

        if (autorId) {
            fetch(`https://jsonplaceholder.typicode.com/posts?userId=${autorId}`)
                .then(response => response.json())
                .then(posts => {
                    posts.forEach(post => {
                        const postDiv = document.createElement("div");
                        postDiv.classList.add("postagem");

                        const titulo = document.createElement("h3");
                        titulo.textContent = post.title;
                        titulo.style.cursor = "pointer";
                        titulo.addEventListener("click", () => exibirPostCompleto(post.id, postDiv));

                        postDiv.appendChild(titulo);
                        postagensDiv.appendChild(postDiv);
                    });
                })
                .catch(error => console.error("Erro ao carregar postagens:", error));
        }
    });

    function exibirPostCompleto(postId, container) {
        if (container.querySelector(".conteudo")) {
            container.querySelector(".conteudo").remove();
            return;
        }

        const conteudoDiv = document.createElement("div");
        conteudoDiv.classList.add("conteudo");
        conteudoDiv.innerHTML = "<p>Carregando postagem e comentários...</p>";
        container.appendChild(conteudoDiv);

        Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(r => r.json()),
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then(r => r.json())
        ])
        .then(([post, comentarios]) => {
            conteudoDiv.innerHTML = `
                <p>${post.body}</p>
                <h4>Comentários:</h4>
            `;

            comentarios.forEach(comentario => {
                const comentarioDiv = document.createElement("div");
                comentarioDiv.classList.add("comentario");
                comentarioDiv.innerHTML = `
                    <strong>${comentario.name}</strong> (${comentario.email}):<br>
                    ${comentario.body}
                `;
                conteudoDiv.appendChild(comentarioDiv);
            });
        })
        .catch(error => {
            conteudoDiv.innerHTML = "<p>Erro ao carregar conteúdo.</p>";
            console.error(error);
        });
    }
});
