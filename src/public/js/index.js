const socket = io();
console.log("index js");

const user = {
  username: "",
};

const chatbox = document.querySelector("#send-chat");
const buttonChatbox = document.querySelector("#send-button-chat");
const contenedorChat = document.querySelector("#contenedor-chat");

Swal.fire({
  input: "text",
  title: "Log in",
  text: "Necesitas un nombre para identificarte en el chat",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) return "Por favor ingresa un nombre";
  },
}).then((response) => {
  user.username = response.value;
  socket.emit("nueva-conexion", user.username);
});

chatbox.addEventListener("keyup", (event) => {
  const { value } = event.target;
  if (event.key === "Enter") {
    socket.emit("mensaje", {
      username: user.username,
      mensaje: value,
    });
    event.target.value = "";
  }
});

buttonChatbox.addEventListener("click", () => {
  if (chatbox.value) {
    socket.emit("mensaje", {
      username: user.username,
      mensaje: chatbox.value,
    });
    chatbox.value = "";
  }
});

socket.on("logs", (data) => {
  contenedorChat.innerHTML = "";
  console.log(data);
  data.forEach((chat) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <p>${chat.username}:</p>
        <span> <b> ${chat.mensaje} </b></span>
    `;
    contenedorChat.appendChild(div);
  });
});

socket.on("nueva-conexion", (userConectado) => {
  Toastify({
    text: `${userConectado} se ha conectado`,
    duration: 5000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
});
