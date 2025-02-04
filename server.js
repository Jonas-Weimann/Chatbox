import express from "express";
import VistasRoute from "./src/routes/vistas.router.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";

const app = express();

const serverHttp = app.listen(8080, () =>
  console.log("Server running on port 8080")
);
const socketsServer = new Server(serverHttp);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", VistasRoute);

const mensajesLogs = [];

socketsServer.on("connection", (socket) => {
  console.log("Nuevo dispositivo conectado!, se conecto --> ", socket.id);
  socket.on("mensaje", (data) => {
    console.log(data);
    mensajesLogs.push(data);
    socketsServer.emit("logs", mensajesLogs);
  });
  socket.on("nueva-conexion", (username) => {
    socket.broadcast.emit("nueva-conexion", username);
  });
});
