const socket = io();
let username;

/**
 * Prompts the user to enter their username and emits a "new-user" event to the server.
 */
Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa tu nombre de usuario.",
    inputValidator: (value) => {
        return !value && "Es obligatorio un nombre de usuario.";
    },
    allowOutsideClick: false,
}).then((result)=>{
    username = result.value;
    socket.emit("new-user", username);
});

/**
 * Listens for the "keyup" event on the chat input and sends a "chat-message" event to the server
 * when the "Enter" key is pressed, along with the username and message content.
 */
const chatInput = document.getElementById("chat-input");

chatInput.addEventListener("keyup", (ev)=>{
    if(ev.key === "Enter"){
        const inputMessage = chatInput.value;
        if(inputMessage.trim().length > 0){
            socket.emit("chat-message", {username, message: inputMessage});
            chatInput.value = "";
        }
    }
});

/**
 * Updates the messages panel with incoming chat messages.
 */
const messagesPanel = document.getElementById("messages-panel");

socket.on("messages", (data)=>{
    let messages = "";

    data.forEach((m) => {
        messages += `<b>${m.username}:</b>${m.message}</br>`;
    });
    messagesPanel.innerHTML = messages;
});

socket.on("new-user",(username)=>{
    Swal.fire({
        title: `${username} se ha unido al chat`,
        toast: true,
        position:"top-end"
    });
});
