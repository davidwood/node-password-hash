var passwordHash = require('../lib/password-hash'),
    assert = require('assert');

// Expresso tests
module.exports = {

  'Invalid passwords': function() {
    var err = 'Invalid password';
    var invalid = [null, undefined, true, false, 123, 456.78, new Date(), {}, [], function() {}];
    for (var index in invalid) {
      var fn = function() {
        passwordHash.generate(invalid[index]);
      };
      assert.throws(fn, err);
    }
  },

  'Invalid algorithm': function() {
    var err = 'Invalid message digest algorithm';
    var fn = function() { 
      passwordHash.generate('password123', { algorithm: 'foo' });
    };
    assert.throws(fn, err);
  },

  'Invalid salt length': function() {
    var err = 'Invalid salt length';
    var invalid = [0, -10, 'abc', 5.5, [], {}];
    for (var index in invalid) {
      var fn = function() { 
        passwordHash.generate('password', { saltLength: invalid[index] });
      };
      assert.throws(fn, err);
    }
  },

  'Generates unique password hashes': function() {
    var password = 'password123';
    var hash1 = passwordHash.generate(password);
    var hash2 = passwordHash.generate(password);

    // test that the actual hashes (the last 40 characters for sha1) are not equal
    assert.notEqual(hash1.substr(-40), hash2.substr(-40));

    assert.ok(passwordHash.verify(password, hash1));
    assert.ok(passwordHash.verify(password, hash2));
  },

  'Verify hashed password': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password);
    assert.ok(passwordHash.verify(password, hash));
  },

  'Invalid password hash': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password);
    var index = hash.indexOf('$');
    assert.equal(passwordHash.verify(password, hash.substr(index + 1)), false);
    assert.equal(passwordHash.verify(password, hash.substr(index)), false);
  },

  'md5 hash': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password, { algorithm: 'md5' });
    assert.ok(passwordHash.verify(password, hash));
    var parts = hash.split('$');
    assert.equal(parts[0], 'md5');
  },

  'Salt length': function() {
    var password = 'password123';
    var len = 20;
    var hash = passwordHash.generate(password, { algorithm: 'md5', saltLength: len });
    assert.ok(passwordHash.verify(password, hash));
    var parts = hash.split('$');
    assert.length(parts, 3);
    assert.length(parts[1], len);
  },

  'Check if password is hashed': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password);
    assert.ok(!passwordHash.isHashed(password));
    assert.ok(passwordHash.isHashed(hash));
  }

};
