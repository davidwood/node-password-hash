var crypto = require('crypto');

var saltChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var saltCharsCount = saltChars.length;

function generateSalt(len) {
  if (typeof len != 'number' || len <= 0 || len !== parseInt(len, 10)) throw new Error('Invalid salt length');
  for (var i = 0, salt = ''; i < len; i++) {
    salt += saltChars.charAt(Math.floor(Math.random() * saltCharsCount));
  }
  return salt;
}

function generateHash(algorithm, salt, password) {
  try {
    var hash = crypto.createHash(algorithm, salt).update(password).digest('hex');
    return algorithm + '$' + salt + '$' + hash;
  } catch (e) {
    throw new Error('Invalid message digest algorithm');
  }
}

module.exports.generate = function(password, options) {
  if (typeof password != 'string') throw new Error('Invalid password');
  options || (options = {});
  options.algorithm || (options.algorithm = 'sha1');
  options.saltLength || options.saltLength == 0 || (options.saltLength = 8);
  var salt = generateSalt(options.saltLength);
  return generateHash(options.algorithm, salt, password);
};

module.exports.verify = function(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  var parts = hashedPassword.split('$');
  if (parts.length != 3) return false;
  try {
    return generateHash(parts[0], parts[1], password) == hashedPassword;
  } catch (e) {}
  return false;
};

module.exports.isHashed = function(password) {
  if (!password) return false;
  return password.split('$').length == 3;
}
