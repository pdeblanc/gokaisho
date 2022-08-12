To start the app, run:

```
npm install

npm start
```

This app is about guessing miai values, defined here: https://senseis.xmp.net/?miaivalue

You will be shown a board with a move indicated.
Type a number (your guess at the move value) and press enter (or click the button).

Note that miai values tend to be about 1/2 of deiri values, which may be more familiar to some players.

Examples:

```
Move                                                 Deiri value    Miai value
Fill dame                                            0              0
Surround 1 point of territory                        1              0.5
Surround a stone, thus gaining 1 point of territory  2              1
Gain 1 territory while reducing opp. territory by 1  2              1
Play the first move of the game at 3-4               ~26            ~13 (6.5 komi times 2)
```

In this application the miai is desired. Please be careful.


Right now no feedback is provided.
However, your answers will be stored in `data/attempts.jsonl`, along with the correct answers.
So you may inspect this file to get some feedback.
