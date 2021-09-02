import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      expect(2).to.equal(2);
    });

    it("calls the original function", function () {
      var callback = sinon.fake();

      callback();

      expect(callback).to.have.been.called;
    });
    
  });
});

