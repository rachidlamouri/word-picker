const FileManager = require('./fileManager');

class UsersManager extends FileManager {
  constructor() {
    super('users', []);
  }

  add(userId) {
    this.data.push(userId);
    this.save();
  }

  has(userId) {
    return this.data.includes(userId);
  }

  getUserCount() {
    return this.data.length;
  }
}

module.exports = new UsersManager();
