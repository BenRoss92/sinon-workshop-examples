var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

function once(fn) {
  var returnValue,
    called = false;
  return function () {
    if (!called) {
      called = true;
      returnValue = fn.apply(this, arguments);
    }
    return returnValue;
  };
}

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      expect(2).to.equal(2);
    });

    it("calls the original function", function () {
      var callback = sinon.fake();
      var proxy = once(callback);
    
      proxy();

      expect(callback).to.have.been.called;
    });
    
  });
});

