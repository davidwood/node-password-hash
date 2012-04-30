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
    assert.notEqual(hash1, hash2);
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

  'md5 hash with 1000 iterations': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password, { algorithm: 'md5', iterations: 1000});
    assert.ok(passwordHash.verify(password, hash));
    var parts = hash.split('$');
    assert.equal(parts[0], 'md5');
  },

  'old 3 token hash should still work': function() {
    var password = 'password123';
    var hash = "md5$qel5rKU7$9c9fecf00e965aab1e7801da6e241112"
    assert.ok(passwordHash.verify(password, hash));
  },

  'Salt length': function() {
    var password = 'password123';
    var len = 20;
    var hash = passwordHash.generate(password, { algorithm: 'md5', saltLength: len });
    assert.ok(passwordHash.verify(password, hash));
    var parts = hash.split('$');
    assert.equal(parts.length, 4);
    assert.equal(parts[1].length, len);
  },

  'Check if password is hashed': function() {
    var password = 'password123';
    var hash = passwordHash.generate(password);
    assert.ok(!passwordHash.isHashed(password));
    assert.ok(passwordHash.isHashed(hash));
  }

};
