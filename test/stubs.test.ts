import chai from "chai";
import http from "http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("stubs", () => {
	beforeEach(() => {
		sinon.restore();
	});

	describe("#stub", () => {
		it("should stub a synchronous ES6 method using 'returns' method", () => {
			class Weather {
				// tells us whether it's raining or not
				isRaining(): boolean {
					return false;
				}
			}

			class Person {
				constructor(private readonly weather: Weather) {}
				// tells us whether we need to bring an umbrella or not based on the weather
				shouldBringUmbrella(): boolean {
					return this.weather.isRaining();
				}
			}

			// Pretend that the weather is raining:
			// Create a real Weather object
			const weather = new Weather();
			// Replace only the method we want to stub (i.e. isRaining) with a stubbed version of that method:
			sinon.stub(weather, "isRaining").returns(true);

			// Inject the stubbed version of Weather
			const person = new Person(weather);

			// shouldBringUmbrella should now equal true instead of false;
			expect(person.shouldBringUmbrella()).to.be.true;

			// The Stub API extends the Spy API. So a stub can do everything that a spy can do and more.
			// e.g. We can find out how many times a stub was called
			expect(weather.isRaining).to.have.been.calledOnce;
		});

		it("should stub an asynchronous ES6 method using 'resolves' method", async () => {
			class Weather {
				// Now an async method:
				isRaining(): Promise<boolean> {
					return Promise.resolve(false);
				}
			}

			class Person {
				constructor(private readonly weather: Weather) {}

				// Now an async method:
				shouldBringUmbrella(): Promise<boolean> {
					return this.weather.isRaining();
				}
			}

			const weather = new Weather();

			// 'Resolves' returns a promise which resolves to the value passed in
			sinon.stub(weather, "isRaining").resolves(true);

			const person = new Person(weather);

			// Wait for the promise to resolve
			const result = await person.shouldBringUmbrella();
			expect(result).to.be.true;

			// You can optionally check whether the stubbed method was called (this works the same with synchronous methods)
			expect(weather.isRaining).to.have.been.calledOnce;
		});

		it("should stub a callback function", () => {
			// Check whether I should take an umbrella based on whether it's sunny
			function shouldBringUmbrella(isSunny: () => boolean): boolean {
				if (isSunny()) {
					return false;
				}
				return true;
			}

			const isSunny = sinon.stub().returns(true);

			expect(shouldBringUmbrella(isSunny)).to.be.false;
		});
	});

	describe("#throws", () => {
		it("should stub a synchronous method to throw a error", () => {
			class Weather {
				// default is that it's raining
				// imagine this value comes from an Rx observable and that an error could be thrown.
				isRaining() {
					return true;
				}
			}

			class Person {
				constructor(private readonly weather: Weather) {}

				shouldBringUmbrella() {
					try {
						// imagine we don't control this Weather class (it's a third-party dependency that can throw)
						this.weather.isRaining();
					} catch (error) {
						// this path is what we want to test
						// return out own custom message to the user
						return "something went wrong";
					}
				}
			}

			const weather = new Weather();

			// We want to test the path that occurs when an error is thrown by isRaining which we don't control
			sinon.stub(weather, "isRaining").throws();

			const person = new Person(weather);

			expect(person.shouldBringUmbrella()).to.equal("something went wrong");
		});
	});

	describe("#rejects", () => {
		it("should stub an async method to reject", async () => {
			class Weather {
				// default is that it's raining
				// imagine this value comes from an Rx observable and that an error could be thrown.
				async isRaining() {
					return true;
				}
			}

			class Person {
				constructor(private readonly weather: Weather) {}

				async shouldBringUmbrella() {
					try {
						// imagine we don't control this Weather class (it's a third-party dependency that can throw)
						await this.weather.isRaining();
					} catch (error) {
						// this path is what we want to test
						// return out own custom message to the user
						return "something went wrong";
					}
				}
			}

			const weather = new Weather();

			// We want to test the path that occurs when an error is thrown by isRaining which we don't control
			sinon.stub(weather, "isRaining").rejects();

			const person = new Person(weather);

			const result = await person.shouldBringUmbrella();

			expect(result).to.equal("something went wrong");
		});
	});

	describe("#withArgs", () => {
		it("should make the stub behave differently based when receiving different arguments", () => {
			// Just a plain function (as an example)
			const stub = sinon.stub();
			// When this stubbed function receives the argument 42, it will return 1
			stub.withArgs(42).returns(1);

			// We can make the stub throw an exception based on receiving a certain argument
			const error = new Error("name");
			stub.withArgs(1).throws(error);

			expect(stub()).to.be.undefined;

			expect(stub(42)).to.equal(1);

			// Check how many times we called the stub with argument 42
			expect(stub.withArgs(42).callCount).to.equal(1);

			try {
				stub(1);
			} catch (error) {
				expect(error).to.equal(error);
			}
		});
	});

	describe("#callsFake", () => {
		it("should make the stub call a fake function", () => {
			// One use case of callsFake could be when using an in-memory test database instead of a real database for a test - see https://martinfowler.com/bliki/InMemoryTestDatabase.html

			class Database {
				// For the sake of this exercise, pretend that this method creates a real database connection and doesn't return anything - we don't want to use a real database in our unit test.
				save(name: string) {
					// saves data to a database ...
				}
			}

			class User {
				constructor(private readonly db: Database) {}

				saveName(name: string): string {
					// We just want our test to not end up failing on this line just because we don't have a real database
					this.db.save(name);
					// This is the line we care about testing
					return "Name has been saved!";
				}
			}

			const fakeStorage: string[] = [];

			const db = new Database();
			sinon.stub(db, "save").callsFake(function fakeSave(name) {
				fakeStorage.push(name);
			});
			const user = new User(db);
			const name = "Ben";
			const result = user.saveName(name);

			// Not good to test your fake implementation or do internal logic in your test: I'm just showing that it's possible in case it's needed:
			expect(fakeStorage).to.include(name);

			expect(result).to.equal("Name has been saved!");
		});
	});

	describe("#yields", () => {
		it("should stub a function that takes a callback function as an argument, and call this callback function with no arguments", () => {
			const callback = sinon.spy();

			const get = sinon.stub(http, "get");
			get.yields();

			http.get("http://www.test.com", callback);

			expect(callback).to.have.been.calledOnce;
			expect(callback.getCall(0).args[0]).to.equal(undefined);
		});

		it("should stub a function that takes a callback function as an argument, and call this callback function with certain arguments", () => {
			const callback = sinon.spy();

			const get = sinon.stub(http, "get");
			get.yields("a", "b", "c");

			http.get("http://www.test.com", callback);

			expect(callback).to.have.been.calledOnce;
			expect(callback.getCall(0).args).to.eql(["a", "b", "c"]);
		});
	});

	describe("#returnsThis", () => {
		it('should stub a function and return the "this" value of that function', () => {
			// `returnsThis` can be used to stub "fluent APIs" (i.e. methods that are chained, e.g. jQuery):
			// ```
			// $("p")
			// 	.css("color", "green")
			//  .animate({ width: "100%" })
			//  .animate({ fontSize: "46px" });
			// ```

			// Imagine we're importing an imaginary third-party library called `DatabaseLibrary` - this is the TypeScript interface that is made available to us:
			interface DatabaseLibrary {
				// Each method returns the `this` value (i.e. the surrounding `DatabaseLibrary` object):
				connect: () => DatabaseLibrary;
				wipe: () => DatabaseLibrary;
				addTestData: () => DatabaseLibrary;
			}

			class Database {
				// We inject the `DatabaseLibrary` into the constructor to later use dependency injection
				constructor(private readonly dbLibrary: DatabaseLibrary) {}

				// We want to test the `setUpDb` method
				setUpDb() {
					this.dbLibrary
						.connect()
						.wipe()
						.addTestData();
				}
			}

			// N.B. GOTCHA:
			// Sinon will throw the following error if you attempt the below: "'DatabaseLibrary' only refers to a type, but is being used as a value here."
			// This is a limitation of the Sinon library. Sinon cannot create Test Doubles from things that don't get turned into real JavaScript objects after the TypeScript compiler compiles the TypeScript code. Therefore we cannot create Test Doubles directly for e.g. interfaces, types, etc. (in this case, an interface):
			// sinon.stub(DatabaseLibrary, 'connect');

			// We need to instead create a tangible object that Sinon can understand
			const dbLibTestDouble: DatabaseLibrary = {
				connect: function () {
					throw new Error('Not implemented'); 
				},
				wipe: function () {
					throw new Error('Not implemented');
				},
				addTestData: function () {
					throw new Error('Not implemented');
				}
			};

			// Now we can use Sinon to add behaviour to our test double:
			sinon.stub(dbLibTestDouble, 'connect').returnsThis();
			sinon.stub(dbLibTestDouble, 'wipe').returnsThis();
			sinon.stub(dbLibTestDouble, 'addTestData').returnsThis();

			const database = new Database(dbLibTestDouble);

			database.setUpDb();

			expect(dbLibTestDouble.connect).to.have.been.calledOnce;
			expect(dbLibTestDouble.wipe).to.have.been.calledOnce;
			expect(dbLibTestDouble.addTestData).to.have.been.calledOnce;
		});

		it("should be used correctly in all of our cloud services, but currently it isn't", () => {
			// All of the following cloud services use the incorrect code below: 
			// - discover-ondemand-query-v2 - https://github.cldsvcs.com/youview/discover-ondemand-query-v2/blob/master/test/unit/mock/mocSolrClientLib.js
			// - discover-ondemand-query-v1 - https://github.cldsvcs.com/youview/discover-ondemand-query-v1/blob/master/test/unit/mock/mockSolrClientLib.js
			// - discover-iponlypoc-service-v1 - https://github.cldsvcs.com/youview/discover-iponlypoc-service-v1/blob/master/test/unit/mock/mock_solr_client_lib.js
			function mockClientFactory(params: any) {

				var defaultFunc = sinon.stub().returnsThis();
			  
				if (!params.createQuery)  { params.createQuery  = defaultFunc; }
				if (!params.q)            { params.q            = defaultFunc; }
				if (!params.start)        { params.start        = defaultFunc; }
				if (!params.rows)         { params.rows         = defaultFunc; }
				if (!params.sort)         { params.sort         = defaultFunc; }
				if (!params.search)       { params.search       = defaultFunc; }
				if (!params.set)          { params.set          = defaultFunc; }
				if (!params.fl)           { params.fl           = defaultFunc; }

				// Changing to this would make our assertions pass:
				// if (!params.createQuery)  { params.createQuery  = sinon.stub().returnsThis(); }
				// if (!params.q)            { params.q            = sinon.stub().returnsThis(); }
				// if (!params.start)        { params.start        = sinon.stub().returnsThis(); }
				// if (!params.rows)         { params.rows         = sinon.stub().returnsThis(); }
				// if (!params.sort)         { params.sort         = sinon.stub().returnsThis(); }
				// if (!params.search)       { params.search       = sinon.stub().returnsThis(); }
				// if (!params.set)          { params.set          = sinon.stub().returnsThis(); }
				// if (!params.fl)           { params.fl           = sinon.stub().returnsThis(); }

				function make() {
				  return params;
				}
			  
				return make;
			}

			const mockClient  = mockClientFactory({ 
				q: sinon.stub().returnsThis(), 
				rows: sinon.stub().returnsThis() 
			});

			const client = mockClient();

			client
				.createQuery()
				.q()
				.start()
				.rows()
				.sort()
				.search()
				.set()
				.fl();

			// You get strange, unexpected behaviour if you reuse the same stubbed function + create some weird function inside of your test file like this:

			// Instead of us keeping track of the calls to each method (e.g. client.fl is called once, client.set is called once), we're now keeping track of only the number of calls made to one method, and then every time a different method is called, we're adding those number of calls onto the same count/total. So because each method is treated as `createQuery`, we're told that we've called `createQuery` 6 times, even though we've called `createQuery` once and the other 5 methods once. We are also checking the number of calls to `createQuery` only, not the other methods (as can be seen by `createQuery` popping up in every assertion error):
			// UNCOMMENT TO SEE FAILURES. COMMENT OUT FAILED LINES TO SEE PASSING LINES.
			// expect(client.createQuery).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times
			// expect(client.q).to.have.been.calledOnce; // passes - this is due to both 'q' and 'rows' being assigned two different stubbed functions, rather than re-using the same stubbed function that was used for all of the other methods in the mockClientFactory.
			// expect(client.start).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times
			// expect(client.rows).to.have.been.calledOnce; // passes
			// expect(client.sort).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times
			// expect(client.search).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times
			// expect(client.set).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times
			// expect(client.fl).to.have.been.calledOnce; // Fails - AssertionError: expected createQuery to have been called exactly once, but it was called 6 times

			// I think it would make things less risky if we stubbed methods in this way (as shown in the Sinon docs):
			// ```
			// var stub = sinon.createStubInstance(MyConstructor);
			// stub.foo.returnsThis();
			// ```
		});
	});
});
