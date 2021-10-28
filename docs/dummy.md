# Dummy

```java
// The real Logger object which we'll replace with a Dummy object
public interface Logger {
    // A void method (that doesn't return anything)
    void append(String text);
}

// Our unit under test
public class PaymentService {
    // Needs a Logger object - we can swap the real one for a Dummy
    private Logger logger;

    public PaymentService(Logger logger) {
        this.logger = logger;
    }

    public PaymentRequest createPaymentRequest(Sale sale, CreditCard creditCard) {
        // Let's pretend for our test that we don't care about whether we log anything.
        // We're not interested in this line. We're interested in the line after it (checking an error was thrown).
        // We just want the next line to execute without any problems.
        // In this case, when we don't need any pretend behaviour, we can use a Dummy.
        logger.append("Creating payment for sale " + sale.toString());
        throw new UnsupportedOperationException();
    }
}

// Our Dummy object
public class LoggerDummy implements Logger {

    @Override
    // Our Dummy's append method has no behaviour (it doesn't need any behaviour to make our code work).
    public void append(String text) {}
}

class PaymentServiceShould {

    // Our test
    @Test
    void create_payment_request() {
        // Create a Dummy object
        LoggerDummy loggerDummy = new LoggerDummy();
        Customer customer= new Customer("name", "address");
        Item item = new Item("item", 1000);
        List<Item> items= asList(item);
        Sale sale = new Sale(customer, items);
        CreditCard creditCard = new CreditCard(customer, "1");

        // Pass this Dummy object into the constructor of our unit under test
        PaymentService paymentService = new PaymentService(loggerDummy);
        // Calling the method we're testing now works using the Dummy object instead of the real Logger.
        PaymentRequest actual = paymentService.createPaymentRequest(sale, creditCard);
        assertEquals(new PaymentRequest(1000, "1"), actual);
    }
}
```