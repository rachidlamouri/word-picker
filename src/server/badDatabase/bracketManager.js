const _ = require('lodash');
const FileManager = require('./fileManager');

class WordPair {
  constructor(data) {
    Object.assign(this, data);
  }

  static create([wordA, wordB]) {
    return new WordPair({
      wordA,
      wordB,
      votes: {},
    });
  }

  getWordTuple() {
    return [this.wordA, this.wordB];
  }

  hasVoted(userId) {
    return this.votes[userId] !== undefined;
  }
}

class BracketManager extends FileManager {
  constructor() {
    super('bracket', []);

    this.data = this.data.map((wordPair) => new WordPair(wordPair));
  }

  initialize(words) {
    const wordPairs = _.chunk(words, 2).map((wordTuple) => WordPair.create(wordTuple));

    this.data = wordPairs;
    this.save();
  }

  getPairCount() {
    return this.data.length;
  }

  findFirstTupleNotVotedOn(userId) {
    const firstPairNotVotedOn = this.data.find((wordPair) => !wordPair.hasVoted(userId));

    return firstPairNotVotedOn === undefined
      ? null
      : firstPairNotVotedOn.getWordTuple();
  }
}

module.exports = new BracketManager();
