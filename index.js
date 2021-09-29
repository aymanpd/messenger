// mongoose
require("./mongoose");
// passport
require("./users/auth/jwt");
require("./users/auth/google");
//server
const express = require("express");
const { serverInit, ioInit } = require("./server");

const app = express();
const server = serverInit(app);
const io = ioInit(server);

server.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
