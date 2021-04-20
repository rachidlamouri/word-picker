<template>
  <div
    id="app-container"
    v-touch:swipe.left="onSwipeLeft"
    v-touch:swipe.right="onSwipeRight"
  >
    <h1>Word Picker</h1>
    <div id="word-container">
      <span
        v-if="hasError"
        id="error-message"
      >
        {{ errorMessage }}
      </span>
      <span
        v-else-if="hasSingleWord"
        :class="singleWordClasses"
      >
        {{ singleWord }}
      </span>
      <div
        v-else-if="hasMultipleWords"
        id="words"
      >
        <span>
          <span class="arrow">←</span>
          <span :class="leftWordClasses">
            {{ leftWord }}
          </span>
        </span>
        <span>
          <span :class="rightWordClasses">
            {{ rightWord }}
          </span>
          <span class="arrow">→</span>
        </span>
      </div>
    </div>
    <div id="footer" />
  </div>
</template>

<style lang="scss">
  $background: #fafafa;
  $text: #333;
  $bad: #f78e69;
  $good: #1bbee2;
  $error: #a7c957;

  * {
    color: $text;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  body {
    margin: 0px;
  }

  #app-container {
    background-color: $background;
    display: grid;
    justify-items: center;
    width: 100%;
    height: 100%;
    grid-template:
      "title" 20%
      "word" auto
      "footer" 30%;
    grid-template-columns: auto;

    h1 {
      grid-area: title;
    }

    #word-container {
      grid-area: word;
      align-items: center;
      display: flex;
      flex: 1;
      justify-content: center;
      width: 100%;
      font-size: 24px;

      #error-message {
        color: $error;
      }

      #words {
        display: flex;
        flex-direction: column;

        > span:first-child {
          margin-right: 100px;
          margin-bottom: 10px;

          .arrow {
            margin-right: 10px;
          }
        }

        > span:last-child {
          text-align: right;
          margin-left: 100px;

          .arrow {
            margin-left: 10px;
          }
        }
      }

      span {
        &.accepting {
          color: $good;
        }

        &.rejecting {
          color: $bad;
        }
      }
    }

    #footer {
      grid-area: footer;
    }
  }
</style>>

<script>
import axios from 'axios';
import bluebird from 'bluebird';

const fetchNextWordOrWords = async () => {
  const response = await axios.get('/word');
  const wordOrWords = response.data;
  return wordOrWords;
};

const acceptWord = async (word) => {
  await axios.post('/accepted', { word });
};

export default {
  data() {
    return {
      errorMessage: null,
      wordOrWords: null,
      swipeDirection: null,
      isFetchingWord: false,
      minimumColorDuration: 500,
    };
  },
  computed: {
    hasSingleWord() {
      return typeof this.wordOrWords === 'string';
    },
    hasMultipleWords() {
      return Array.isArray(this.wordOrWords);
    },
    hasError() {
      return this.errorMessage !== null;
    },
    isSwiping() {
      return this.swipeDirection !== null;
    },
    isRejectingSingleWord() {
      return this.hasSingleWord && this.swipeDirection === 'left';
    },
    isAcceptingSingleWord() {
      return this.hasSingleWord && this.swipeDirection === 'right';
    },
    isAcceptingLeftWord() {
      return this.hasMultipleWords && this.swipeDirection === 'left';
    },
    isAcceptingRightWord() {
      return this.hasMultipleWords && this.swipeDirection === 'right';
    },
    singleWordClasses() {
      return {
        accepting: this.isAcceptingSingleWord,
        rejecting: this.isRejectingSingleWord,
      };
    },
    leftWordClasses() {
      return {
        accepting: this.isAcceptingLeftWord,
      };
    },
    rightWordClasses() {
      return {
        accepting: this.isAcceptingRightWord,
      };
    },
    singleWord() {
      return this.hasSingleWord ? this.wordOrWords : null;
    },
    leftWord() {
      return this.hasMultipleWords ? this.wordOrWords[0] : null;
    },
    rightWord() {
      return this.hasMultipleWords ? this.wordOrWords[1] : null;
    },
    wordToAccept() {
      switch (true) {
        case this.isAcceptingSingleWord: return this.singleWord;
        case this.isAcceptingLeftWord: return this.leftWord;
        case this.isAcceptingRightWord: return this.rightWord;
        default: return null;
      }
    },
    isAcceptingAWord() {
      return this.wordToAccept !== null;
    },
  },
  async mounted() {
    axios.interceptors.response.use(
      undefined,
      (error) => {
        this.errorMessage = error.response.data;

        return Promise.reject(error);
      },
    );

    const nextWordOrWords = await fetchNextWordOrWords();
    this.setWordOrWords(nextWordOrWords);
  },
  methods: {
    onSwipeRight() {
      this.onSwipe('right');
    },
    onSwipeLeft() {
      this.onSwipe('left');
    },
    onSwipe(swipeDirection) {
      if (this.isSwiping) {
        return;
      }

      this.swipeDirection = swipeDirection;

      Promise.all([
        (this.isAcceptingAWord ? acceptWord(this.wordToAccept) : Promise.resolve())
          .then(() => fetchNextWordOrWords()),
        bluebird.delay(this.minimumColorDuration),
      ])
        .then(([nextWordOrWords]) => {
          this.setWordOrWords(nextWordOrWords);
          this.swipeDirection = null;
        });
    },
    setWordOrWords(nextWordOrWords) {
      this.wordOrWords = nextWordOrWords;
    },
  },
};
</script>
