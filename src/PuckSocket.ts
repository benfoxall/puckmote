import Puck from './puck.js'

// Puck.debug = 3;

enum State {
  OPENING = 'opening',
  OPEN = 'open',
  FAILED = 'failed',
  CLOSING = 'closing',
  CLOSED = 'closed'
}

export class PuckSocket extends EventTarget {
  public state = State.OPENING;

  private connection: any;

  constructor() {
    super();

    this.init();
  }

  async init() {
    this.connection = await new Promise(Puck.connect)

    if (!this.connection) {
      this.state = State.FAILED;
      this.dispatchEvent(new Event('error'))

    } else {

      if (this.connection.isOpen) {
        this.state = State.OPEN;
        this.dispatchEvent(new Event('open'))
      }

      this.connection.on('open', () => {
        this.state = State.OPEN;
        this.dispatchEvent(new Event('open'))
      })

      this.connection.on('close', () => {
        this.state = State.CLOSED;
        this.connection = null;
        this.dispatchEvent(new CloseEvent('close'))
      })

      this.connection.on('data', (data: any) => {
        this.dispatchEvent(new MessageEvent('data', { data }))
      })
    }
  }

  close() {
    this.connection.close();
    this.state = State.CLOSING;
  }

  send(value: string) {
    return new Promise(resolve => this.connection.write(value, resolve))// doesn't seem to work
  }
}


class Defer {
  resolve: (value: any) => void;
  reject: (err: any) => void;
  promise: Promise<any>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject
    })
  }

}


export class PuckREPL {

  private socket = new PuckSocket();

  private queue?= [`
    reset();
    echo(0);

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
  `];

  constructor() {
    this.socket.addEventListener('open', () => {

      for (const message of this.queue) {
        this.socket.send(message)
      }

      delete this.queue;
    });

    let chunks = ''
    this.socket.addEventListener('data', (event: MessageEvent) => {
      chunks += event.data;

      const split = chunks.split('\r\n')
      while (split.length > 1) {
        this.handle(split.shift())
      }

      chunks = split[0]
    })
  }

  private handle(line: string) {
    try {
      const res = JSON.parse(atob(line))

      const resolver = this.resolvers.get(res.id);

      if (res.resolve) {
        resolver.resolve(res.resolve)
      } else {
        resolver.reject(res.reject || '???')
      }

      this.resolvers.delete(res.id);

    } catch (e) {
    }
  }

  private counter = 0;
  private resolvers = new Map<number, Defer>()

  async eval(expr: string) {
    let id = this.counter++;

    const defer = new Defer();
    this.resolvers.set(id, defer);

    const command = `rpc(${id}, "${btoa(expr)}", true)\n`

    if (this.queue) {
      this.queue.push(command)
    } else {
      this.socket.send(command)
    }

    return defer.promise
  }
}

// @ts-ignore
window.PuckREPL = PuckREPL;