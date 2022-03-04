# Blackjack Trivia
***
>Love Blackjack and Trivia?  Well you're in the right place.  

Blackjack Trivia is a game app that combines the fun of Blackjack, with the excitement of answering trivia questions.  Along with the base Blackjack bet, you can also place 6 different side bets, to add some extra spice to the game.  The game also comes with a variety of settings, in order to customize your Blackjack experience.

# Play the Game Right Now
***
Blackjack Trivia is live right now.  Visit https://blackjack-trivia.netlify.app to play the game.

# Game Rules and Documentation
***
Blackjack Trivia is fully documented.  The game is accessible to both new and experienced players of Blackjack.  

If you're brand new to Blackjack, the documentation includes the complete rules for the game.  

If you're an experienced Blackjack player, you can visit the sections of the documentation that are new to you such as: the instructions for game controls, trivia section, side bets section and options menu.

You can read the documentation in a variety of ways:

- You can read the ["Documentation"](https://blackjack-trivia.app/docs/#/) online by clicking the link.  
- You can also visit the documentation at anytime while playing the game, by clicking on the `Rules` button at the top of the screen.  
- Finally, the raw documentation files are stored in the `/docs` folder in the repository.

# Development
***

### Installation

You can download the code to your computer:
````
# Clone the repository
$ git clone https://github.com/Dubosej1/blackjack-trivia

# Go to directory
$ cd blackjack-trivia

# Install dependencies (see dependencies section below)
$ npm install
````

## Built With
- Sass: a CSS Preprocessor
- JEST: a great JavaScript testing framework
- popbox.js: a JavaScript based modal management library

## Dependencies

Blackjack Trivia uses JEST for testing and Sass for styling and rendering CSS.  

### JEST (Testing)

JEST will be installed via `npm install` in the above section.  Right now, there are no active testing files, but the capability is there.

### Sass (CSS styling)

If you want to use Sass, you will need to install it on your computer.  You can do so via `npm install sass`.

The Sass file is located in `sass/main.scss`.  The file will need to be compiled to the CSS file before you can render.  You can do that by running the script: `npm run compile:sass`.  The `-watch` flag is active, so you can continually make changes and have it render automatically, until you stop the script via `^C`.

## Libraries

Blackjack Trivia uses modals extensively, in order to show the user info.  The app uses the `popbox.js` library in order to manage the opening and closing of the modals (the modals themselves are created in HTML).  The necessary files are already included in the repository and nothing extra needs to be done with them.  For info on its usage, you can visit the ["popbox.js"](https://github.com/oncebot/popbox.js/) link.

# Contribute
***

#### Bugs Reports and Feature Requests

Please use the ["issue tracker"](https://github.com/Dubosej1/blackjack-trivia/issues) to report any bugs or file feature requests.



# Thanks
***

- Thanks to ["popbox.js"](https://github.com/oncebot/popbox.js/) for creating a wonderful library
