import { expect } from "chai";
import sinon from "sinon";
import { Ben } from "../src/Ben";
import { CakeManager } from "../src/CakeManager";

describe('Sandboxes', () => {
    describe('Create a new instance of CakeManager and Ben for each test', () => {
        describe('Ben wants to eat cake', () => {
            describe('canEatCake', () => {
                describe('when there is no cake left', () => {
                    it('should return false', () => {
                        const cakeManager = new CakeManager();
                        const ben = new Ben(cakeManager);
    
                        sinon.stub(cakeManager, 'isThereCake').returns(false);
                
                        expect(ben.canEatCake()).to.equal(false);
                    });
    
                });
    
                describe('when there is cake left', () => {
                    it('should return true', () => {
                        const cakeManager = new CakeManager();
                        const ben = new Ben(cakeManager);
    
                        sinon.stub(cakeManager, 'isThereCake').returns(true);
                
                        expect(ben.canEatCake()).to.equal(true);
                    });
                });
            });
        });
    });

    // Uncomment to run the test:
    // describe('Broken - Share an instance of CakeManager and Ben between tests: already wrapped', () => {
    //    // Sharing these instances of the classes in different tests - Sinon wraps these objects, 
    // // so if we hold onto a reference of them in between tests and don't tell Sinon to reset the behaviour of the 'isThereCake' Test Double,
    // // then Sinon will tell us that we've already created a Test Double for the 'isThereCake' method inside of the Sinon sandbox with certain behaviour.
    //     const cakeManager = new CakeManager();
    //     const ben = new Ben(cakeManager);
    //
    //     describe('Ben wants to eat cake', () => {
    //         describe('canEatCake', () => {
    //             describe('when there is no cake left', () => {
    //                 it('should return false', () => {
    //                     sinon.stub(cakeManager, 'isThereCake').returns(false);

    //                     expect(ben.canEatCake()).to.equal(false);
    //                 });
    //             });
    
    //             // Without restoring our sandbox in between tests, this test throws an error stating that the method isThereCake has already been "wrapped" (mocked) by Sinon inside of our sandbox object.
    //             // Tells us that we need to restore the original (real) behaviour of the isThereCake method, before we mock it again in another test.
    //             describe('when there is cake left', () => {
    //                 it('should return true', () => {
    //                     sinon.stub(cakeManager, 'isThereCake').returns(true);

    //                     expect(ben.canEatCake()).to.equal(true);
    //                 });
    //             });
    //         });
    //     });
    // });

    //  AssertionError: expected false to equal true
    // describe('Broken - Share an instance of CakeManager and Ben between tests: previous test affects this test', () => {
    //     const cakeManager = new CakeManager();
    //     const ben = new Ben(cakeManager);

    //     describe('Ben wants to eat cake', () => {
    //         describe('canEatCake', () => {
    //             describe('when there is no cake left', () => {
    //                 it('should return false', () => {
    //                     sinon.stub(cakeManager, 'isThereCake').returns(false);

    //                     expect(ben.canEatCake()).to.equal(false);
    //                 });
    //             });
    
    //             // Without restoring our sandbox in between tests, this test throws an error stating that the method isThereCake has already been "wrapped" (mocked) by Sinon inside of our sandbox object.
    //             // Tells us that we need to restore the original (real) behaviour of the isThereCake method, before we mock it again in another test.
    //             describe('when there is cake left', () => {
    //                 it('should return true', () => {
    //                     // The behaviour we added for the mocked `isThereCake` method in our last test is causing this test to fail due to the mock having the wrong behaviour - another reason to reset the behaviour in between tests to ensure that our tests aren't affected by the behaviour of previous test mocks.
    //                     expect(ben.canEatCake()).to.equal(true);
    //                 });
    //             });
    //         });
    //     });
    // });

    // WORKS:
    // Restore all of the mocked objects in between tests (after each test)
    // CakeManager.isThereCake() method return value gets restored to whatever the original value is in the source code.
    describe('Share an instance of CakeManager and Ben between tests: restore mock between tests ', () => {
        describe('canEatCake', () => {
            const cakeManager = new CakeManager();
            const ben = new Ben(cakeManager);

            afterEach(() => {
                sinon.restore();
                // Alternatively, if you don't want to restore all of the mocked objects (using `sinon.restore()`), you can also restore a mock/s explicitly by either:
                    // calling:
                        // (cakeManager.isThereCake as SinonStub).restore();
                    // OR if you originally needed to assign this mocked method as a variable to be re-used, you can call `restore` on that variable:
                        // const stub = sinon.stub(cakeManager, 'isThereCake').returns(false);
                        // stub.restore();
            });

            describe('when there is no cake left', () => {
                it('should return false', () => {
                    sinon.stub(cakeManager, 'isThereCake').returns(false);
            
                    expect(ben.canEatCake()).to.equal(false);
                });
            });

            describe('when there is cake left', () => {
                it('should return true', () => {
                    sinon.stub(cakeManager, 'isThereCake').returns(true);
            
                    expect(ben.canEatCake()).to.equal(true);
                });
            });
        });
    });
});