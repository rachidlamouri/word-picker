<template>
  <div
    id="app-container"
    v-touch:swipe.left="nextWord"
    v-touch:swipe.right="acceptWord"
  >
    <h1>Word Picker</h1>
    <div id="word-container">
      <span id="word">
        {{ word }}
      </span>
    </div>
    <div id="footer" />
  </div>
</template>

<style lang="scss">
  $text: #333;

  * {
    color: $text;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  #app-container {
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
    };
  },
  mounted() {
    this.nextWord();
  },
  methods: {
    acceptWord() {
      axios.post('/accepted', { word: this.word });
      this.nextWord();
    },
    nextWord() {
      axios.get('/word')
        .then((response) => {
          this.word = response.data;
        });
    },
  },
};
</script>
