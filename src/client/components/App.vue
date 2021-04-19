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
        v-else-if="hasWord"
        :class="wordClasses"
      >
        {{ word }}
      </span>
      <div
        v-else-if="hasWords"
        id="words"
      >
        <span>
          <span class="arrow">←</span>
          {{ words[0] }}
        </span>
        <span>
          {{ words[1] }}
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
      word: null,
      words: null,
      swipeDirection: null,
      isFetchingWord: false,
      minimumColorDuration: 500,
    };
  },
  computed: {
    hasError() {
      return this.errorMessage !== null;
    },
    hasWord() {
      return this.word !== null;
    },
    hasWords() {
      return this.words !== null;
    },
    wordClasses() {
      return {
        accepting: this.isAccepting,
        rejecting: this.isRejecting,
      };
    },
    isAccepting() {
      return this.swipeDirection === 'right';
    },
    isRejecting() {
      return this.swipeDirection === 'left';
    },
    isSwiping() {
      return this.swipeDirection !== null;
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
        fetchNextWordOrWords(),
        this.isAccepting ? acceptWord(this.word) : Promise.resolve(),
        bluebird.delay(this.minimumColorDuration),
      ])
        .then(([nextWordOrWords]) => {
          this.setWordOrWords(nextWordOrWords);
          this.swipeDirection = null;
        });
    },
    setWordOrWords(nextWordOrWords) {
      if (Array.isArray(nextWordOrWords)) {
        this.word = null;
        this.words = nextWordOrWords;
      } else {
        this.word = nextWordOrWords;
        this.words = null;
      }
    },
  },
};
</script>
