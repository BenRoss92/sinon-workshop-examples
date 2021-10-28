import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

describe('spy', () => {
    describe("#called", function () {
        it("should have been called once", function () {
            const object = { 
                method(arg: number): void {
                    // no-op
                } 
            };
    
            const spy = sinon.spy(object, 'method');
    
            object.method(1);
    
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledOnceWithExactly(1);
        });
    });

    describe('#getCall and #getCalls', () => {
        it('should ', () => {
            const object = { 
                method(arg: number): void {
                    // no-op
                } 
            };

            const spy = sinon.spy(object, 'method');

            object.method(6);
            object.method(8);
            object.method(10);

            const firstCall = spy.getCall(0);
            const firstCallFirstArg = firstCall.args[0];
            
            const secondCall = spy.getCall(1);
            const secondCallFirstArg = secondCall.args[0];
            
            const thirdCall = spy.getCall(2);
            const thirdCallFirstArg = thirdCall.args[0];

            const calls = spy.getCalls();
            console.log(calls);
            
            expect(firstCallFirstArg).to.equal(6);
            expect(secondCallFirstArg).to.equal(8);
            expect(thirdCallFirstArg).to.equal(10);

            expect(calls[0].args[0]).to.equal(6);
            expect(calls[1].args[0]).to.equal(8);
            expect(calls[2].args[0]).to.equal(10);
        });
    });
});    
