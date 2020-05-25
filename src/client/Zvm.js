import React, { useRef, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Terminal from "react-console-emulator";

import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

function Zvm() {
  const term = useRef(null);

  const [socket, setSocket] = useState();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [statusBar, setStatusBar] = useState({
    status: "",
    score: 0,
    turns: 0,
    timed: false,
  });

  useEffect(() => {
    setSocket(socketIOClient("/zvm", { autoConnect: false }));
  }, []);

  useEffect(() => {
    socket &&
      socket
        .on("connect", () => {
          setConnected(true);
          setError("");
        })
        .on("disconnect", () => {
          setConnected(false);
          setError("");
        })
        .on("error", (data) => {
          setError(data);
        })
        .on("text", (text) => {})

        .on("fatal", (err) => {
          setError(err);
        })
        .on("initialize", (version) => {
          console.log("init", version);
        })
        .on("setTerminatingCharacters", (chars) => {
          console.log("term chars", chars);
        })

        .on("hasStatusLine", (cb) => {
          cb(true);
        })
        .on("hasUpperWindow", (cb) => {
          cb(true);
        })
        .on("defaultFontProportional", (cb) => {
          cb(true);
        })
        .on("hasColors", (cb) => {
          cb(true);
        })
        .on("hasBoldface", (cb) => {
          cb(true);
        })
        .on("hasItalic", (cb) => {
          cb(true);
        })
        .on("hasFixedWidth", (cb) => {
          cb(true);
        })
        .on("hasTimedInput", (cb) => {
          cb(true);
        })

        .on("getScreenCharacters", (cb) => {
          cb([10, 10]);
        })
        .on("getScreenUnits", (cb) => {
          cb([10, 10]);
        })
        .on("getWindowSize", (cb) => {
          cb([10, 10]);
        })
        .on("getFontSize", (cb) => {
          cb([10, 10]);
        })

        .on("setTextStyle", (style) => {})
        .on("setFont", (font) => {})

        .on("getDefaultForeground", (cb) => {
          cb(0);
        })
        .on("getDefaultBackground", (cb) => {
          cb(0);
        })
        .on("setColor", (fg, bg) => {})

        .on("getCursorPosition", (cb) => {})
        .on("setCursorPosition", (x, y) => {})

        .on("showStatusBar", (status, score, turns, timed) => {
          setStatusBar({
            status: status || "",
            score: score || 0,
            turns: turns || 0,
            timed,
          });
        })
        .on("showString", (string) => {
          term.current.pushToStdout(string);
        })

        .on("splitScreen", (lines) => {})
        .on("setCurrentWindow", (window) => {})
        .on("eraseWindow", (window) => {})
        .on("scrollWindow", (lines) => {})
        .on("eraseLine", (line) => {})

        .on("readLine", (timeout, cb) => {
          console.log("[read line]");
        })
        .on("readChar", (timeout, cb) => {
          console.log("[read char]");
        })

        .on("getFilename", (title, suggested, save, cb) => {})

        .on("quit", () => {})
        .on("restart", () => {})

        .connect();
  }, [socket]);

  return (
    <Card>
      <Card.Header>
        <h1>Zork Virtual Machine</h1>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <InputGroup className="mb-3">
          <Form.Control readOnly value={statusBar.status}></Form.Control>
          <InputGroup.Append>
            <InputGroup.Text>Score: {statusBar.score}</InputGroup.Text>
            <InputGroup.Text>Turns: {statusBar.turns}</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <Terminal
          className="mb-3"
          ref={term}
          commands={{}}
          commandCallback={({ command, args }) => {
            socket.emit("lineRead", [command, ...args]);
          }}
          welcomeMessage={""}
          errorText={" "}
          promptLabel={">"}
          noDefaults={true}
          autoFocus={true}
        />
        <Alert variant={connected ? "success" : "primary"}>
          Connected: {connected ? "True" : "False"}
        </Alert>
      </Card.Body>
      <Card.Footer>Copyright &copy; 2020</Card.Footer>
    </Card>
  );
}

export default Zvm;
