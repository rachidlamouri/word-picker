const FileManager = require('./fileManager');

class AcceptedManager extends FileManager {
  constructor() {
    super('accepted', {});
  }

  add(userId, word) {
    if (!this.data[userId]) {
      this.data[userId] = [];
    }

    this.data[userId].push(word);
    this.save();
  }

  getAcceptedCount(userId) {
    return this.getAcceptedWords(userId).length;
  }

  getAcceptedWords(userId) {
    return (this.data[userId] || []);
  }
}

module.exports = new AcceptedManager();
