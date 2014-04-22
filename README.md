# Deprecated: Use [bcrypt](https://github.com/ncb000gt/node.bcrypt.js) or [scrypt](https://github.com/barrysteyn/node-scrypt)

## node-password-hash[![Build Status](https://secure.travis-ci.org/davidwood/node-password-hash.png)](http://travis-ci.org/davidwood/node-password-hash)

password-hash is a node.js library to simplify use of hashed passwords.

Storing passwords in plain-text is bad.  This library makes the storing of passwords (and subsequent validation of) hashed passwords a bit easier.  

password-hash provides functions for generating a hashed passwords and verifying a plain-text password against a hashed password.  For a bit of added strength, a random salt is generated when the password is hashed.  The hashed password contains both the cryptographic algorithm that was used as well the salt, so all that is needed to verify a plain-text password is the hashed password itself.

## Installation

    npm install password-hash

## Usage

### generate(password, [options])

Generates a hash of the required `password` argument.  Hashing behavior can be modified with the optional `options` object:

* `algorithm` - A valid cryptographic algorithm for use with the `crypto.createHmac` function, defaults to 'sha1'.
* `saltLength` - The length of the salt that will be generated when the password is hashed, defaults to 8.
* `iterations` - The number of times the hashing algorithm should be applied, defaults to 1.

Errors are thrown if:

* `password` is not a string
* `options.algorithm` is specified but not a valid cryptographic algorithm
* `options.saltLength` is specified but not a positive integer

The hashed password will be in the format `algorithm$salt$hash`.

Example:
<pre>
    var passwordHash = require('password-hash');

    var hashedPassword = passwordHash.generate('password123');

    console.log(hashedPassword); // sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97
</pre>

### verify(password, hashedPassword)

Compares a plain-text password (`password`) to a hashed password (`hashedPassword`) and returns a boolean.  Both arguments are required.

Example:
<pre>
    var passwordHash = require('./lib/password-hash');

    var hashedPassword = 'sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97';
    
    console.log(passwordHash.verify('password123', hashedPassword)); // true
    console.log(passwordHash.verify('Password0', hashedPassword)); // false
</pre>

### isHashed(password)

Check if a password (`password`) is hashed.  Returns a boolean.

Example:
<pre>
    var passwordHash = require('./lib/password-hash');

    var hashedPassword = 'sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97';
    
    console.log(passwordHash.isHashed('password123')); // false
    console.log(passwordHash.isHashed(hashedPassword)); // true
</pre>

## Salt Generation

node 0.5.8 introduced `crypto.randomBytes`, which generates cryptographically strong pseudo-random data. If the version of node supports `crypto.randomBytes` it is used to generate the salt, otherwise `Math.random`, which is not cryptographically strong, is used. This is handled transparently within the salt generation function and does not impact the module's API. 

## Inspired by

password-hash is inspired by the password hashing found in [Werkzeug](http://werkzeug.pocoo.org/).
