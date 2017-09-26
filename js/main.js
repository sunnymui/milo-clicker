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
    upgrade_indexes: {
      // obj that will contain the index number of each upgrade by name in the
      // ui text upgrades array ie {crit_chance: 0, something_else: 1,...}
    },
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
        unit: 'x $ on Critical',
        prefix: '+'
      },{
        title: 'MechaCatZilla - Build Automated Robot Cat Clicker',
        class: 'autoclicker',
        description: 'Ultra-advanced AI breakthroughs, deep learning neural nets, and tree search algorithms allow you to have a robot click the cat automatically for you every few seconds. Those clicks do not trigger criticals though.',
        unit: '',
        prefix: '+'
      },{
        title: 'Catnip Frenzy - Reduce Robot Clicker Recharging Time',
        class: 'autoclicker_delay',
        description: 'Upgrade your robot so it recharges faster, taking less time in between automatic clicks',
        unit: ' milliseconds',
        prefix: ''
      },{
        title: 'Nine Lives - Upgrade Click Multiplier',
        class: 'click_multiplier',
        description: 'More cats for your buck, increases the amount you get per click.',
        unit: 'x $ per Click',
        prefix: '+'
      }
    ],
    upgrades_title: 'Buy Upgrades',
    notifications: {
      maxed_out_upgrade: "Can't upgrade, max level reached for that upgrade",
      inactive_upgrade: 'Sorry, you must unlock upgrade by buying  previous upgrade type first',
      need_more_money: 'Not Enough $ MiloBucks (^=˃ᆺ˂)',
      crit: 'CRITICAL CLICK!',
      auto: 'ROBOCLICK Meowactivated',
      chance_upgrade: 'You Get Better Critical Chances Meow!',
      crit_multiplier_upgrade: 'You Meow Get More MiloBucks on a Critical Click!',
      click_multiplier_upgrade: 'Your Clicks Are Worth More Meow!',
      autoclicker_upgrade: 'Robot Cat Clicker Acquired!',
      autoclicker_delay_upgrade: 'Robot Cat Clicker Recharges Faster Meow!',
      instructions: 'Click Milo the cat, get $ MiloBucks(TM), & buy upgrades to get more $!'
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
    // autoclicker function
    this.autoclicker = function(){};

    // player clicker upgrades info and settings
    this.upgrades = {
      // % chance of hitting a critical
      crit_chance: {
        // the current % chance of scoring a critical click
        current: 10,
        // if the upgrade is unlocked for the player
        active: true,
        // initial cost, increase by cost multiplier after each level
        cost: 1,
        // amount to increase cost by after each upgrade level
        cost_multiplier: 1.4,
        // level or number of times upgraded
        level: 0,
        // maximum number of upgrades
        max_level: 50,
        // amount to increase the current amount by
        increase: 1
      },
      // amount to multiply base click by for a critical
      crit_multiplier: {
        // the amt to multiply a critical click by
        current: 3,
        active: false,
        cost: 1,
        cost_multiplier: 1.5,
        level: 0,
        max_level: 1000,
        increase: 1
      },
      // autoclicker
      autoclicker: {
        // the number of autoclickers running
        current: 0,
        active: false,
        cost: 5,
        cost_multiplier: 1.8,
        level: 0,
        max_level: 1000,
        increase: 1
      },
      // autoclicker delay
      autoclicker_delay: {
        // the ms delay between autoclicks
        current: 2010,
        active: false,
        cost: 5,
        cost_multiplier: 2.1,
        level: 0,
        max_level: 20,
        increase: -100
      },
      // base click amount multiplier
      click_multiplier: {
        // base click amount to increment per click
        current: 1,
        active: false,
        cost: 50,
        cost_multiplier: 1.7,
        level: 0,
        max_level: 1000,
        increase: 1
      }
    };
  };

  Player.prototype.render_clicks = function() {
    /*
    Renders the clicks amt to the click counter
    Args: na
    Return: na
    */
    // player clicks amount w/ 2 decimals, format with commas in usd currency format
    var clicks = this.clicks.toLocaleString(undefined, {style: 'currency', currency: 'USD'});
    // display formatted clicks in click counter element
    click_counter.textContent = clicks;
  };

  Player.prototype.upgrade = function(type) {
  /*
  Activates an upgrade, levels the stats, and increments it in the player instance, displays notification according to
  the type of upgrade. Unlocks the next upgrade in the list.
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
        // check conditions, if player is able to upgrade
        if (this.check_if_able_to_upgrade(this_upgrade)) {
          // increment the relevant upgrade stats and settings
          this.update_upgrade_stats(this_upgrade);
          // unlock the next upgrade in the menu
          this.unlock_next_upgrade(type);
          // show the crit chance notification message
          notification_bar.textContent = ui_text.notifications.chance_upgrade;
        }
        break;
      case 'crit_multiplier':
        // set current upgrade to the crit multiplier property in upgrades
        this_upgrade = this.upgrades.crit_multiplier;
        // check conditions, if player is able to upgrade
        if (this.check_if_able_to_upgrade(this_upgrade)) {
          // increment the relevant upgrade stats and settings
          this.update_upgrade_stats(this_upgrade);
          // unlock the next upgrade in the menu
          this.unlock_next_upgrade(type);
          // show the crit chance notification message
          notification_bar.textContent = ui_text.notifications.crit_multiplier_upgrade;
        }
        break;
      case 'autoclicker':
        // set current upgrade to the autoclicker property in upgrades
        this_upgrade = this.upgrades.autoclicker;
        // check conditions, if player is able to upgrade
        if (this.check_if_able_to_upgrade(this_upgrade)) {
          // increment the relevant upgrade stats and settings
          this.update_upgrade_stats(this_upgrade);
          // unlock the next upgrade in the menu
          this.unlock_next_upgrade(type);
          // show the crit chance notification message
          notification_bar.textContent = ui_text.notifications.autoclicker_upgrade;
        }
        break;
      case 'autoclicker_delay':
        // set current upgrade to the autoclicker property in upgrades
        this_upgrade = this.upgrades.autoclicker_delay;
        // check conditions, if player is able to upgrade
        if (this.check_if_able_to_upgrade(this_upgrade)) {
          // increment the relevant upgrade stats and settings
          this.update_upgrade_stats(this_upgrade);
          // unlock the next upgrade in the menu
          this.unlock_next_upgrade(type);
          // show the crit chance notification message
          notification_bar.textContent = ui_text.notifications.autoclicker_delay_upgrade;
        }
        break;
      case 'click_multiplier':
        // set current upgrade to the autoclicker property in upgrades
        this_upgrade = this.upgrades.click_multiplier;
        // check conditions, if player is able to upgrade
        if (this.check_if_able_to_upgrade(this_upgrade)) {
          // increment the relevant upgrade stats and settings
          this.update_upgrade_stats(this_upgrade);
          // show the crit chance notification message
          notification_bar.textContent = ui_text.notifications.click_multiplier_upgrade;
        }
        break;
    }

    // update live upgrades menu stats in the displayed dom
    this.render_upgrade(type);
  };

  Player.prototype.check_if_able_to_upgrade = function(upgrade_obj) {
    /*
    Check the passed in upgrade to see if it passes all conditions for being able to be upgraded:
    - player has enough MiloBucks
    - upgrade is not max level
    - upgrade is active
    Args: upgrade_obj - reference to which upgrade object to check in the upgrades table (obj)
    return: boolean - if all condition checks were passed and upgrade is allowed
    */
    // boolean var to return that will be set to false if any condition fails
    var able_to_upgrade = true;

    // first make sure upgrade is unlocked and accessible
    if (!upgrade_obj.active) {
      // can't upgrade so set to false
      able_to_upgrade = false;
      // show upgrade not active message
      notification_bar.textContent = ui_text.notifications.inactive_upgrade;

    // only allow upgrades if it hasn't been maxed out yet
  } else if (upgrade_obj.level >= upgrade_obj.max_level) {
      able_to_upgrade = false;
      // show max level reached message
      notification_bar.textContent = ui_text.notifications.maxed_out_upgrade;

    // check if player has enough money to buy upgrade
  } else if (upgrade_obj.cost > this.clicks) {
      able_to_upgrade = false;
      // show a not enough money message
      notification_bar.textContent = ui_text.notifications.need_more_money;
    }
    return able_to_upgrade;
  };

  Player.prototype.update_upgrade_stats = function(upgrade_obj) {
    /*
    Updates a passed in upgrade type's stats using the increases and
    other setting information specified in the upgrades object.
    Args: upgrade_obj - reference to which upgrade object to check in the upgrades table (obj)
    return: na
    */
    // subtract the cost of clicks from player's current clicks amount
    this.clicks -= upgrade_obj.cost;
    // show updated clicks amount in live counter dom element
    this.render_clicks();
    // increment current effect of upgrade by the amount set in upgrades settings
    upgrade_obj.current += upgrade_obj.increase;
    // increase the current level of this upgrade
    upgrade_obj.level += 1;
    // increase the cost
    upgrade_obj.cost *=  upgrade_obj.cost_multiplier;
    // round cost to a nice even number
    upgrade_obj.cost = upgrade_obj.cost;

    // special initiator for the robot cat clicker upgrade_obj
    // only create one setInterval function to run autoclicks at initial purchase
    if (upgrade_obj === this.upgrades.autoclicker && this.upgrades.autoclicker.current === 1) {
      // run autoclick every x seconds as set in autoclicker delay using setInterval
      // bind autoclick so this = player in the callback
      this.autoclicker = setInterval(this.autoclick.bind(this), this.upgrades.autoclicker_delay.current);
    }

    // reinitiate setInterval w/ updated delay if an autoclicker delay upgrade
    if (upgrade_obj === this.upgrades.autoclicker_delay) {
      // cancel currently rerunning setInterval
      clearTimeout(this.autoclicker);
      // restart the setInterval autoclicker with updated delay time
      this.autoclicker = setInterval(this.autoclick.bind(this), this.upgrades.autoclicker_delay.current);
    }

  };

  Player.prototype.autoclick = function() {
    /*
    This increments clicks using current autoclicker settings, rerenders the clicks counter.
    To be used in a setInterval function.
    Args: na
    Return: na
    */
    // increment clicks by amount of autoclickers multiplied by current base click multiplier
    this.clicks += (this.upgrades.autoclicker.current * this.upgrades.click_multiplier.current);
    // display player clicks amount in click counter
    this.render_clicks();
  };

  Player.prototype.unlock_next_upgrade = function(current_upgrade) {
    /*
    Takes in the current upgrade and unlocks the next upgrade in the
    upgrades table, makes it visible in the dom too.
    Args: current_upgrade (string) - class name of the current upgrade
    Return: na
    */
    // check if we even need to unlock the next function first
    if (this.upgrades[current_upgrade].level > 1) {
      // exit early
      return;
    }

    var next_upgrade;
    // get the index of the next upgrade to be unlocked in ui text upgrades
    var next_upgrade_index = ui_text.upgrade_indexes[current_upgrade]+1;
    // cache reference to ui text upgrades array
    var upgrades_array = ui_text.upgrades;
    // class to be removed from unlocked elements
    var inactive_class = 'inactive';

    // check that we're not already at the end of ui text upgrades array
    if (next_upgrade_index !== upgrades_array.length) {
      // get correct identifier/class for the next upgrade
      next_upgrade = upgrades_array[next_upgrade_index].class;
      // unlock the next upgrade in the list
      this.upgrades[next_upgrade].active = true;
      // remove inactive class of next upgrade
      document.getElementsByClassName(next_upgrade)[0].classList.remove(inactive_class);
    }
  };

  Player.prototype.show_notification = function(notification_text) {
    /*
    Shows the notification in the notification bar with proper css
    animations.
    Args: notification_text (string) - the string to set as the notification text
    Return: na
    */
    // show the crit chance notification message
    notification_bar.textContent = notification_text;
    // toggle animate class to allow for restarting css animation
    // in conjunction with the 2 css animations on notification bar
    notification_bar.classList.toggle('animate');
  };

  Player.prototype.render_upgrade = function(type) {
    /*
    Renders the changes in an upgrade's stats/settings visually in the actual visible dom upgrades menu element.
    Args: type of upgrade to render changes for (string)
    Return: na
    */
    // the class selector for the current upgrade type
    var upgrade_class = '.'+type;
    // the index of the current upgrade in the ui text upgrades array
    var upgrade_text_index = ui_text.upgrade_indexes[type];
    // this upgrade in the player upgrades table
    var this_upgrade = this.upgrades[type];
    // this upgrade in the ui text upgrades array
    var this_text = ui_text.upgrades[upgrade_text_index];
    // the heading element for the current upgrade
    var element_title = document.querySelector(upgrade_class + ' h3');
    // the paragraph elemene tfor the current upgrade
    var element_desc = document.querySelector(upgrade_class + ' p');

    // render different format if can't be upgraded since at max level
    if (this_upgrade.level === this_upgrade.max_level) {
      // update the displayed title for the current upgrade
      element_title.innerHTML =
        '<del>' + this_text.title + '</del>' + ' - MAX LVL';
    } else {
      // update the displayed title with current level and cost info
      element_title.innerHTML =
        '$' + this_upgrade.cost.toFixed(2) + ' - ' + this_text.title + ' - Lvl ' + this_upgrade.level;
    }

    // update the displayed description for the current upgrade
    element_desc.innerHTML =
      this_text.description +
      '<br>' +
      'Upgrade: ' + this_text.prefix + this_upgrade.increase + this_text.unit + ' | Current: ' + this_upgrade.current.toFixed(2) + this_text.unit + ' | Max Lvl: ' + this_upgrade.max_level;
  };

  Player.prototype.roll_for_click = function() {
    /*
    Rolls some virtual dice to get a random number 1-100 determining whether
    you'll hit a critical or not and get multiplied click amounts.
    Args: na
    Return: na
    */
    // get a random number from 0.0-100.0 (include one decmial point)
    var roll = util.random_num_in_range(0,1001)/10;
    // cache reference to the player upgrades object
    var this_upgrade = this.upgrades;
    // check if the rolled number is low enough to trigger a critical
    if (roll <= this_upgrade.crit_chance.current) {
      // multiply the base click by crit multiplier and add to clicks count
      this.clicks += (this.click_amount * this_upgrade.click_multiplier.current) * this_upgrade.crit_multiplier.current;
      // show critical click notification
      this.show_notification(ui_text.notifications.crit);
    } else {
      // add regular click amount to clicks count
      this.clicks += (this.click_amount * this_upgrade.click_multiplier.current);
    }
  };

  // Map each ui text upgrade name to its index for use in player upgrade rendering function
  ui_text.upgrade_indexes = ui_text.upgrades.reduce(function(indexes_map, current_obj_in_array, i){
    // set the class name as key and the index as value
    indexes_map[current_obj_in_array.class] = i;
    // return the map in the object literal
    return indexes_map;
  }, {});

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
  var inactive_class = '';
  // append each of the upgrade options to the ui list container element
  for (i=0; i < ui_text.upgrades.length; i += 1) {
    // the current item in the ui text object
    current_text_item = ui_text.upgrades[i];
    // the current upgrade in the player.upgrades object
    current_upgrade_item = player.upgrades[current_text_item.class];
    if (!current_upgrade_item.active) {
      inactive_class = ' inactive';
    }
    // append li html to the upgrades ul
    $(upgrades).append(
      '<li class="'+ current_text_item.class + inactive_class +'">'+
        '<a href="#">'+
          '<h3>'+
            '$' + current_upgrade_item.cost + ' - ' + current_text_item.title + ' - Lvl ' + current_upgrade_item.level +
          '</h3>'+
          '<p>'+
            current_text_item.description +
            '<br>' +
            'Upgrade: ' + current_text_item.prefix + current_upgrade_item.increase + current_text_item.unit + ' | Current: ' + current_upgrade_item.current + current_text_item.unit + ' | Max Lvl: ' + current_upgrade_item.max_level +
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
    // make sure a class was received from the click event
    if (current_upgrade) {
      // upgrade the stats for the appropriate upgrade in player
      player.upgrade(current_upgrade);
    }
    // stop the page from jumping up if clicking on a blank link
    e.preventDefault();
  });

  // add click listener for the clickable image layer
  milo.addEventListener('click', function(e) {
    // roll for chance of a critical click
    player.roll_for_click();
    // display player clicks amount in click counter
    player.render_clicks();
  });

}());
