// 1. El cajón global (Memoria del programa)
let nombreUsuarioActual = ""; 

// 2. Función que se activa al cargar la página
window.onload = function() {
    let loginInput = document.getElementById("userNameInput");

    loginInput.onkeydown = function(e) {
        if (e.key === "Enter") {
            let nombre = loginInput.value;
            if (nombre.trim() !== "") {
                nombreUsuarioActual = nombre; // Guardamos el nombre en el cajón
                entrarALaPlataforma(); // Quitamos la pantalla de login
            }
        }
    };
};

function entrarALaPlataforma() {
    // Escondemos el login
    document.getElementById("loginScreen").style.display = "none";
    // Mostramos el contenido principal (asegúrate de que tu feed tenga id="mainContent" o similar)
    document.getElementById("mainContent").style.visibility = "visible";
}
function addPost() {
    let input = document.getElementById("postInput");
    let text = input.value;
    if (text.trim() === "") return;

    let newPost = document.createElement("div");
    newPost.className = "post";
    newPost.style.cursor = "pointer";

    // --- 1. CONTENEDOR DE COMENTARIOS (ACORDEÓN) ---
    let commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-section";
    commentsContainer.style.display = "none"; // Oculto por defecto
    commentsContainer.style.marginTop = "15px";

    // --- 2. INPUT DE RESPUESTA (SIEMPRE EN PRIMERA FILA) ---
    let writingInput = document.createElement("input");
    writingInput.placeholder = "Type and press Enter...";
    writingInput.className = "reply-input"; 
    writingInput.style.width = "90%";
    writingInput.style.margin = "10px 0";

    // Lógica para enviar comentario
    writingInput.onkeydown = function(e) {
        if (e.key === "Enter") {
            let valor = writingInput.value;
            if (valor.trim() !== "") {
                crearComentario(valor, true); // true indica que es del usuario actual
                writingInput.value = ""; // No desaparece, solo se limpia
            }
        }
    };

    // Agregamos el input al inicio del contenedor
    commentsContainer.appendChild(writingInput);

    // --- 3. FUNCIÓN PARA CREAR COMENTARIOS CON BOTONES DINÁMICOS ---
    function crearComentario(contenido, esUsuarioActual = false) {
        let comment = document.createElement("div");
        comment.className = "comment";
        comment.style.borderLeft = "2px solid #ddd";
        comment.style.margin = "10px 0 10px 20px";
        comment.style.padding = "5px 10px";

        let userLabel = esUsuarioActual ? "Tú" : "USR";
        let meta = document.createElement("div");
        meta.innerHTML = `<strong>${userLabel}</strong> <small style="color: gray;">${new Date().toLocaleString()}</small>`;
        
        let body = document.createElement("p");
        body.textContent = contenido;
        body.style.margin = "5px 0";

        // Contenedor de Controles (Solo visibles al pasar el mouse)
        let cControls = document.createElement("div");
        cControls.style.visibility = "hidden";

        // Botón Like (+)
        let cLikeBtn = document.createElement("button");
        let cCount = 0;
        cLikeBtn.textContent = "+ 0";
        cLikeBtn.onclick = (e) => { e.stopPropagation(); cCount++; cLikeBtn.textContent = "+ " + cCount; };

        // Botón Delta (∆) - Sistema de Verdad/Falso
        let deltaBtn = document.createElement("button");
        deltaBtn.textContent = "∆";
        let deltaState = 0; 
        deltaBtn.onclick = (e) => {
            e.stopPropagation();
            deltaState = (deltaState + 1) % 3;
            if (deltaState === 1) deltaBtn.style.color = "green"; // Verdadero
            else if (deltaState === 2) deltaBtn.style.color = "red";   // Falso
            else deltaBtn.style.color = ""; // Neutro
        };

        // Botón Borrar (•)
        let cDelBtn = document.createElement("button");
        cDelBtn.textContent = "•";
        cDelBtn.onclick = (e) => { e.stopPropagation(); comment.remove(); };

        cControls.append(cLikeBtn, deltaBtn, cDelBtn);
        comment.append(meta, body, cControls);

        // Mostrar botones al recorrer con el mouse
        comment.onmouseover = () => cControls.style.visibility = "visible";
        comment.onmouseout = () => cControls.style.visibility = "hidden";

        // Insertar después del input de escritura (Primera fila)
        writingInput.after(comment);
    }

    // --- 4. LÓGICA DE APERTURA/CIERRE DEL POST (ACORDEÓN) ---
    newPost.onclick = function(e) {
        // Si el clic es en un botón o input, no cerrar/abrir
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
        
        const isOpen = commentsContainer.style.display === "block";
        commentsContainer.style.display = isOpen ? "none" : "block";
    };

    // --- 5. ELEMENTOS DEL POST PRINCIPAL ---
    let username = document.createElement("strong");
    username.textContent = nombreUsuarioActual + " ";
    let time = document.createElement("small");
    time.textContent = new Date().toLocaleString();
    let postText = document.createElement("p");
    postText.textContent = text;
    
    let controls = document.createElement("div");
    let likeBtn = document.createElement("button");
    likeBtn.textContent = "+ 0";
    let count = 0;
    likeBtn.onclick = function(e) { e.stopPropagation(); count++; likeBtn.textContent = "+ " + count; };
    
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "•";
    deleteBtn.onclick = function(e) { e.stopPropagation(); newPost.remove(); };

    // Ensamblaje del Post
    newPost.appendChild(username);
    newPost.appendChild(time);
    newPost.appendChild(postText);
    controls.appendChild(likeBtn);
    controls.appendChild(deleteBtn);
    newPost.appendChild(controls);
    newPost.appendChild(commentsContainer);

    document.getElementById("feed").appendChild(newPost);
    input.value = "";
}