# Word Picker

For pickin' words.

## Installation

```bash
# after cloning the repository
npm ci
```

## Configuring and Starting the Server

1. Clean the player data if necessary with `npm run clean:data`
1. Update [words.js](./src/server/words.js) to have the full list of words to choose from.
1. Update [config.js](./src/server/config.js)
    1. **userLimit**: How many players can connect
    1. **wordLimitPerUser**: How many words each player can select in the first phase of the game
1. Run `npm run start` to start the server on port `8080`

## How to Play

### Connecting

Each player should connect to the web server via a web browser.
The game is played on the root page `/`.
Players can go to `/ping` to verify the server is responding,
and they can go to `/userid` to debug their user id.

### Game Phase 1

In the first phase, players will be presented with a word, and they can swipe right to accept or left to reject the word.
Once a player reaches their word limit, the app will ask them to wait.
The last player to reach their word limit will see two words with arrows pointing left and right.
That player should notify the rest of the players to refresh their game.

### Game Phase 2

After all of the players reach their limit, the server will switch to phase 2.
In this phase, all of the selected words are arranged into a bracket.
Players are shown pairs of words and they need to swipe in the direction of the preferred word.
Each player has to vote on each pair of words in the current bracket.
When the last player has placed their last vote, they will be asked to notify the rest of the players to refresh.
This process continues until there is only one word left.

If there are an odd number of words, one word will get a bye.
If a pair of words gets the same number of votes, then both of those words will continue into the next round.
