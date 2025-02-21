const Redis = require('redis');

class RedisDatabase {
  constructor() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.client.connect();
  }

  async read() {
    const data = await this.client.get('db');
    return data ? JSON.parse(data) : [];
  }

  async write(data) {
    await this.client.set('db', JSON.stringify(data));
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
      if (tmp) {
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
