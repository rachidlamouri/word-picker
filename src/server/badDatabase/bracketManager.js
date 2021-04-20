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

  hasWord(word) {
    return this.wordA === word || this.wordB === word;
  }

  applyVote(userId, word) {
    if (!this.hasWord(word)) {
      throw Error(`Can't vote "${word}" for pair [${this.wordA}, ${this.wordB}]!`);
    }

    if (this.hasVoted(userId)) {
      throw Error(`Already voted on pair [${this.wordA}, ${this.wordB}]!`);
    }

    this.votes[userId] = word;
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

  findFirstPairNotVotedOn(userId) {
    return this.data.find((wordPair) => !wordPair.hasVoted(userId)) || null;
  }

  findFirstTupleNotVotedOn(userId) {
    const firstPairNotVotedOn = this.findFirstPairNotVotedOn(userId);

    return firstPairNotVotedOn === null
      ? null
      : firstPairNotVotedOn.getWordTuple();
  }

  applyVote(userId, word) {
    const firstPairNotVotedOn = this.findFirstPairNotVotedOn(userId);

    if (firstPairNotVotedOn === null) {
      throw Error('All votes done!');
    }

    firstPairNotVotedOn.applyVote(userId, word);
    this.save();
  }
}

module.exports = new BracketManager();
