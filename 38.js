// @barge suite="User Signup & Change lastname field" framework="casperjs test"
// Heavyly influenced by
// /yauh/meteor-parties-stresstest/master/parties-stress.js
// var casper = require('casper').create();

// Variables for access test
    var email = 'guilherme@getcleanio.com';
    var password = 'password';
    var url = 'http://178.62.204.238';
    var name = Math.floor(Math.random() * 10000);

// setting the options for our run
casper.options.viewportSize = {width: 1280, height: 768};
casper.options.waitTimeout = 100000;
casper.options.verbose = true;
//casper.options.logLevel = 'debug'; // debug needs you to be verbose, hence the line above!

casper.start(url, function() {
    this.echo('Connected to "' + this.getTitle() + '"');
});

// LOG OUT IF ALREADY LOGGED IN

casper.then(function() {
    this.echo('First make sure this instance is not loggedin already');
    this.wait(10000, function() {
      this.capture('captures/1-firstAccess', undefined, {
          format: 'png'
      });
      if (this.exists('.goOut')) {
          this.echo('Performing Log out');
          this.echo('logging out user ' + this.getHTML('.goOut'));
          this.click('.goOut');
      } else {
          this.echo('Nobody logged, lets move on');
      }
    });
});

// LOG IN/SIGN UP A USER
casper.then(function() {
    casper.waitForSelector('#enter', function() {
        casper.echo('Now I will sign in with the email ' + email);
        casper.thenOpen(url + '/signin', function() {
            this.capture('captures/2-signin', undefined, {
                format: 'png'
            });
            this.echo('Connected to "' + this.getTitle() + '"');
            this.echo('Performing Log in');
            casper.waitForSelector('#formSignIn', function() {
                this.fillSelectors('#formSignIn', {
                    '#emailSignIn': email,
                    '#passwordSignIn': password
                }, true);
                this.click('#submitSignIn');
            });
        });
    });
});

// GO TO PROFILE PAGE
casper.then(function() {
  casper.waitForSelector('#submitOrder', function() {
    casper.echo('Now I will go to profile page');
    this.capture('captures/4-just-before-go-to-profile', undefined, {
        format: 'png'
    });
    casper.thenOpen(url + '/app/account', function() {
      casper.waitForSelector('#submitChanges', function() {
          this.capture('captures/5-should-be-profile', undefined, {
              format: 'png'
          });
          this.echo('Connected to "' + this.getTitle() + '"');
          this.test.assertTextExists('Vos informations');
      });
    });
  });
});

// // CHANGE LAST NAME
casper.then(function() {
    casper.waitForSelector('#submitChanges', function() {
        casper.echo('Now I will change my last name to ' + name);
        casper.waitForSelector('#lastNameChange', function() {
          this.sendKeys('#lastNameChange', name, {reset: true});
          this.click('#submitChanges');
        });
    });
});

// // // GO TO PLACE ORDER
casper.then(function() {
    casper.waitForSelector('#submitChanges', function() {
        this.capture('captures/6-should-be-profile-changed', undefined, {
            format: 'png'
        });
        casper.echo('Now I will go to place an order page');
        casper.thenOpen(url + '/app/order', function() {
            this.echo('Connected to "' + this.getTitle() + '"');
            casper.waitForSelector('.titleorderaddress', function() {
                this.test.assertTextExists('Réservez votre Groom.');
            });
        });
    });
});

// GO BACK TO PROFILE PAGE AND SEE IF LASTNAME IS CHANGED
casper.then(function() {
    casper.waitForSelector('.titleorderaddress', function() {
        this.capture('captures/7-should-be-order-page', undefined, {
            format: 'png'
        });
        casper.echo('Now I will go to profile page and check if last name was changed');
        casper.thenOpen(url + '/app/account', function() {
            casper.waitForSelector('#submitChanges', function() {
                this.echo('Connected to "' + this.getTitle() + '"');
                this.test.assertTextExists(name);
                this.test.assertTextExists('Vos informations');
                this.capture('captures/checkifisdone', undefined, {
                    format: 'png'
                });
            });
        });
    });
});

// // GO TO END THE TEST
casper.then(function() {
    this.echo("I'm done. I quit");
    this.exit();
});

// RUN THE CASPER
casper.run();


