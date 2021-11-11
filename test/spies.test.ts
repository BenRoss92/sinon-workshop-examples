import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

describe('spy', () => {
    describe("#called", function () {
        it("Plain object: should have been called once with exact argument", function () {
            // Can spy on a function inside of an object
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

        it('Callback function: should have been called once', () => {
            function myFunction(condition: boolean, callback: () => void){
                if(condition){
                  callback();
                }
              }
              
            const callback = sinon.spy();
        
            myFunction(true, callback);
        
            expect(callback).to.have.been.calledOnce;
        });

        // Spying on an ES6 method that returns a promise is the same as spying on a method that returns a sychronous value
    });

    describe('#getCall and #getCalls', () => {
        it('should let us know what arguments were received in each call', () => {

            // Can spy on an ES6 instance method
            class Roulette {
                public betOnNumber (number: number) {
                    // do something ...
                }
            }

            const roulette = new Roulette();

            const spy = sinon.spy(roulette, 'betOnNumber');

            roulette.betOnNumber(6);
            roulette.betOnNumber(8);
            roulette.betOnNumber(10);
            
            // One way
            const firstCall = spy.getCall(0);
            const firstCallFirstArg = firstCall.args[0];
            
            const secondCall = spy.getCall(1);
            const secondCallFirstArg = secondCall.args[0];
            
            const thirdCall = spy.getCall(2);
            const thirdCallFirstArg = thirdCall.args[0];
            
            expect(firstCallFirstArg).to.equal(6);
            expect(secondCallFirstArg).to.equal(8);
            expect(thirdCallFirstArg).to.equal(10);

            // Another way
            const calls = spy.getCalls();

            expect(calls[0].args[0]).to.equal(6);
            expect(calls[1].args[0]).to.equal(8);
            expect(calls[2].args[0]).to.equal(10);
        });
    });
});    
