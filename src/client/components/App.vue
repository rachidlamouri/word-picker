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

export default {
  data() {
    return {
      errorMessage: null,
      word: null,
      words: null,
      swipeState: null,
      isFetchingWord: false,
      isInMinimumColorDuration: false,
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
    isSwiping() {
      return this.swipeState !== null && (this.isInMinimumColorDuration || this.isFetchingWord);
    },
    wordClasses() {
      return this.isSwiping ? [this.swipeState] : [];
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

    const nextWord = await this.fetchNextWord();
    this.setWord(nextWord);
  },
  methods: {
    onSwipeRight() {
      if (!this.isSwiping) {
        this.acceptWord();
        this.onSwipe();
      }
    },
    acceptWord() {
      axios.post('/accepted', { word: this.word });
      this.swipeState = 'accepting';
    },
    onSwipeLeft() {
      if (!this.isSwiping) {
        this.rejectWord();
        this.onSwipe();
      }
    },
    rejectWord() {
      this.swipeState = 'rejecting';
    },
    async fetchNextWord() {
      this.isFetchingWord = true;
      const response = await axios.get('/word');
      this.isFetchingWord = false;
      const word = response.data;
      return word;
    },
    pulseMinimumColorDuration() {
      this.isInMinimumColorDuration = true;
      return new Promise((resolve) => {
        setTimeout(
          () => {
            this.isInMinimumColorDuration = false;
            resolve();
          },
          this.minimumColorDuration,
        );
      });
    },
    onSwipe() {
      Promise.all([
        this.fetchNextWord(),
        this.pulseMinimumColorDuration(),
      ])
        .then(([nextWord]) => {
          this.setWord(nextWord);
          this.resetSwipeState();
        });
    },
    setWord(nextWord) {
      if (Array.isArray(nextWord)) {
        this.word = null;
        this.words = nextWord;
      } else {
        this.word = nextWord;
        this.words = null;
      }
    },
    resetSwipeState() {
      this.swipeState = null;
    },
  },
};
</script>
