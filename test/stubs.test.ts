import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("stubs", () => {
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

	describe("#stub", () => {
		it("should stub an individual method of an ES6 class", () => {
			// Pretend that the weather is raining:
			// Create a real Weather object
			const weather = new Weather();
			// Replace only the method we want to stub (i.e. isRaining) with a stubbed version of that method:
			sinon.stub(weather, "isRaining").returns(true);

			// Inject the stubbed version of Weather
			const person = new Person(weather);

			// shouldBringUmbrella should now equal true instead of false;
			expect(person.shouldBringUmbrella()).to.be.true;
		});
	});
});

