![Milo Clicker Game Logo and Cover Image](https://raw.githubusercontent.com/sunnymui/milo-clicker/master/social-cover.jpg "A simple clicker game for people that like cats")

# Star Milo: A Cat Clicking Odyssey Game

Click Milo the cat to make MiloBucks, use your $ to buy upgrades, and spend all of your time clicking on a cat floating in space. Guaranteed to brighten your day! 

A simple webapp showcasing conditional game logic, scoring probability systems factoring in upgradeable player stats, object oriented methods, prototypal classing, and CSS animations since a game loop/game loop based animations aren't really necessary for a clicker game. The main app is written in plain Javascript wrapped in an anonymous immediately invoked function expression to keep the global namespace clear.

## How to Play

Play right now by clicking on the following link:
### [https://sunnymui.github.io/milo-clicker/](https://sunnymui.github.io/milo-clicker/)

Or you can just copy that link directly into your browser's address bar.

The goal of the game is to get as many MiloBucks (TM) as possible. You get MiloBucks by clicking on Milo the Cat who's just floating along in space. After a short intro animation, you'll reach the main game screen. Start clicking on Milo to make MiloBucks, then spend those MiloBucks on upgrades. Different upgrades increase your ability to make MiloBucks in different ways. You'll have to buy each upgrade in order to unlock the ability to buy other upgrades. Keep upgrading, clicking Milo, and making MiloBucks until your computer explodes or you get bored of the game (impossible).

### Developers

Alternatively, you can clone the repository to your computer using Github's Clone or Download button. Or navigate to the directory you want to download the repository into using your preferred Git command line utlity and enter the following (make sure you're connected to the internet):

`git clone https://github.com/sunnymui/milo-clicker.git`

Afterwards, you should have the repository for the Milo Clicker game. You can launch the game by opening `index.html` in your web browser.

## Editing or Making Changes

If you want to edit or extend this game, be my guest. 

### Game Logic Structure

All of the game logic is contained within `js/main.js`. That's the only file you'll need to make changes to.

The general structure is organized into a halfway MVC model that somewhat separates the data, data manipulation, interaction handling, and visual presentation, but doesn't strictly follow MVC. It's a smallish webapp so it works fine how it's organized. Structure as follows:

**Data Objects** - Contains raw data for UI text and paths to image assets. Edit to change text or images.

**Utlity Functions** - General functions for non-specialized use.

**UI Creation Functions (View)** - Generates the visual dom elements and appends it to the page.

**Player Class Constructor Functions (Model)** - Constructor function for the Player class the sets up a Player object, used to store and manipulate player data like number of clicks, upgrade levels, upgrades unlocked, click animations, etc. There's a lot of logic checks in the upgrade functions here to do things like making sure things unlock correctly, upgrades get applied to player stats, and visual changes get triggered. Note the `roll_for_click()` function that takes a player's critical chance into account and determines on every click if they trigger bonus points for their click. 

**Preloader Animation Function (View)** - Displays a little CSS based loading animation while all the assets are loaded and code executed for game setup, then switches to show the main game views.

**Game Initiation and Class Instantiation (Controller)** - Where the game functions get executed and code to build + display the game DOM elements is run.

**Intro Animation (View)** - A fairly simple collection of setTimeout callbacks that add CSS classes and DOM elements at specific times that, in combination with CSS animations, creating a simple Star Wars-esque opening crawl introductory game animation.

**Interaction Handling Functions (Controller)** - All the event listeners and their callbacks are here. This is what directs clicks on all the different elements to their appropriate sequences of callbacks.

### Image Assets

Image assets used in-game can be found within the `img` directory. Images used for the browser favicon or as cover image when being shared on social media are located in the main `milo-clicker` directory.

Upgrade tile images are sourced from here: [Super Game Asset](http://www.supergameasset.com/hero-skills-free-fantasy-rpg-series-game-asset.html)

## Build Tools

This project uses Grunt as final build tool for development:

  1. imagemin - compresses images
    a. imagemin-mozjpeg - specialized jpg compression plugin for imagemin
  2. responsive images - create multiple size images for responsive use
  3. uglify - minify and concatenate js
  4. cssmin - minify and concatenate css
  5. watch - watch files for changes and run relevant tasks
  
To rebuild the project after making changes to the code, you'll need to have NPM, Grunt, and the mentioned plugins installed. Details in gruntfile.js.

Once you're done editing, just use a command line utility and navigate to the milo-clicker directory. Enter the command `grunt` and it'll run the default build tasks:

  * Responsive image creation for the 2 large background imgs
  * Minify (compress) the images in the img folder
  * Concatenate/minify files in js folder into a single scripts.min.js file
  * Concatenate/minify files in css folder into a single style.min.css file

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
