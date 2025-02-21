const Redis = require("redis");

class RedisDatabase {
  pass = process.env.REDIS_PASSWORD;
  url = process.env.REDIS_URL;
  port = process.env.REDIS_PORT;

  constructor() {
    this.client = Redis.createClient({
      url: `rediss://default:${this.pass}@${this.url}:${this.port}`,
      socket: {
        timeout: 10000,
      },
    });
    this.client.connect();
    this.client.ping();
  }

  async read() {
    const data = await this.client.get("db");
    return data ? JSON.parse(data) : [];
  }

  async write(data) {
    await this.client.set("db", JSON.stringify(data));
    return true;
  }

  async findAll() {
    return this.read();
  }

  async findById(id) {
    const data = await this.read();
    return data.find((item) => item.id === id);
  }

  async create(item) {
    const data = await this.read();
    try {
      let tmp = data.find((el) => el.id === item.id);
      console.log({ tmp });
      if (tmp && !!tmp.next) {
        console.log("already exists");
        return true;
      } else {
        data.push(item);
        return this.write(data);
      }
    } catch (error) {
      return false;
    }
  }

  async update(id, newData) {
    const data = await this.read();
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...newData };
      return this.write(data);
    }
    return false;
  }

  async delete(id) {
    const data = await this.read();
    const filtered = data.filter((item) => item.id !== id);
    return this.write(filtered);
  }
}

module.exports = RedisDatabase;
