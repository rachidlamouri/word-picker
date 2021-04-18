<template>
  <div
    id="app-container"
    v-touch:swipe.left="rejectWord"
    v-touch:swipe.right="acceptWord"
  >
    <h1>Word Picker</h1>
    <div id="word-container">
      <span
        id="word"
        :class="colorClasses"
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
      colorClass: null,
      swipeState: null,
      colorTimeout: 500,
    };
  },
  computed: {
    colorClasses() {
      return this.swipeState === null
        ? []
        : [this.swipeState];
    },
  },
  watch: {
    swipeState(newState) {
      if (newState === null) {
        this.nextWord();
      }
    },
  },
  mounted() {
    this.nextWord();
  },
  methods: {
    acceptWord() {
      console.log(this.swipeState)
      if (this.swipeState !== null) {
        return;
      }

      axios.post('/accepted', { word: this.word });
      this.setSwipeState('accepting');
    },
    rejectWord() {
      if (this.swipeState !== null) {
        return;
      }

      this.setSwipeState('rejecting');
    },
    nextWord() {
      axios.get('/word')
        .then((response) => {
          this.word = response.data;
        });
    },
    setSwipeState(swipeState) {
      this.swipeState = swipeState;
      setTimeout(
        () => { this.swipeState = null; },
        this.colorTimeout,
      );
    },
  },
};
</script>
