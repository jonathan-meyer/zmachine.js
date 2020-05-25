const log = require("debug")("zmachine.cpu");

class CPU {
  constructor(socket) {
    socket
      .on("input", (args, cb) => {
        log({ args });
        cb("you are now lost in the forest");
      })
      .emit("getScreenCharacters", ([w, h]) => {
        log("getScreenCharacters", { w, h });
      })
      .emit("showStatusBar", "test", 1, 1)
      .emit("showString", "Hello this is a test line");
  }

  start(story) {
    log("start story:", story);
  }
}

module.exports = CPU;
