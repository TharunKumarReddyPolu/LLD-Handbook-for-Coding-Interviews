# 🔓 Open/Closed Principle (OCP)

## 📝 Definition
The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification. This means you should be able to add new functionality without changing existing code.

## 🎯 Key Concepts

### 1. Open for Extension
- New behavior can be added by creating new classes
- Existing functionality can be extended through inheritance or interfaces
```java
// Interface defining shape behavior
public interface Shape {
    double calculateArea();
}

// Existing implementation
public class Rectangle implements Shape {
    private double width;
    private double height;
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}

// Adding new shape without modifying existing code
public class Circle implements Shape {
    private double radius;
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

### 2. Closed for Modification
- Existing code should not need to be modified to add new functionality
- Core functionality should be stable and well-tested
```java
// Bad - requires modification for new shapes
public class AreaCalculator {
    public double calculateArea(Object shape) {
        if (shape instanceof Rectangle) {
            Rectangle rectangle = (Rectangle) shape;
            return rectangle.getWidth() * rectangle.getHeight();
        } else if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            return Math.PI * circle.getRadius() * circle.getRadius();
        }
        throw new IllegalArgumentException("Unsupported shape");
    }
}

// Good - no modification needed for new shapes
public class AreaCalculator {
    public double calculateArea(Shape shape) {
        return shape.calculateArea();
    }
}
```

## 💡 Best Practices

1. **Use Interfaces and Abstract Classes**
   ```java
   public interface PaymentProcessor {
       void processPayment(double amount);
   }
   
   public class CreditCardProcessor implements PaymentProcessor {
       @Override
       public void processPayment(double amount) {
           // Process credit card payment
       }
   }
   
   public class PayPalProcessor implements PaymentProcessor {
       @Override
       public void processPayment(double amount) {
           // Process PayPal payment
       }
   }
   
   // Client code remains unchanged
   public class PaymentService {
       private PaymentProcessor processor;
       
       public PaymentService(PaymentProcessor processor) {
           this.processor = processor;
       }
       
       public void makePayment(double amount) {
           processor.processPayment(amount);
       }
   }
   ```

2. **Strategy Pattern**
   ```java
   public interface DiscountStrategy {
       double calculateDiscount(double amount);
   }
   
   public class RegularDiscount implements DiscountStrategy {
       @Override
       public double calculateDiscount(double amount) {
           return amount * 0.1; // 10% discount
       }
   }
   
   public class PremiumDiscount implements DiscountStrategy {
       @Override
       public double calculateDiscount(double amount) {
           return amount * 0.2; // 20% discount
       }
   }
   
   public class PriceCalculator {
       private DiscountStrategy discountStrategy;
       
       public void setDiscountStrategy(DiscountStrategy strategy) {
           this.discountStrategy = strategy;
       }
       
       public double calculateFinalPrice(double amount) {
           return amount - discountStrategy.calculateDiscount(amount);
       }
   }
   ```

3. **Template Method Pattern**
   ```java
   public abstract class ReportGenerator {
       // Template method
       public final void generateReport() {
           gatherData();
           analyzeData();
           writeReport();
       }
       
       protected abstract void gatherData();
       protected abstract void analyzeData();
       
       // Common implementation
       protected void writeReport() {
           System.out.println("Writing report...");
       }
   }
   
   public class SalesReportGenerator extends ReportGenerator {
       @Override
       protected void gatherData() {
           // Gather sales data
       }
       
       @Override
       protected void analyzeData() {
           // Analyze sales data
       }
   }
   ```

## ⚠️ Common Pitfalls

1. **Switch Statements Based on Type**
   ```java
   // Bad - violates OCP
   public class AnimalSound {
       public void makeSound(String animalType) {
           switch (animalType) {
               case "dog":
                   System.out.println("Woof");
                   break;
               case "cat":
                   System.out.println("Meow");
                   break;
               // Adding new animal requires modifying this code
           }
       }
   }
   
   // Good - follows OCP
   public interface Animal {
       void makeSound();
   }
   
   public class Dog implements Animal {
       @Override
       public void makeSound() {
           System.out.println("Woof");
       }
   }
   
   public class Cat implements Animal {
       @Override
       public void makeSound() {
           System.out.println("Meow");
       }
   }
   ```

2. **Type Checking and Casting**
   ```java
   // Bad - requires modification for new types
   public class ShapeDrawer {
       public void draw(Object shape) {
           if (shape instanceof Circle) {
               drawCircle((Circle) shape);
           } else if (shape instanceof Rectangle) {
               drawRectangle((Rectangle) shape);
           }
       }
   }
   
   // Good - polymorphic behavior
   public interface Shape {
       void draw();
   }
   
   public class ShapeDrawer {
       public void draw(Shape shape) {
           shape.draw();
       }
   }
   ```

3. **Hard-Coded Dependencies**
   ```java
   // Bad - hard-coded dependency
   public class OrderProcessor {
       private MySQLDatabase database = new MySQLDatabase();
   }
   
   // Good - dependency injection
   public class OrderProcessor {
       private Database database;
       
       public OrderProcessor(Database database) {
           this.database = database;
       }
   }
   ```

## 🎯 Interview Questions

1. **How does OCP help with maintainability?**
   - Reduces risk of bugs in existing code
   - Makes codebase more stable
   - Easier to add new features
   - Better separation of concerns

2. **Explain how to refactor this code to follow OCP:**
   ```java
   // Before
   public class Calculator {
       public double calculate(String operation, double a, double b) {
           switch (operation) {
               case "add": return a + b;
               case "subtract": return a - b;
               // Adding new operation requires modifying this class
           }
           throw new IllegalArgumentException("Unknown operation");
       }
   }
   
   // After
   public interface Operation {
       double execute(double a, double b);
   }
   
   public class Addition implements Operation {
       @Override
       public double execute(double a, double b) {
           return a + b;
       }
   }
   
   public class Subtraction implements Operation {
       @Override
       public double execute(double a, double b) {
           return a - b;
       }
   }
   
   public class Calculator {
       public double calculate(Operation operation, double a, double b) {
           return operation.execute(a, b);
       }
   }
   ```

3. **What design patterns help achieve OCP?**
   - Strategy Pattern
   - Template Method Pattern
   - Factory Pattern
   - Decorator Pattern

## 💻 Practice Exercise

Create a notification system following OCP:

```java
// Notification system following OCP
public interface NotificationChannel {
    void send(String message);
}

public class EmailNotification implements NotificationChannel {
    private String emailAddress;
    
    public EmailNotification(String emailAddress) {
        this.emailAddress = emailAddress;
    }
    
    @Override
    public void send(String message) {
        System.out.println("Sending email to " + emailAddress + ": " + message);
    }
}

public class SMSNotification implements NotificationChannel {
    private String phoneNumber;
    
    public SMSNotification(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    @Override
    public void send(String message) {
        System.out.println("Sending SMS to " + phoneNumber + ": " + message);
    }
}

public class PushNotification implements NotificationChannel {
    private String deviceToken;
    
    public PushNotification(String deviceToken) {
        this.deviceToken = deviceToken;
    }
    
    @Override
    public void send(String message) {
        System.out.println("Sending push notification to " + deviceToken + ": " + message);
    }
}

public class NotificationService {
    private List<NotificationChannel> channels;
    
    public NotificationService() {
        this.channels = new ArrayList<>();
    }
    
    public void addChannel(NotificationChannel channel) {
        channels.add(channel);
    }
    
    public void sendNotification(String message) {
        for (NotificationChannel channel : channels) {
            channel.send(message);
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        NotificationService service = new NotificationService();
        
        service.addChannel(new EmailNotification("user@example.com"));
        service.addChannel(new SMSNotification("+1234567890"));
        service.addChannel(new PushNotification("device-token-123"));
        
        // Send notification through all channels
        service.sendNotification("Hello, World!");
        
        // Adding new channel type doesn't require modifying existing code
        service.addChannel(new SlackNotification("workspace-channel"));
    }
}
```

## 📚 Additional Resources

1. [Clean Code by Robert C. Martin - Chapter 9: Unit Tests](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
2. [Design Patterns - Gang of Four](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
3. [SOLID Principles in Java](https://www.baeldung.com/solid-principles) 