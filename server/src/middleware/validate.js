function validate(/* schema */) {
  // Simplified: no schema validation. Keep signature for compatibility.
  return (req, _res, next) => next();
}

module.exports = { validate };
