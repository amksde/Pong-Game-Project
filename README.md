# Pong Game Project

## Project Components
### Layout

Our design included a **rectangular playing court** with 2 paddles, one controlled by the user using a **mouse** and the other moved by the computer itself. For the court, we used an HTML canvas element which we coloured black because it contrasted well with the red colored ball.

We also chose to give the user **different options for themes**, like Halloween, Tennis court, Classic table tennis court, Sea Shore etc.

A **timer** is also present so that a time bound match can take place. Since a human user is playing against a computer, a feature is also there which ensures that **computer has also a good chance of losing the game** (at high speeds of the ball).

### Design and Implementation
We used an **HTML canvas element** for designing the court and all the other elements too. A ball along with 2 rectangular paddles and a table net (with rectangular subparts) were all designed using the getContext(‘2d’) object of the canvas.

All the design specifications of the paddles, ball, and net are stored as Javascript objects which define their properties like dimensions, colors, position etc.

Different HTML **buttons** have been provided on the left hand side of the court to change the theme of the game as and when desired.

A **timer is present at the top of the screen**. The get-set-go timer of 3 seconds starts on the click of Start Game button (which is given below the court box), to give the user the time to be ready. Then a countdown timer starts for a time decided in the code (currently 15 seconds for demonstration purposes). setInterval and setTimeout methods have been used to implement the timer.

A **scoreboard** has been provided at the top of each column of the court which records the score of the players and displays them. The player with more score at the end of timer wins the game.

The whole game has been beautified with extensive CSS wherever required. Many elements have dynamic CSS which is changed by the Javascript code.

## Gameplay and Execution
When the game loads, a grey screen is presented to the player. He/She has the option to change the theme then and later on too.

* Clicking the Start Game button will present a black court with white paddles by default. The ball first goes towards the computer paddle. The human player controls his/her paddle with a mouse.

* If a player fails to hit the ball with the paddle, a point is given to the opponent. The speed of the ball keeps on increasing by an amount of 0.1 units everytime it hits the paddle.

* The player who has  the bigger score when the timer runs out is declared as winner. An alert message pops up letting the human player know whether they won, lost, or tied against the computer.
