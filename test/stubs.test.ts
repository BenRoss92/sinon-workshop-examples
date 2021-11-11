import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("stubs", () => {
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
});

