// milo clicker module in an anonymous closure to keep global scope clear
(function () {

  // incrementers for loops
  var i;
  var item;

  // get the dom elements to append to
  // the containing dom element to append ui elements to
  var ui_layer = document.querySelector('.ui');
  // the clickable image layer that'll generate clicks
  var click_layer = document.querySelector('.clickable');

  // have like 10 divs off screen already then just use transform to position them at mouse location, prevents reflows. use those divs for the +1 message on every click. toggle opacity transitions on each one. this is just some extra niceness so do this later

  // pics and external stuff to load
  var assets = {
    milo_src: 'img/milo.png'
  };
  // text content
  var ui_text = {
    upgrades: [
      {
        title: 'Lucky Cat - Improve Chances of Critical Click',
        class: 'crit_chance',
        description: 'Increases the chance of a critical click, making it more likely.',
        unit: '% Critical Chance',
        prefix: '+'
      },{
        title: 'Jackpot Meow - Increase Critical Click Amount',
        class: 'crit_multiplier',
        description: 'Increase the amount a critical click will multiply a regular click.',
        unit: 'x $MB on Critical',
        prefix: '+'
      },{
        title: 'MechaCatZilla - Build Automated Robot Cat Clicker',
        class: 'autoclicker',
        description: 'Ultra-advanced AI breakthroughs, deep learning neural nets, and tree search algorithms allow you to have a robot click the cat automatically for you every few seconds.',
        unit: '',
        prefix: '+'
      },{
        title: 'Catnip Frenzy - Reduce Robot Clicker Recharging Time',
        class: 'autoclicker_delay',
        description: 'Upgrade your robot so it recharges faster, taking less time in between automatic clicks',
        unit: 'ms',
        prefix: ''
      },{
        title: 'Nine Lives - Upgrade Click Multiplier',
        class: 'click_multiplier',
        description: 'More cats for your buck, increases the amount you get per click.',
        unit: 'x $MB per Click',
        prefix: '+'
      }
    ],
    upgrades_title: 'Buy Upgrades',
    notifications: {
      crit: 'CRITICAL CLICK!',
      auto: 'Roboclick Clicktivated',
      chance_upgrade: 'You Got Better Chances Now',
      base_click_upgrade: 'Your Clicks Are Worth More Now',
      autoclicker_upgrade: 'Roboclicker Acquired',
      instructions: 'Click the cat Milo to get MiloBucks(TM) and keep clicking to buy upgrades!'
    },
    counter_start: '$0 - Click Milo Plz!'
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
    // amount to increment per click
    this.click_amount = 1;

    // player clicker upgrades info and settings
    this.upgrades = {
      // % chance of hitting a critical
      crit_chance: {
        // the current % chance of scoring a critical click
        current: 10,
        // if the upgrade is unlocked for the player
        active: true,
        // initial cost, increase by cost multiplier after each level
        cost: 100,
        // amount to increase cost by after each upgrade level
        cost_multiplier: 1.5,
        // level or number of times upgraded
        level: 0,
        // maximum number of upgrades
        max_level: 100,
        // amount to increase the current amount by
        increase: 0.3
      },
      // amount to multiply base click by for a critical
      crit_multiplier: {
        // the amt to multiply a critical click by
        current: 3,
        active: false,
        cost: 200,
        cost_multiplier: 2,
        level: 0,
        max_level: 100,
        increase: 0.5
      },
      // autoclicker
      autoclicker: {
        // the number of autoclickers running
        current: 0,
        active: false,
        cost: 150,
        cost_multiplier: 1.5,
        level: 0,
        max_level: 100,
        increase: 1
      },
      // autoclicker delay
      autoclicker_delay: {
        // the ms delay between autoclicks
        current: 5000,
        active: false,
        cost: 150,
        cost_multiplier: 2,
        level: 0,
        max_level: 100,
        increase: -100
      },
      // base click amount multiplier
      click_multiplier: {
        // base click amount to increment per click
        current: 1,
        active: false,
        cost: 300,
        cost_multiplier: 2,
        level: 0,
        max_level: 100,
        increase: 0.2
      }
    };
  };

  Player.prototype.upgrade = function(type) {
  /*
  Activates an upgrade, levels the stats, and increments it in the player instance.
  Args: type of upgrade (string)
  Return: na
  */
    // init var to store access a specific upgrade property
    var this_upgrade;
    // execute upgrade actions based on upgrade type
    switch (type) {
      case 'crit_chance':
        // set current upgrade to the crit chance property in upgrades
        this_upgrade = this.upgrades.crit_chance;
        // only allow upgrades if it hasn't been maxed out yet
        if (this_upgrade.level <= this_upgrade.max_level) {
          // increment crit chance by the amount set in upgrades settings
          this_upgrade.current += this_upgrade.increase;
          // increase the current level of this upgrade
          this_upgrade.level += 1;
          // increase the cost
          this_upgrade.cost *=  this_upgrade.cost_multiplier;
          // unlock the next upgrade in the list
          this.upgrades.crit_multiplier.active = true;
        } else {
          this_upgrade.active = false;
        }
        // need a rendering function
        break;
      case 'crit_multiplier':
        // this.crit_multiplier
        // if (this.upgrades.crit_chance.level <= this.upgrades.crit_chance.max_level) {
        //   this.crit_chance += this.upgrades.crit_chance.increase;
        //   this.upgrades.crit_chance.level += 1;
        //   this.upgrades.crit_chance.cost *=  this.upgrades.crit_chance.cost_multiplier;
        //   this.upgrades.crit_multiplier.active = true;
        // } else {
        //   this.upgrades.crit_chance.active = false;
        // }
        break;
      case 'autoclicker':
        // this.autoclicker
        break;
      case 'autoclicker_delay':
        // this.autoclicker_delay
        break;
      case 'click_multiplier':
        // this.click_amount
        break;
    }
  };

  Player.prototype.render_upgrade = function(type) {
    /*
    Renders the changes in an upgrade's stats/settings visually in the actual visible dom upgrades menu element.
    Args: type of upgrade to render changes for (string)
    Return: na
    */
    var upgrade_indexes = {
      crit_chance: 0,
      crit_multiplier: 1,
      autoclicker: 2,
      autoclicker_delay: 3,
      click_multiplier: 4
    };
    var current_upgrade = '.'+type;
    var current_upgrade_item = this.upgrades[type];
    var current_text_item; = ui_text.upgrades[];
    // the heading element for the current upgrade
    var current_upgrade_title = document.querySelector(current_upgrade + ' h3');
    // the paragraph elemene tfor the current upgrade
    var current_upgrade_desc = document.querySelector(current_upgrade + ' p');
    switch (type) {
      case 'crit_chance':

        break;
      case 'crit_multiplier':
        break;
      case 'autoclicker':
        // this.autoclicker
        break;
      case 'autoclicker_delay':
        // this.autoclicker_delay
        break;
      case 'click_multiplier':
        // this.click_amount
        break;
    }
    $(current_upgrade).html(
      '<a href="#">'+
        '<h3>'+
          '$' + current_upgrade_item.cost + ' - ' + current_text_item.title + ' - Lvl ' + current_upgrade_item.level +
        '</h3>'+
        '<p>'+
          current_text_item.description +
          '<br>' +
          'Upgrade: ' + current_text_item.prefix + current_upgrade_item.increase + current_text_item.unit + ' | Current: ' + current_upgrade_item.current + current_text_item.unit +
        '</p>'+
      '</a>'
    );
  };

  Player.prototype.roll_for_click = function() {
    /*
    Rolls some virtual dice to get a random number 1-100 determining whether
    you'll hit a critical or not and get multiplied click amounts.
    Args: na
    Return: na
    */
    // get a random number from 0-100
    var roll = util.random_num_in_range(0,101);
    var this_upgrade = this.upgrades;
    // check if the rolled number is low enough to trigger a critical
    if (roll <= this.crit_chance) {
      // multiply the base click by crit multiplier and add to clicks count
      this.clicks += (this.click_amount * this_upgrade.click_multiplier.current) * this_upgrade.crit_multiplier.current;
    } else {
      // add regular click amount to clicks count
      this.clicks += (this.click_amount * this_upgrade.click_multiplier.current);
    }
  };

  // instantiate a player object for the game
  var player = new Player();

  // dom fragment to store all the ui stuff, reduce number of append operations
  var ui_elements = document.createDocumentFragment();

  // Create the upgrades menu
  var upgrades = document.createElement('ul');
  // add class upgrades for upgrade menu
  upgrades.classList.add('upgrades');
  // Add a heading to the upgrades container
  $(upgrades).append('<li><h2>'+ ui_text.upgrades_title  +'</h2></li>');

  // init vars to use in the loop as references for current items
  var current_text_item;
  var current_upgrade_item;
  // append each of the upgrade options to the ui list container element
  for (i=0; i < ui_text.upgrades.length; i += 1) {
    // the current item in the ui text object
    current_text_item = ui_text.upgrades[i];
    // the current upgrade in the player.upgrades object
    current_upgrade_item = player.upgrades[current_text_item.class];
    // append li html to the upgrades ul
    $(upgrades).append(
      '<li class="'+ current_text_item.class +'">'+
        '<a href="#">'+
          '<h3>'+
            '$' + current_upgrade_item.cost + ' - ' + current_text_item.title + ' - Lvl ' + current_upgrade_item.level +
          '</h3>'+
          '<p>'+
            current_text_item.description +
            '<br>' +
            'Upgrade: ' + current_text_item.prefix + current_upgrade_item.increase + current_text_item.unit + ' | Current: ' + current_upgrade_item.current + current_text_item.unit +
          '</p>'+
        '</a>'+
      '</li>'
    );
  }

  // create element for all the notifications in game
  var notification_bar = document.createElement('h3');
  // add notifications class to the notifications element
  notification_bar.classList.add('notifications', 'center-text');
  // set starting text in the notifications bar to game instructions
  notification_bar.textContent = ui_text.notifications.instructions;

  // create element for click amount counter
  var click_counter = document.createElement('h2');
  // add counter class to click counter
  click_counter.classList.add('counter', 'center-text');
  // start click counter at 0
  click_counter.textContent = ui_text.counter_start;

  // create the img element for the cat
  var milo = document.createElement('img');
  // set image source to milo's pic
  milo.src = assets.milo_src;
  // prevent draggable selection on the img from interfering with clicks
  milo.draggable = false;
  // add cat class to milo element
  milo.classList.add('cat');

  // add the notification bar to dom fragment
  ui_elements.appendChild(notification_bar);
  // add the click counter element to the dom fragment
  ui_elements.appendChild(click_counter);
  // append clickable cat element to the clickable layer in the live dom
  ui_elements.appendChild(milo);
  // add the upgrades menu to the dom fragment
  ui_elements.appendChild(upgrades);

  // append the dom fragment to the actual live dom
  click_layer.appendChild(ui_elements);

  var current_upgrade;
  // add click listener for the ui
  upgrades.addEventListener('click', function(e) {
    // get the class of the li item that was clicked
    current_upgrade = $(e.target).closest('li').attr('class');
    // upgrade the stats for the appropriate upgrade in player
    player.upgrade(current_upgrade);
    // stop the page from jumping up if clicking on a blank link
    e.preventDefault();
  });

  // add click listener for the clickable image layer
  milo.addEventListener('click', function(e) {
    // roll for chance of a critical click
    player.roll_for_click();
    // display player clicks amount in click counter
    click_counter.textContent = '$' + player.clicks;
  });

}());
