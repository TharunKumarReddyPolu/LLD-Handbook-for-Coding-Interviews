# 🎯 Abstraction in Object-Oriented Programming

## 📝 Definition
Abstraction is the process of hiding complex implementation details and showing only the necessary features of an object. It helps manage complexity by hiding unnecessary details and exposing only relevant features to the user.

## 🎯 Key Concepts

### 1. Abstract Classes
- Partial implementation of abstraction
- Can have both abstract and concrete methods
```java
public abstract class Vehicle {
    protected String brand;
    protected String model;
    
    // Abstract method - no implementation
    public abstract void start();
    
    // Concrete method - with implementation
    public void stop() {
        System.out.println("Vehicle stopping...");
    }
}

public class Car extends Vehicle {
    @Override
    public void start() {
        System.out.println("Car starting with key...");
    }
}
```

### 2. Interfaces
- Pure abstraction
- Contract for implementing classes
```java
public interface PaymentProcessor {
    void processPayment(double amount);
    boolean refund(double amount);
    PaymentStatus getStatus();
}

public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public void processPayment(double amount) {
        // Implementation for credit card payment
    }
    
    @Override
    public boolean refund(double amount) {
        // Implementation for credit card refund
        return true;
    }
    
    @Override
    public PaymentStatus getStatus() {
        // Implementation to get payment status
        return PaymentStatus.COMPLETED;
    }
}
```

## 💡 Best Practices

1. **Program to Interfaces**
   ```java
   // Good - programming to interface
   PaymentProcessor processor = new CreditCardProcessor();
   
   // Not as flexible
   CreditCardProcessor processor = new CreditCardProcessor();
   ```

2. **Use Abstract Classes for Common Functionality**
   ```java
   public abstract class DatabaseConnection {
       protected String connectionString;
       
       // Common functionality
       public void connect() {
           // Basic connection logic
       }
       
       // Abstract method for specific implementations
       protected abstract void executeQuery(String query);
   }
   ```

3. **Keep Interfaces Focused (Interface Segregation)**
   ```java
   // Bad - too many responsibilities
   interface Worker {
       void work();
       void eat();
       void sleep();
   }
   
   // Good - separated interfaces
   interface Workable {
       void work();
   }
   
   interface Eatable {
       void eat();
   }
   
   interface Sleepable {
       void sleep();
   }
   ```

## ⚠️ Common Pitfalls

1. **Too Much Abstraction**
   ```java
   // Unnecessary abstraction
   interface ICarFactory {
       ICar createCar();
   }
   
   interface ICar {
       void drive();
   }
   
   // Could be simpler
   class Car {
       void drive() { }
   }
   ```

2. **Leaky Abstraction**
   ```java
   public interface DataStore {
       void save(Object data);
       
       // Leaky abstraction - exposes implementation details
       void executeSQL(String query);  // Bad
   }
   ```

3. **Concrete Dependencies in Abstract Classes**
   ```java
   public abstract class Report {
       // Too specific, limits flexibility
       private PDFGenerator pdfGenerator;  // Bad
       
       // Better: use interface
       private DocumentGenerator generator;  // Good
   }
   ```

## 🎯 Interview Questions

1. **What's the difference between an interface and an abstract class?**
   ```java
   // Interface - pure abstraction
   interface Animal {
       void makeSound();  // Must be implemented
   }
   
   // Abstract class - partial implementation
   abstract class Animal {
       protected String name;  // Can have fields
       
       public void eat() {  // Can have concrete methods
           System.out.println("Eating...");
       }
       
       abstract void makeSound();  // Must be implemented
   }
   ```

2. **When would you use an abstract class vs an interface?**
   - Abstract class: When you have common functionality to share
   - Interface: When you want to define a contract without implementation

3. **How does abstraction help in managing complexity?**
   ```java
   // Complex internal implementation
   public class Car {
       private Engine engine;
       private Transmission transmission;
       private FuelSystem fuelSystem;
       
       // Simple abstract interface
       public void start() {
           engine.start();
           transmission.engage();
           fuelSystem.pump();
       }
   }
   ```

## 💻 Practice Exercise

Create a notification system using abstraction:

```java
// Abstract notification system
public interface NotificationService {
    void send(String message, String recipient);
    boolean validateRecipient(String recipient);
    NotificationStatus getStatus();
}

// Email implementation
public class EmailService implements NotificationService {
    @Override
    public void send(String message, String recipient) {
        if (validateRecipient(recipient)) {
            // Send email implementation
            System.out.println("Sending email to: " + recipient);
        }
    }
    
    @Override
    public boolean validateRecipient(String recipient) {
        return recipient != null && recipient.contains("@");
    }
    
    @Override
    public NotificationStatus getStatus() {
        return NotificationStatus.SENT;
    }
}

// SMS implementation
public class SMSService implements NotificationService {
    @Override
    public void send(String message, String recipient) {
        if (validateRecipient(recipient)) {
            // Send SMS implementation
            System.out.println("Sending SMS to: " + recipient);
        }
    }
    
    @Override
    public boolean validateRecipient(String recipient) {
        return recipient != null && recipient.matches("\\d{10}");
    }
    
    @Override
    public NotificationStatus getStatus() {
        return NotificationStatus.SENT;
    }
}

// Usage
public class NotificationManager {
    private List<NotificationService> services;
    
    public NotificationManager() {
        services = new ArrayList<>();
        services.add(new EmailService());
        services.add(new SMSService());
    }
    
    public void notifyAll(String message, String recipient) {
        services.forEach(service -> {
            if (service.validateRecipient(recipient)) {
                service.send(message, recipient);
            }
        });
    }
}
```

## 📚 Additional Resources

1. [Oracle Java Documentation on Abstract Classes](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html)
2. [Design Patterns - Gang of Four Book](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
3. [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) 