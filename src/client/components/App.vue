<template>
  <div
    id="app-container"
    v-touch:swipe.left="onSwipeLeft"
    v-touch:swipe.right="onSwipeRight"
  >
    <h1>Word Picker</h1>
    <div id="word-container">
      <span
        id="word"
        :class="wordClasses"
      >
        {{ word }}
      </span>
    </div>
    <div id="footer" />
  </div>
</template>

<style lang="scss">
  $background: #fafafa;
  $text: #333;
  $bad: #f78e69;
  $good: #1bbee2;

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

      #word {
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

  #word-container {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    width: 100%;
  }

  #word {
    font-size: 24px,
  }
</style>>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      word: '',
      swipeState: null,
      isFetchingWord: false,
      isInMinimumColorDuration: false,
      minimumColorDuration: 500,
    };
  },
  computed: {
    isSwiping() {
      return this.swipeState !== null && (this.isInMinimumColorDuration || this.isFetchingWord);
    },
    wordClasses() {
      return this.isSwiping ? [this.swipeState] : [];
    },
  },
  async mounted() {
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
      this.word = nextWord;
    },
    resetSwipeState() {
      this.swipeState = null;
    },
  },
};
</script>
