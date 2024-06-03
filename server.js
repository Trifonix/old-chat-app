const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

// Подключение к БД
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Успешное подключение к БД...");
});

// Маршрут для получения сообщений
app.get("/messages", (req, res) => {
  const query = "SELECT username, message FROM messages ORDER BY timestamp";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Ошибка получения сообщений: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " зашел в чат");
  });

  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " вышел из чата");
  });

  socket.on("chat", function (message) {
    if (!message.username || !message.text) {
      console.error("Неправильный формат сообщения:", message);
      return;
    }

    // Сохраняем сообщение в БД
    const query = "INSERT INTO messages (username, message) VALUES (?, ?)";
    db.query(query, [message.username, message.text], (err, result) => {
      if (err) {
        console.error("Ошибка сохранения сообщения:", err);
        return;
      }
      console.log("Сообщение попало в БД");
    });

    socket.broadcast.emit("chat", message);
  });
});

server.listen(4242, () => {
  console.log("Сервер запущен, порт - 4242");
});
