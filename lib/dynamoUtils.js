/**
 * decodeValue allow to get proper N S and Bl value from DynamoDB
 *
 * @method decodeValue
 * @param {Object} given value ({ S : ... })
 * @return {Var} decoded value (Number for a N, String for a S and Boolean for a Bl)
 */
exports.decodeValue = function(map) {
  if (typeof map.N !== 'undefined')
    return parseFloat(map.N);
  if (typeof map.S !== 'undefined')
    return map.S;
  if (typeof map.BOOL !== 'undefined')
    return map.BOOL;
};

/**
 * decodeValues decode all value of a given object
 *
 * @method decodeValues
 * @param {Object} Output object
 * @param {Object} Retrieved DynamoDB item
 */
exports.decodeValues = function(obj, vals) {
  var self = this;
  for (var key in vals) {
    if (vals.hasOwnProperty(key)) {
      obj[key] = self.decodeValue(vals[key]);
    }
  }
};