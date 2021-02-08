import Puck from "./puck.js";
var State;
(function(State2) {
  State2["OPENING"] = "opening";
  State2["OPEN"] = "open";
  State2["FAILED"] = "failed";
  State2["CLOSING"] = "closing";
  State2["CLOSED"] = "closed";
})(State || (State = {}));
export class PuckSocket extends EventTarget {
  constructor() {
    super();
    this.state = State.OPENING;
    this.init();
  }
  async init() {
    this.connection = await new Promise(Puck.connect);
    if (!this.connection) {
      this.state = State.FAILED;
      this.dispatchEvent(new Event("error"));
    } else {
      if (this.connection.isOpen) {
        this.state = State.OPEN;
        this.dispatchEvent(new Event("open"));
      }
      this.connection.on("open", () => {
        this.state = State.OPEN;
        this.dispatchEvent(new Event("open"));
      });
      this.connection.on("close", () => {
        this.state = State.CLOSED;
        this.connection = null;
        this.dispatchEvent(new CloseEvent("close"));
      });
      this.connection.on("data", (data) => {
        this.dispatchEvent(new MessageEvent("data", {data}));
      });
    }
  }
  close() {
    this.connection.close();
    this.state = State.CLOSING;
  }
  send(value) {
    return new Promise((resolve) => this.connection.write(value, resolve));
  }
}
class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
export class PuckREPL {
  constructor() {
    this.socket = new PuckSocket();
    this.queue = [`
    reset();
    echo(0);

    LED3.set();

    function reply(ob) {
      Bluetooth.println(
        btoa(JSON.stringify(ob))
      );
    }
    
    function rpc(id, str) {
      const code = atob(str);

      try {
        const result = eval(code);
    
        Promise.resolve(result)
          .then(
            result => reply({id: id, resolve: result}),
            err => reply({id: id, reject: err})
          );
      } catch (err) {
        reply({id: id, reject: err});
      }
    }

    LED3.reset();
  `];
    this.counter = 0;
    this.resolvers = new Map();
    this.socket.addEventListener("open", () => {
      for (const message of this.queue) {
        this.socket.send(message);
      }
      delete this.queue;
    });
    let chunks = "";
    this.socket.addEventListener("data", (event) => {
      chunks += event.data;
      const split = chunks.split("\r\n");
      while (split.length > 1) {
        this.handle(split.shift());
      }
      chunks = split[0];
    });
  }
  handle(line) {
    try {
      const res = JSON.parse(atob(line));
      const resolver = this.resolvers.get(res.id);
      if (res.reject) {
        resolver.reject(res.reject);
      } else {
        resolver.resolve(res.resolve);
      }
      this.resolvers.delete(res.id);
    } catch (e) {
    }
  }
  async eval(expr) {
    let id = this.counter++;
    const defer = new Defer();
    this.resolvers.set(id, defer);
    const command = `rpc(${id}, "${btoa(expr)}", true)
`;
    if (this.queue) {
      this.queue.push(command);
    } else {
      if (this.socket.state === State.OPEN) {
        this.socket.send(command);
      } else {
        throw new Error("Puck not in open state");
      }
    }
    return defer.promise;
  }
  close() {
    if (this.socket)
      this.socket.close();
  }
}
window.PuckREPL = PuckREPL;
