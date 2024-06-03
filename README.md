## Минималистичное приложение-чат

### Технологии:
- JavaScript
- Node
- Express
- Socket.io
- MySQL

### Для тестирования:

git clone ?

cd ?

npm i

#### SQL запрос для создания БД и таблицы с сообщениями пользователей

CREATE DATABASE chat_db;

USE chat_db;

CREATE TABLE messages (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

### Для запуска

node server.js

http://localhost:4242/