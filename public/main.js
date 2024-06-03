(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
        alert("Введите ваш псевдоним");
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");

      // Запрашиваем сохраненные сообщения с сервера
      fetch("/messages")
        .then((response) => response.json())
        .then((messages) => {
          messages.forEach((message) => {
            if (message.username && message.message) {
              renderMessage("other", {
                username: message.username,
                text: message.message,
              });
            }
          });
        })
        .catch((err) => {
          console.error("Ошибка загрузки сообщений:", err);
        });
    });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      const messageObj = {
        username: uname,
        text: message,
      };
      renderMessage("my", messageObj);
      socket.emit("chat", messageObj);
      app.querySelector(".chat-screen #message-input").value = "";
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  socket.on("chat", function (message) {
    if (message.username && message.text) {
      renderMessage("other", message);
    } else {
      console.error("Сообщения получены в плохом формате:", message);
    }
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
            <div>
                <div class="name">Вы</div>
                <div class="text">${message.text}</div>
            </div>
        `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
        `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
