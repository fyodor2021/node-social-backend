import { createClient } from 'redis';

class RedisWrapper {
  #_client;

  get client() {
    return this.#_client;
  }
  async connect(url) {
    if (this.#_client) {
      return;
    }

    this.#_client = createClient({ url });

    this.#_client.on('error', (err) => {
      console.error(err);
    });
    await this.#_client.connect();
    console.log('connected to redis');
  }
}

export const redisWrapper = new RedisWrapper();
