// milo clicker module in an anonymous closure to keep global scope clear
(function () {

  // incrementers for loops
  var i;
  var item;

  // get the dom elements to append to
  // the clickable image layer that'll generate clicks
  var click_layer = document.querySelector('.clickable');
  // the main element that contains all the game elements
  var main = document.querySelector('main');

  // have like 10 divs off screen already then just use transform to position them at mouse location, prevents reflows. use those divs for the +1 message on every click. toggle opacity transitions on each one. this is just some extra niceness so do this later

  // pics and external stuff to load
  var assets = {
    milo_src: 'img/milo.png',
    crit_chance_src: 'img/Power%20of%20blessing.png',
    crit_multiplier_src: 'img/Magic%20Reflection.png',
    autoclicker_src: 'img/Scatter.png',
    autoclicker_delay_src: 'img/Wind%20Haste.png',
    click_multiplier_src: 'img/Thunder.png',
    roomba_cat_src: 'img/roombacat.png'
  };
  // text content
  var ui_text = {
    upgrade_indexes: {
      // obj that will contain the index number of each upgrade by name in the
      // ui text upgrades array ie {crit_chance: 0, something_else: 1,...}
    },
    upgrades: [
      {
        title: 'Lucky Cat - Improve Chance of CRITICAL CLICK',
        class: 'crit_chance',
        description: 'Makes your chance of a CRITICAL CLICK more likely, more CRITICAL CLICKS = more bonus $.',
        unit: '% Chance',
        prefix: '+'
      },{
        title: 'Jackpot Meow - Increase CRITICAL CLICK Bonus Amount',
        class: 'crit_multiplier',
        description: 'Increases the bonus $ amount of a CRITICAL CLICK. Multiplies a CRITICAL CLICK by a higher bonus amount.',
        unit: 'x $ on Critical',
        prefix: '+'
      },{
        title: 'RoboCat - Makes $ Automatically For You',
        class: 'autoclicker',
        description: 'Have RoboCat automatically earn $ for you. Each level increases the amount RoboCat earns. Utilizes ultra-advanced AI breakthroughs, deep learning neural nets, and tree search algorithms. RoboCat does not trigger CRITICAL CLICKS.',
        unit: '',
        prefix: '+'
      },{
        title: 'RoboCatNip Zoomies - Increase RoboCat Speed',
        class: 'autoclicker_delay',
        description: 'Makes RoboCat faster, taking less time and earning you $ more quickly.',
        unit: ' milliseconds',
        prefix: ''
      },{
        title: 'Nine Lives - Upgrade Click Multiplier',
        class: 'click_multiplier',
        description: 'Increases the amount you get per click. Makes every click earn more $, including CRITICAL CLICKS and RoboCat earnings.',
        unit: 'x $ per Click',
        prefix: '+'
      }
    ],
    sidebar_tooltip: 'Upgrade Level:',
    upgrades_title: 'Buy Upgrades',
    notifications: {
      clicked: {
        upgraded: 'Upgraded!',
        no_money: 'NOT ENOUGH $',
        max_level: 'MAX LEVEL REACHED',
        upgrade_unlocked: 'Upgrade Unlocked'
      },
      maxed_out_upgrade: "CAN'T UPGRADE! Max level reached for upgrade!",
      inactive_upgrade: 'Sorry, you must unlock upgrade by buying  previous upgrade type first',
      need_more_money: 'MORE $ NEEDED (^=˃ᆺ˂) Keep Clickin!',
      crit: '< CRITICAL CLICK! >',
      auto: 'ROBOCLICK Meowactivated',
      crit_chance_upgrade: 'You Get Better Critical Chances Meow!',
      crit_multiplier_upgrade: 'You Meow Get More MiloBucks on a Critical Click!',
      click_multiplier_upgrade: 'Each of your Clicks Are Worth More $ Meow!',
      autoclicker_upgrade: 'RoboCat Upgraded!',
      autoclicker_delay_upgrade: 'RoboCat Clicks Faster Meow!',
      instructions: 'Click Milo the cat and get $ MiloBucks to buy upgrades!'
    },
    counter_start: 'Click Milo Get $!'
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

  //=============================//
  //    UI Creation Functions    //
  //=============================//

  var generate_ui = {
    notification_bar: function() {
      // create element for all the notifications in game
      var notification_bar = document.createElement('h3');
      // add notifications class to the notifications element
      notification_bar.classList.add('notifications', 'center-text');
      // set starting text in the notifications bar to game instructions
      notification_bar.textContent = ui_text.notifications.instructions;

      return notification_bar;
    },
    upgrades_sidebar: function() {
      // create an upgrades/lvls tracker sidebar element
      var upgrades_sidebar = document.createElement('ul');
      // init var for list items in the sidebar
      var upgrades_sidebar_item;
      // init var for current upgrade in the list
      var current_upgrade;
      // generate the initial crit chance upgrade list item
      for (i = 0; i < ui_text.upgrades.length; i+=1) {
        // cache ref to the current upgrade in the ui text array
        current_upgrade = ui_text.upgrades[i];
        // generate the upgrade based on the upgrade class name
        upgrades_sidebar_item = this.upgrades_sidebar_item(current_upgrade.class);
        // add identifier attribute to the element
        upgrades_sidebar_item.setAttribute('data-id', current_upgrade.class);
        // after the first sidebar item
        if (i > 0) {
          // hide the rest until unlocked
          upgrades_sidebar_item.classList.add('inactive');
        }
        // add the upgrade sidebar item to the sidebar list
        upgrades_sidebar.appendChild(upgrades_sidebar_item);
      }
      // add the upgrades tracker class
      upgrades_sidebar.classList.add('upgrades-tracker');

      return upgrades_sidebar;
    },
    upgrades_sidebar_item: function(type) {
      // cache easier to read reference to the ui text upgrades array
      var upgrade_text = ui_text.upgrades;
      // cache easier to read reference to the ui text upgrade indexes
      var indexes = ui_text.upgrade_indexes;
      // create the li item for the sidebar list
      var upgrades_sidebar_item = document.createElement('li');
      // create the text label for the sidebar item
      var upgrades_sidebar_label = document.createElement('p');
      // create the img element for the sidebar item
      var upgrades_sidebar_img = document.createElement('img');
      // assign crit chance img src
      upgrades_sidebar_img.src = assets[type+'_src'];
      // make the label equal to the level of the unclocked skill
      upgrades_sidebar_label.textContent = player.upgrades[type].level;
      // add a title attribute
      upgrades_sidebar_item.title = upgrade_text[indexes[type]].title +
                                    ' - ' +
                                    ui_text.sidebar_tooltip +
                                    ' ' +
                                    player.upgrades[type].level;
      // append the label to the li
      upgrades_sidebar_item.appendChild(upgrades_sidebar_label);
      // append the img to the li
      upgrades_sidebar_item.appendChild(upgrades_sidebar_img);
      // add the vertical centering class to label
      upgrades_sidebar_label.classList.add('v-center-absolute');

      return upgrades_sidebar_item;
    },
    counter: function () {
      // create element for click amount counter
      var click_counter = document.createElement('h2');
      // add counter class to click counter
      click_counter.classList.add('counter', 'center-text');
      // start click counter at 0
      click_counter.textContent = ui_text.counter_start;

      return click_counter;
    },
    cat: function () {
      // create the img element for the cat
      var cat = document.createElement('img');
      // set image source to milo's pic
      cat.src = assets.milo_src;
      // prevent draggable selection on the img from interfering with clicks
      cat.draggable = false;
      // add cat class to milo element
      cat.classList.add('cat');

      return cat;
    },
    upgrades_menu: function() {
      // Create the upgrades menu
      var upgrades = document.createElement('ul');
      // add class upgrades for upgrade menu
      upgrades.classList.add('upgrades');
      // Add a heading to the upgrades container
      $(upgrades).append('<li class="upgrades-header"><h2>'+ ui_text.upgrades_title  +'</h2></li>');

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
        // add inactive class to items that aren't unlocked yet to hide
        if (!current_upgrade_item.active) {
          inactive_class = ' inactive';
        }
        // append li html to the upgrades ul
        $(upgrades).append(
          '<li class="'+ current_text_item.class + inactive_class +'">'+
            '<a href="#">'+
              '<img src="' + assets[current_text_item.class+'_src'] +'">'+
              '<h3>'+
                '$' + current_upgrade_item.cost + ' - ' + current_text_item.title + ' - Lvl ' + current_upgrade_item.level +
              '</h3>'+
              '<p>'+
                current_text_item.description +
                '<br>' +
                '<em>' +
                'Upgrade: ' + current_text_item.prefix + current_upgrade_item.increase + current_text_item.unit + ' | Current: ' + current_upgrade_item.current + current_text_item.unit + ' | Max Lvl: ' + current_upgrade_item.max_level +
                '</em>' +
              '</p>'+
            '</a>'+
          '</li>'
        );
      }

      return upgrades;
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
    // amount the last click incremented clicks by
    this.last_click_increment = 1;
    // track if critical hit for most recent click
    this.last_click_crit = false;
    // autoclicker function placeholder
    this.autoclicker = function(){};
    // notification to show
    this.notification = '';

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
        cost_multiplier: 1.9,
        level: 0,
        max_level: 1000,
        increase: 1
      },
      // autoclicker delay
      autoclicker_delay: {
        // the ms delay between autoclicks
        current: 2010,
        active: false,
        cost: 10,
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

  Player.prototype.render_click_animation = function(x, y, type) {
    /*
    Take in click location coordinates and put a click increment
    animation at that location that disappears eventually.
    Args: x, y locations to render click animation at (int or string),
          type - the type of click animation to render
    Return: na
    */
    // set default of count if nothing/falsey passed in as type
    type = type || 'count';
    // create element to hold the animated click amount display
    var click_animation = document.createElement('div');

    // check if we have hit a critical during the roll
    if (this.last_click_crit) {
      // if critical, add critical class also
      click_animation.classList.add('clicked','critical');
    } else {
      // if not, just add the regular clicked class
      click_animation.classList.add('clicked');
    }
    // check if we have the units specified for position, not just pixel # in args
    if (isNaN(x)||isNaN(y)) {
      // position exactly as passed in
      click_animation.style.left = x;
      click_animation.style.top = y;
    } else {
      // position the click amt slightly to the left
      click_animation.style.left = x - 20 +'px';
      // and above the mouse cursor
      click_animation.style.top = y - 35 + 'px';
    }
    // show click amount count animation if that type of click
    switch (type) {
      case 'count':
        // set text to the amount we incremented clicks by
        click_animation.textContent = '+' + this.last_click_increment;
        break;
      case 'upgrade':
        // show upgraded text as the click animation
        click_animation.textContent = ui_text.notifications.clicked.upgraded;
        break;
      case 'no-money':
        // add not enough money class
        click_animation.classList.add('no-money');
        // set not enough $ text
        click_animation.textContent = ui_text.notifications.clicked.no_money;
        break;
      case 'max-level':
        // set max level text
        click_animation.textContent = ui_text.notifications.clicked.max_level;
        break;
      case 'upgrade-unlocked':
        // add not enough money class
        click_animation.classList.add('upgrade-unlocked');
        // set upgrade unlocked text
        click_animation.textContent = ui_text.notifications.clicked.upgrade_unlocked;
        break;
    }

    // append the click amount display to the actual dom
    click_layer.appendChild(click_animation);
    // set a delayed callback to remove the element after the animation
    setTimeout(function(){
      click_layer.removeChild(click_animation);
    }, 700);
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

  Player.prototype.upgrade = function(type, x, y) {
  /*
  Activates an upgrade, levels the stats, and increments it in the player instance, displays notification according to
  the type of upgrade. Unlocks the next upgrade in the list.
  Args: type of upgrade (string), x (int) mouse click location, y (int) mouse click location
  Return: na
  */
    // init var to store access a specific upgrade property
    var this_upgrade;

    // set current upgrade to the crit chance property in upgrades
    this_upgrade = this.upgrades[type];
    // check conditions, if player is able to upgrade
    if (this.check_if_able_to_upgrade(this_upgrade, x, y)) {
      // increment the relevant upgrade stats and settings
      this.update_upgrade_stats(this_upgrade);
      // unlock the next upgrade in the menu
      this.unlock_next_upgrade(type, x, y);
      // show the crit chance notification message
      this.show_notification(ui_text.notifications[type+'_upgrade']);
      // show upgrade successful message next to mouse click
      this.render_click_animation(x, y, 'upgrade');
    }

    // update live upgrades menu stats in the displayed dom
    this.render_upgrade(type);
  };

  Player.prototype.check_if_able_to_upgrade = function(upgrade_obj, x, y) {
    /*
    Check the passed in upgrade to see if it passes all conditions for being able to be upgraded:
    - player has enough MiloBucks
    - upgrade is not max level
    - upgrade is active
    Args: upgrade_obj - reference to which upgrade object to check in the upgrades table (obj), x,y (int) the horizontal/vertical mouse click positions
    return: boolean - if all condition checks were passed and upgrade is allowed
    */
    // boolean var to return that will be set to false if any condition fails
    var able_to_upgrade = true;

    // first make sure upgrade is unlocked and accessible
    if (!upgrade_obj.active) {
      // can't upgrade so set to false
      able_to_upgrade = false;
      // show upgrade not active message
      this.show_notification(ui_text.notifications.inactive_upgrade);

    // only allow upgrades if it hasn't been maxed out yet
  } else if (upgrade_obj.level >= upgrade_obj.max_level) {
      able_to_upgrade = false;
      // show max level reached message
      this.show_notification(ui_text.notifications.maxed_out_upgrade);
      // show mex level reached msg next to mouse
      this.render_click_animation(x,y,'max-level');
    // check if player has enough money to buy upgrade
  } else if (upgrade_obj.cost > this.clicks) {
      able_to_upgrade = false;
      // show a not enough money message in notifications
      this.show_notification(ui_text.notifications.need_more_money);
      // show not enough money message next to mouse
      this.render_click_animation(x,y,'no-money');
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
      this.autoclicker = setInterval(this.autoclick.bind(this),
      this.upgrades.autoclicker_delay.current);
      // create the img element for the robot
      var robot_img = document.createElement('img');
      // add the robot class to the img
      robot_img.classList.add('robot');
      // assign the src to roomba cat png
      robot_img.src = assets.roomba_cat_src;
      // append the robot element to the dom
      click_layer.appendChild(robot_img);
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
    // autoclick calc as amount of autoclickers multiplied by current base click multiplier
    var autoclick_increment = this.upgrades.autoclicker.current * this.upgrades.click_multiplier.current;
    // increment clicks
    this.clicks += autoclick_increment;
    // set last click increment to autoclick increment amt
    this.last_click_increment = autoclick_increment;
    // no crits for autoclicks
    this.last_click_crit = false;
    // display player clicks amount in click counter
    this.render_clicks();
    // render the click increment animation at robot location
    this.render_click_animation('50%', '56%');
  };

  Player.prototype.unlock_next_upgrade = function(current_upgrade, x, y) {
    /*
    Takes in the current upgrade and unlocks the next upgrade in the
    upgrades table, makes it visible in the dom too.
    Args: current_upgrade (string) - class name of the current upgrade
          x,y (int) - mouse click position coordinates
    Return: na
    */
    // check if we even need to unlock the next upgrade first
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
      // unlock the next upgrade in the sidebar by removing hidden class
      $(".upgrades-tracker li[data-id='"+ next_upgrade +"']").removeClass('inactive');
      // show an upgrade unlocked notificaiton near click, move away from upgraded message
      this.render_click_animation(x, y+40, 'upgrade-unlocked');
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
    // get the upgrade element in the sidebar
    var sidebar_upgrade_label = document.querySelector('li[data-id='+ type +'] p');

    // render different format if can't be upgraded since at max level
    if (this_upgrade.level === this_upgrade.max_level) {
      // update the displayed title for the current upgrade
      element_title.innerHTML =
        '<del>' + this_text.title + '</del>' + ' - MAX LVL';
      // display max in sidebar label
      sidebar_upgrade_label.textContent = 'MAX';
    } else {
      // update the displayed title with current level and cost info
      element_title.innerHTML =
        this_upgrade.cost.toLocaleString(undefined, {style: 'currency', currency: 'USD'}) + ' - ' + this_text.title + ' - Lvl ' + this_upgrade.level;
      // update sidebar label of current upgrade with current level
      sidebar_upgrade_label.textContent = this_upgrade.level;
      // toggle animation for the text in the label
      sidebar_upgrade_label.classList.toggle('animate');
    }

    // update the displayed description for the current upgrade
    element_desc.innerHTML =
      this_text.description +
      '<br>' +
      '<em>' +
        'Upgrade: ' + this_text.prefix + this_upgrade.increase + this_text.unit + ' | Current: ' + this_upgrade.current.toFixed(2) + this_text.unit + ' | Max Lvl: ' + this_upgrade.max_level +
      '</em>';
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
    // amount that clicks will be incremented by
    var click_increment;
    // check if the rolled number is low enough to trigger a critical
    if (roll <= this_upgrade.crit_chance.current) {
      // multiply the base click by crit multiplier and add to clicks count
      click_increment = this.click_amount * this_upgrade.click_multiplier.current * this_upgrade.crit_multiplier.current;
      // increment clicks
      this.clicks += click_increment;
      // show critical click notification
      this.show_notification(ui_text.notifications.crit);
      // set click crit tracker property to true
      this.last_click_crit = true;
    } else {
      // regular click amount times base click multiplier
      click_increment = this.click_amount * this_upgrade.click_multiplier.current;
      // increment clicks count
      this.clicks += click_increment;
      // no crit was hit so set crit tracker to false
      this.last_click_crit = false;
    }
    // record click increment for displaying click animation
    this.last_click_increment = click_increment;
  };

  /*
  ===========================================================
  BUILD THE GAME
  ===========================================================
  */

  // LOADING ANIMATION

  // listen for dom content loaded before revealing everything
  window.onload = function(){
    // get the preloader element
    var preloader = document.querySelector('.loader');
    // remove the animated preloader from the dom
    document.body.removeChild(preloader);
    // remove the vertical center class from the body
    document.body.classList.remove('v-center-childern');
    // unhide the main element
    main.classList.remove('visuallyhidden');
  };

  // INITIAL SETUP

  // Map each ui text upgrade name to its index for use in player upgrade rendering function
  ui_text.upgrade_indexes = ui_text.upgrades.reduce(function(indexes_map, current_obj_in_array, i){
    // set the class name as key and the index as value
    indexes_map[current_obj_in_array.class] = i;
    // return the map in the object literal
    return indexes_map;
  }, {});

  // instantiate a player object for the game
  var player = new Player();

  // GAME ELEMENT CREATION

  // dom fragment to store all the ui stuff, reduce number of append operations
  var ui_elements = document.createDocumentFragment();

  // create element for all the notifications in game
  var notification_bar = generate_ui.notification_bar();
  // create an upgrades/lvls tracker sidebar element
  var upgrades_sidebar = generate_ui.upgrades_sidebar();
  // create element for click amount counter
  var click_counter = generate_ui.counter();
  // create the img element for the cat
  var milo = generate_ui.cat();
  // Create the upgrades menu
  var upgrades = generate_ui.upgrades_menu();

  // add the notification bar to dom fragment
  ui_elements.appendChild(notification_bar);
  // add upgrade tracking sidebar to dom fragment
  ui_elements.appendChild(upgrades_sidebar);
  // add the click counter element to the dom fragment
  ui_elements.appendChild(click_counter);
  // append clickable cat element to the clickable layer in the live dom
  ui_elements.appendChild(milo);
  // add the upgrades menu to the dom fragment
  ui_elements.appendChild(upgrades);

  // append the dom fragment to the actual live dom
  click_layer.appendChild(ui_elements);

  // INTERACTION HANDLING

  var current_upgrade;
  // add click listener for the ui
  upgrades.addEventListener('click', function(e) {
    // get the class of the li item that was clicked
    current_upgrade = $(e.target).closest('li').attr('class');
    // make sure a class was received from the click event
    if (current_upgrade) {
      // upgrade the stats for the appropriate upgrade in player
      player.upgrade(current_upgrade, e.x, e.y);
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
    // render the click increment animation at mouse click location
    player.render_click_animation(e.pageX, e.pageY);
  });


}());
