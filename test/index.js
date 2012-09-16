var assert = require('assert'),
    passwordHash = require('../lib/password-hash');

describe('password-hash', function() {

  describe('.generate(password, [options])', function() {

    it('should throw an error if the password is not a valid string', function() {
      var invalid = [null, undefined, true, false, 123, 456.78, new Date(), {}, [], function() {}];
      invalid.forEach(function(value) {
        var err;
        try {
          passwordHash.generate(value);
        } catch (e) {
          err = e;
        }
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'Invalid password');
      });
    });

    it('should throw an error if an invalid message digest algorithm is specified', function() {
      var err;
      try {
        passwordHash.generate('password123', { algorithm: 'foo' });
      } catch (e) {
        err = e;
      }
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'Invalid message digest algorithm');
    });

    it('should throw an error if the salt length is invalid', function() {
      var invalid = [0, -10, 'abc', 5.5, [], {}];
      invalid.forEach(function(value) {
        var err;
        try {
          passwordHash.generate('password123', { saltLength: value });
        } catch (e) {
          err = e;
        }
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'Invalid salt length');
      });
    });

    it('should generate unique hashed passwords', function() {
      var password = 'password123',
          hash1 = passwordHash.generate(password),
          hash2 = passwordHash.generate(password);
      assert.notEqual(hash1, hash2);
      assert.ok(passwordHash.verify(password, hash1));
      assert.ok(passwordHash.verify(password, hash2));
    });

    it('should store the algorithm in the hashed password', function() {
      var password = 'password123',
          hash = passwordHash.generate(password, { algorithm: 'md5' });
      assert.ok(passwordHash.verify(password, hash));
      var parts = hash.split('$');
      assert.equal(parts[0], 'md5');
    });

    it('should store the salt length in the hashed password', function() {
      var password = 'password123',
          len = 20,
          hash = passwordHash.generate(password, { algorithm: 'md5', saltLength: len });
      assert.ok(passwordHash.verify(password, hash));
      var parts = hash.split('$');
      assert.equal(parts.length, 4);
      assert.equal(parts[1].length, len);
    });

    it('should apply the hashing algorith mutliple times if iterations are specified', function() {
      var password = 'password123',
          hash = passwordHash.generate(password, { algorithm: 'md5', iterations: 1000});
      assert.ok(passwordHash.verify(password, hash));
      var parts = hash.split('$');
      assert.equal(parts[0], 'md5');
      assert.equal(parts[2], '1000');
    });

  });

  describe('.verify(password, hashedPassword)', function() {

    it('should return true if the password matches the hash', function() {
      var password = 'password123',
          hash = passwordHash.generate(password);
      assert.ok(passwordHash.verify(password, hash));
    });

    it('should return false if the password does not match the hash', function() {
      var password = 'password123',
          hash = passwordHash.generate(password),
          index = hash.indexOf('$');
      assert.equal(passwordHash.verify(password, hash.substr(index + 1)), false);
      assert.equal(passwordHash.verify(password, hash.substr(index)), false);
    });

    it('should verify legacy 3 token hashes', function() {
      assert.ok(passwordHash.verify('password123', 'md5$qel5rKU7$9c9fecf00e965aab1e7801da6e241112'));
    });

  });

  describe('.isHashed(password)', function() {
    
    it('should return true if the string is a hashed password', function() {
      var hash = passwordHash.generate('password123');
      assert.ok(passwordHash.isHashed(hash));
    });

    it('should return false if the string is not a hashed password', function() {
      assert.ok(!passwordHash.isHashed('password123'));
    });

  });

});

