const FileManager = require('./fileManager');

class AcceptedManager extends FileManager {
  constructor() {
    super('accepted', []);
  }

  add(word) {
    this.data.push(word);
    this.save();
  }
}

module.exports = new AcceptedManager();
