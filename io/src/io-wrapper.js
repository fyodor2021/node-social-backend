import { Server } from 'socket.io';

class IoWrapper {
  #io;

  get io() {
    return this.#io;
  }
  async connect(server, options) {
    if (this.#io) {
      return;
    }

    this.#io = new Server(server, options);
    
  }
}

export const ioWrapper = new IoWrapper();
