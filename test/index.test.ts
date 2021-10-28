import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

describe('index.js', function() {
  describe('Tests to check everything works correctly', function() {
    it('should check if 2 equals 2', function() {
      expect(2).to.equal(2);
    });

    it("should call the original function", function () {
      var callback = sinon.fake();

      callback();

      expect(callback).to.have.been.called;
    });
    
  });
});

