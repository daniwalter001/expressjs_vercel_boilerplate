const fs = require("fs");
const path = require("path");

class JsonDatabase {
  constructor() {
    this.filepath = path.join(process.cwd(), this.DB);
    this.initializeDb();
  }

  DB = "db.bin";

  initializeDb() {
    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, JSON.stringify([], null, 2));
    }
  }

  //create file if not exists
  createDBFile() {
    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, JSON.stringify([], null, 2));
    }
  }

  read() {
    this.createDBFile();
    const data = fs.readFileSync(this.filepath, "utf8");
    return JSON.parse(data);
  }

  write(data) {
    this.createDBFile();
    fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
    return true;
  }

  findAll() {
    this.createDBFile();
    return this.read();
  }

  findById(id) {
    this.createDBFile();
    const data = this.read();
    return data.find((item) => item.id === id);
  }

  create(item) {
    this.createDBFile();
    const data = this.read();
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
    return false;
  }

  update(id, newData) {
    this.createDBFile();
    const data = this.read();
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...newData };
      return this.write(data);
    }
    return false;
  }

  delete(id) {
    this.createDBFile();
    const data = this.read();
    const filtered = data.filter((item) => item.id !== id);
    return this.write(filtered);
  }
}

module.exports = JsonDatabase;
