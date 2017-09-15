// milo clicker module in an anonymous closure to keep global scope clear
(function () {

  // get the dom elements to append to
  // the containing dom element to append ui elements to
  var ui_layer = document.queryBySelector('.ui');
  // the clickable image layer that'll generate clicks
  var click_layer = document.queryBySelector('.clickable');
  var assets = {
    milo_src: ''
  };
  var ui_text = {
    upgrades: {
      crit_chance: {
        title: '',
        description: ''
      }
    }
  };

  //=========================//
  //    Utility Functions    //
  //=========================//

  var util = {
    random_num_in_range: function(min, max) {
    /*
    Generates a random number that falls within the given range in the arguments.
    Range is inclusive of the min, exclusive of the max since Math.random is exclusive
    of the max of 1.
    Args: miniumum number the random number can be, max number that can be generated
    Return: a random number (floating point) in the range
    */
      return Math.random() * (max-min) + min;
    }
  };

  //==============================//
  //   Player Class Constructor
  //==============================//

  var Player = function () {
    // tracks the number of clicks for this player
    this.clicks = 0;
    // base click amount to increment per click
    this.click_increment = 1;
    // the % chance of scoring a critical click
    this.crit_chance = 10;
    // the amt to multiply a critical click by
    this.crit_multiplier = 3;
    // the number of autoclickers running
    this.autoclicker = 0;
    // the ms delay between autoclicks
    this.autoclicker_delay = 5000;
    // upgrades available for the player
    this.upgrades = {
      crit_chance: {
        // if the upgrade is unlocked for the player
        active: false,
        // initial cost
        cost: 100,
        // amount to increase cost by after each upgrade level
        cost_multiplier: 1.5,
        // level or number of times upgraded
        level: 0,
        // maximum number of upgrades
        max_level: 100
      },
      crit_multiplier: {
        active: false,
        cost: 100,
        cost_multiplier: 2,
        level: 0,
        max_level: 100
      },
      click_multiplier: {
        active: false,
        cost: 100,
        cost_multiplier: 2,
        level: 0,
        max_level: 100
      },
      autoclicker: {
        active: false,
        cost: 100,
        cost_multiplier: 1.5,
        level: 0,
        max_level: 100
      },
      autoclicker_delay: {
        active: false,
        cost: 100,
        cost_multiplier: 2,
        level: 0,
        max_level: 100
      }
    };
  };

  Player.prototype.upgrade = function(type) {
  /*
  Activates an upgrade, levels the stats, and increments it in the player instance.
  Args: type of upgrade (string)
  Return: na
  */
    switch (type) {
      case 'crit_chance':
        break;
      case 'crit_multiplier':
        break;
      case 'click_multiplier':
        break;
      case 'autoclicker':
        break;
      case 'autoclicker_delay':
        break;
    }
  };

  // ui info
  var ui = document.createElement('ul');
  // append the upgrade options to the ui list element
  $(ui).append(
    '<li>'+
      '<a>'+
        '<h3>'+
        '</h3>'+
        '<p>'+
        '</p>'+
      '</a>'+
    '</li>'
  );

  // create the img elements
  var img = document.createElement('img');

  // add click listener for the ui
  ui_layer.addEventListener('click', function(e) {
    console.log('ui clicked: '+e.target.className);
    // stop the page from jumping up if clicking on a blank link
    e.preventDefault();
  });
  // add click listener for the clickable image layer
  click_layer.addEventListener('click', function(e) {
    console.log('+1 milo clicked');
  });

  console.log('milo');
  // add the picture to the dom
  // add a score keeper
  // listen for clicks on milo
  // increment the score keeper with clicks
}());
