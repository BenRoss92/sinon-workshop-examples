# Dummy

```typescript
// Boilerplate to prevent compilation errors.
declare type Sale = any;
declare type CreditCard = any;
declare const describe: Function;
declare const it: Function;
declare const expect: Function

// The real Logger object which we'll replace with a Dummy object
interface Logger {
    // A void method (that doesn't return anything)
    append(text: String): void;
}

// Our unit under test
class PaymentService {
    // Needs a Logger object - we can swap the real one for a Dummy
    private logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public createPaymentRequest(sale: Sale, creditCard: CreditCard): PaymentRequest {
        // Let's pretend for our test that we don't care about whether we log anything.
        // We're not interested in this line. We're interested in the line after it (checking an error was thrown).
        // We just want the next line to execute without any problems.
        // In this case, when we don't need any pretend behaviour, we can use a Dummy.
        this.logger.append("Creating payment for sale " + sale.toString());
        throw new Error();
    }
}

// Our Dummy object
class LoggerDummy implements Logger {

    // Our Dummy's append method has no behaviour (it doesn't need any behaviour to make our code work).
    public append(text: String): void {}
}

// Our test
describe("PaymentServiceShould", () => {
    it("should create payment request", () => {
        // Create a Dummy object
        const loggerDummy = new LoggerDummy();
        const sale: Sale = ["customer", "items"];
        const creditCard: CreditCard = ["customer", "1"];

        // Pass this Dummy object into the constructor of our unit under test
        const paymentService = new PaymentService(loggerDummy);
        // Calling the method we're testing now works using the Dummy object instead of the real Logger.
        const actual = paymentService.createPaymentRequest(sale, creditCard);
        expect(actual).not.to.be.undefined;
    });
})
```
