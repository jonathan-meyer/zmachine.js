const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { CPU } = require("../zmachine");

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    logLevel: "warn",
    publicPath,
    silent: true,
    stats: "errors-only",
  });
}

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("dist"));

if (isProd) {
} else {
  const webpackConfig = require("../../webpack.dev.config");
  const compiler = webpack(webpackConfig);

  app.use(createWebpackMiddleware(compiler, webpackConfig.output.publicPath));
  app.use(webpackHotMiddleware(compiler));
}

io.of("/zvm").on("connect", (socket) => {
  console.log("[connected /zvm]");

  new CPU(
    socket.on("disconnect", () => {
      console.log("[disconnected /zvm]");
    })
  ).start("./stories/minizork.z3");
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
