const _ = require('lodash');

const getLetterCombinations = (list) => {
  if (list.length === 1) {
    return list;
  }

  return _.range(list.length)
    .map((index) => (
      [
        list[index],
        ...(index > 0 ? list.slice(0, index) : []),
        ...(index < list.length - 1 ? list.slice(index + 1, list.length) : []),
      ]
    ))
    .flatMap((idk) => {
      const [first, ...others] = idk;

      return getLetterCombinations(others).map((sublist) => [first, ...sublist]);
    });
};

const getWordPermutations = (text) => {
  const letters = text.split('');
  const combinations = getLetterCombinations(letters).map((wordLetters) => wordLetters.join(''));
  const permutations = _.uniq(combinations);
  return permutations;
};

module.exports = getWordPermutations;
