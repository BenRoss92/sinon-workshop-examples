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
});

