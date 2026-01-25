# 🔓 Open/Closed Principle (OCP)

## 📝 Definition
The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification. This means you should be able to add new functionality without changing existing code.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying OCP, you should understand:
- [Single Responsibility Principle (SRP)](srp.md) - Classes should have one reason to change
- [Inheritance](../ood-basics/inheritance.md) - Extending classes
- [Interfaces](../ood-basics/interfaces.md) - Defining contracts
- [Polymorphism](../ood-basics/polymorphism.md) - Runtime behavior changes

### Learning Path
After mastering OCP, continue with:
1. **Next:** [Liskov Substitution Principle (LSP)](lsp.md) - Proper inheritance hierarchies
2. **Then:** [Interface Segregation Principle (ISP)](isp.md) - Focused interfaces
3. **Related:** [Strategy Pattern](../design-patterns/behavioral/README.md) - Common OCP implementation

### How OCP Fits in the Big Picture
```
SRP → OCP → LSP → ISP → DIP
       ↓
OCP enables adding features without breaking existing code
Key patterns: Strategy, Template Method, Decorator
```

## 🎯 Key Concepts

### 1. Open for Extension
- New behavior can be added by creating new classes
- Existing functionality can be extended through inheritance or interfaces

#### Java
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

#### Python
```python
from abc import ABC, abstractmethod
import math

# Interface defining shape behavior
class Shape(ABC):
    @abstractmethod
    def calculate_area(self) -> float:
        pass

# Existing implementation
class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    
    def calculate_area(self) -> float:
        return self.width * self.height

# Adding new shape without modifying existing code
class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius
    
    def calculate_area(self) -> float:
        return math.pi * self.radius ** 2
```

#### C++
```cpp
#include <cmath>

// Interface defining shape behavior
class Shape {
public:
    virtual ~Shape() = default;
    virtual double calculateArea() const = 0;
};

// Existing implementation
class Rectangle : public Shape {
private:
    double width;
    double height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double calculateArea() const override {
        return width * height;
    }
};

// Adding new shape without modifying existing code
class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    double calculateArea() const override {
        return M_PI * radius * radius;
    }
};
```

### 2. Closed for Modification
- Existing code should not need to be modified to add new functionality
- Core functionality should be stable and well-tested

#### Java
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

#### Python
```python
# Bad - requires modification for new shapes
class AreaCalculatorBad:
    def calculate_area(self, shape) -> float:
        if isinstance(shape, Rectangle):
            return shape.width * shape.height
        elif isinstance(shape, Circle):
            return math.pi * shape.radius ** 2
        raise ValueError("Unsupported shape")

# Good - no modification needed for new shapes
class AreaCalculator:
    def calculate_area(self, shape: Shape) -> float:
        return shape.calculate_area()
```

#### C++
```cpp
// Bad - requires modification for new shapes
class AreaCalculatorBad {
public:
    double calculateArea(void* shape, const std::string& type) {
        if (type == "rectangle") {
            auto* rect = static_cast<Rectangle*>(shape);
            return rect->getWidth() * rect->getHeight();
        } else if (type == "circle") {
            auto* circle = static_cast<Circle*>(shape);
            return M_PI * circle->getRadius() * circle->getRadius();
        }
        throw std::invalid_argument("Unsupported shape");
    }
};

// Good - no modification needed for new shapes
class AreaCalculator {
public:
    double calculateArea(const Shape& shape) {
        return shape.calculateArea();
    }
};
```

## 💡 Best Practices

1. **Use Interfaces and Abstract Classes**

   #### Java
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

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class PaymentProcessor(ABC):
       @abstractmethod
       def process_payment(self, amount: float) -> None:
           pass

   class CreditCardProcessor(PaymentProcessor):
       def process_payment(self, amount: float) -> None:
           # Process credit card payment
           print(f"Processing ${amount} via credit card")

   class PayPalProcessor(PaymentProcessor):
       def process_payment(self, amount: float) -> None:
           # Process PayPal payment
           print(f"Processing ${amount} via PayPal")

   # Client code remains unchanged
   class PaymentService:
       def __init__(self, processor: PaymentProcessor):
           self._processor = processor
       
       def make_payment(self, amount: float) -> None:
           self._processor.process_payment(amount)
   ```

   #### C++
   ```cpp
   class PaymentProcessor {
   public:
       virtual ~PaymentProcessor() = default;
       virtual void processPayment(double amount) = 0;
   };

   class CreditCardProcessor : public PaymentProcessor {
   public:
       void processPayment(double amount) override {
           // Process credit card payment
       }
   };

   class PayPalProcessor : public PaymentProcessor {
   public:
       void processPayment(double amount) override {
           // Process PayPal payment
       }
   };

   // Client code remains unchanged
   class PaymentService {
   private:
       std::unique_ptr<PaymentProcessor> processor;
   public:
       PaymentService(std::unique_ptr<PaymentProcessor> p) 
           : processor(std::move(p)) {}
       
       void makePayment(double amount) {
           processor->processPayment(amount);
       }
   };
   ```

2. **Strategy Pattern**

   #### Java
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

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class DiscountStrategy(ABC):
       @abstractmethod
       def calculate_discount(self, amount: float) -> float:
           pass

   class RegularDiscount(DiscountStrategy):
       def calculate_discount(self, amount: float) -> float:
           return amount * 0.1  # 10% discount

   class PremiumDiscount(DiscountStrategy):
       def calculate_discount(self, amount: float) -> float:
           return amount * 0.2  # 20% discount

   class PriceCalculator:
       def __init__(self):
           self._discount_strategy: DiscountStrategy = None
       
       def set_discount_strategy(self, strategy: DiscountStrategy) -> None:
           self._discount_strategy = strategy
       
       def calculate_final_price(self, amount: float) -> float:
           return amount - self._discount_strategy.calculate_discount(amount)
   ```

   #### C++
   ```cpp
   class DiscountStrategy {
   public:
       virtual ~DiscountStrategy() = default;
       virtual double calculateDiscount(double amount) const = 0;
   };

   class RegularDiscount : public DiscountStrategy {
   public:
       double calculateDiscount(double amount) const override {
           return amount * 0.1; // 10% discount
       }
   };

   class PremiumDiscount : public DiscountStrategy {
   public:
       double calculateDiscount(double amount) const override {
           return amount * 0.2; // 20% discount
       }
   };

   class PriceCalculator {
   private:
       std::unique_ptr<DiscountStrategy> discountStrategy;
   public:
       void setDiscountStrategy(std::unique_ptr<DiscountStrategy> strategy) {
           discountStrategy = std::move(strategy);
       }
       
       double calculateFinalPrice(double amount) const {
           return amount - discountStrategy->calculateDiscount(amount);
       }
   };
   ```

3. **Template Method Pattern**

   #### Java
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

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class ReportGenerator(ABC):
       # Template method
       def generate_report(self) -> None:
           self._gather_data()
           self._analyze_data()
           self._write_report()
       
       @abstractmethod
       def _gather_data(self) -> None:
           pass
       
       @abstractmethod
       def _analyze_data(self) -> None:
           pass
       
       # Common implementation
       def _write_report(self) -> None:
           print("Writing report...")

   class SalesReportGenerator(ReportGenerator):
       def _gather_data(self) -> None:
           # Gather sales data
           pass
       
       def _analyze_data(self) -> None:
           # Analyze sales data
           pass
   ```

   #### C++
   ```cpp
   class ReportGenerator {
   public:
       virtual ~ReportGenerator() = default;
       
       // Template method - final to prevent override
       void generateReport() {
           gatherData();
           analyzeData();
           writeReport();
       }
       
   protected:
       virtual void gatherData() = 0;
       virtual void analyzeData() = 0;
       
       // Common implementation
       virtual void writeReport() {
           std::cout << "Writing report..." << std::endl;
       }
   };

   class SalesReportGenerator : public ReportGenerator {
   protected:
       void gatherData() override {
           // Gather sales data
       }
       
       void analyzeData() override {
           // Analyze sales data
       }
   };
   ```

## ⚠️ Common Pitfalls

1. **Switch Statements Based on Type**

   #### Java
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

   #### Python
   ```python
   # Bad - violates OCP
   class AnimalSoundBad:
       def make_sound(self, animal_type: str) -> None:
           if animal_type == "dog":
               print("Woof")
           elif animal_type == "cat":
               print("Meow")
           # Adding new animal requires modifying this code

   # Good - follows OCP
   from abc import ABC, abstractmethod

   class Animal(ABC):
       @abstractmethod
       def make_sound(self) -> None:
           pass

   class Dog(Animal):
       def make_sound(self) -> None:
           print("Woof")

   class Cat(Animal):
       def make_sound(self) -> None:
           print("Meow")
   ```

   #### C++
   ```cpp
   // Bad - violates OCP
   class AnimalSoundBad {
   public:
       void makeSound(const std::string& animalType) {
           if (animalType == "dog") {
               std::cout << "Woof" << std::endl;
           } else if (animalType == "cat") {
               std::cout << "Meow" << std::endl;
           }
           // Adding new animal requires modifying this code
       }
   };

   // Good - follows OCP
   class Animal {
   public:
       virtual ~Animal() = default;
       virtual void makeSound() const = 0;
   };

   class Dog : public Animal {
   public:
       void makeSound() const override {
           std::cout << "Woof" << std::endl;
       }
   };

   class Cat : public Animal {
   public:
       void makeSound() const override {
           std::cout << "Meow" << std::endl;
       }
   };
   ```

2. **Type Checking and Casting**

   #### Java
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

   #### Python
   ```python
   # Bad - requires modification for new types
   class ShapeDrawerBad:
       def draw(self, shape) -> None:
           if isinstance(shape, Circle):
               self._draw_circle(shape)
           elif isinstance(shape, Rectangle):
               self._draw_rectangle(shape)

   # Good - polymorphic behavior
   class Shape(ABC):
       @abstractmethod
       def draw(self) -> None:
           pass

   class ShapeDrawer:
       def draw(self, shape: Shape) -> None:
           shape.draw()
   ```

   #### C++
   ```cpp
   // Bad - requires modification for new types
   class ShapeDrawerBad {
   public:
       void draw(void* shape, const std::string& type) {
           if (type == "circle") {
               drawCircle(static_cast<Circle*>(shape));
           } else if (type == "rectangle") {
               drawRectangle(static_cast<Rectangle*>(shape));
           }
       }
   };

   // Good - polymorphic behavior
   class Shape {
   public:
       virtual ~Shape() = default;
       virtual void draw() const = 0;
   };

   class ShapeDrawer {
   public:
       void draw(const Shape& shape) {
           shape.draw();
       }
   };
   ```

3. **Hard-Coded Dependencies**

   #### Java
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

   #### Python
   ```python
   # Bad - hard-coded dependency
   class OrderProcessorBad:
       def __init__(self):
           self._database = MySQLDatabase()

   # Good - dependency injection
   class OrderProcessor:
       def __init__(self, database: Database):
           self._database = database
   ```

   #### C++
   ```cpp
   // Bad - hard-coded dependency
   class OrderProcessorBad {
   private:
       MySQLDatabase database;  // Concrete dependency
   };

   // Good - dependency injection
   class OrderProcessor {
   private:
       std::unique_ptr<Database> database;
   public:
       OrderProcessor(std::unique_ptr<Database> db) 
           : database(std::move(db)) {}
   };
   ```

## 🎯 Interview Questions

1. **How does OCP help with maintainability?**
   - Reduces risk of bugs in existing code
   - Makes codebase more stable
   - Easier to add new features
   - Better separation of concerns

2. **Explain how to refactor this code to follow OCP:**

   #### Java
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

   #### Python
   ```python
   # Before
   class CalculatorBad:
       def calculate(self, operation: str, a: float, b: float) -> float:
           if operation == "add":
               return a + b
           elif operation == "subtract":
               return a - b
           raise ValueError("Unknown operation")

   # After
   class Operation(ABC):
       @abstractmethod
       def execute(self, a: float, b: float) -> float:
           pass

   class Addition(Operation):
       def execute(self, a: float, b: float) -> float:
           return a + b

   class Subtraction(Operation):
       def execute(self, a: float, b: float) -> float:
           return a - b

   class Calculator:
       def calculate(self, operation: Operation, a: float, b: float) -> float:
           return operation.execute(a, b)
   ```

   #### C++
   ```cpp
   // Before
   class CalculatorBad {
   public:
       double calculate(const std::string& operation, double a, double b) {
           if (operation == "add") return a + b;
           if (operation == "subtract") return a - b;
           throw std::invalid_argument("Unknown operation");
       }
   };

   // After
   class Operation {
   public:
       virtual ~Operation() = default;
       virtual double execute(double a, double b) const = 0;
   };

   class Addition : public Operation {
   public:
       double execute(double a, double b) const override {
           return a + b;
       }
   };

   class Subtraction : public Operation {
   public:
       double execute(double a, double b) const override {
           return a - b;
       }
   };

   class Calculator {
   public:
       double calculate(const Operation& operation, double a, double b) {
           return operation.execute(a, b);
       }
   };
   ```

3. **What design patterns help achieve OCP?**
   - Strategy Pattern
   - Template Method Pattern
   - Factory Pattern
   - Decorator Pattern

## 💻 Practice Exercise

Create a notification system following OCP:

### Java
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

### Python
```python
from abc import ABC, abstractmethod
from typing import List

# Notification system following OCP
class NotificationChannel(ABC):
    @abstractmethod
    def send(self, message: str) -> None:
        pass

class EmailNotification(NotificationChannel):
    def __init__(self, email_address: str):
        self._email_address = email_address
    
    def send(self, message: str) -> None:
        print(f"Sending email to {self._email_address}: {message}")

class SMSNotification(NotificationChannel):
    def __init__(self, phone_number: str):
        self._phone_number = phone_number
    
    def send(self, message: str) -> None:
        print(f"Sending SMS to {self._phone_number}: {message}")

class PushNotification(NotificationChannel):
    def __init__(self, device_token: str):
        self._device_token = device_token
    
    def send(self, message: str) -> None:
        print(f"Sending push notification to {self._device_token}: {message}")

class NotificationService:
    def __init__(self):
        self._channels: List[NotificationChannel] = []
    
    def add_channel(self, channel: NotificationChannel) -> None:
        self._channels.append(channel)
    
    def send_notification(self, message: str) -> None:
        for channel in self._channels:
            channel.send(message)

# Usage
if __name__ == "__main__":
    service = NotificationService()
    
    service.add_channel(EmailNotification("user@example.com"))
    service.add_channel(SMSNotification("+1234567890"))
    service.add_channel(PushNotification("device-token-123"))
    
    # Send notification through all channels
    service.send_notification("Hello, World!")
```

### C++
```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <string>

// Notification system following OCP
class NotificationChannel {
public:
    virtual ~NotificationChannel() = default;
    virtual void send(const std::string& message) = 0;
};

class EmailNotification : public NotificationChannel {
private:
    std::string emailAddress;
public:
    EmailNotification(const std::string& email) : emailAddress(email) {}
    
    void send(const std::string& message) override {
        std::cout << "Sending email to " << emailAddress << ": " << message << std::endl;
    }
};

class SMSNotification : public NotificationChannel {
private:
    std::string phoneNumber;
public:
    SMSNotification(const std::string& phone) : phoneNumber(phone) {}
    
    void send(const std::string& message) override {
        std::cout << "Sending SMS to " << phoneNumber << ": " << message << std::endl;
    }
};

class PushNotification : public NotificationChannel {
private:
    std::string deviceToken;
public:
    PushNotification(const std::string& token) : deviceToken(token) {}
    
    void send(const std::string& message) override {
        std::cout << "Sending push notification to " << deviceToken << ": " << message << std::endl;
    }
};

class NotificationService {
private:
    std::vector<std::unique_ptr<NotificationChannel>> channels;
public:
    void addChannel(std::unique_ptr<NotificationChannel> channel) {
        channels.push_back(std::move(channel));
    }
    
    void sendNotification(const std::string& message) {
        for (auto& channel : channels) {
            channel->send(message);
        }
    }
};

// Usage
int main() {
    NotificationService service;
    
    service.addChannel(std::make_unique<EmailNotification>("user@example.com"));
    service.addChannel(std::make_unique<SMSNotification>("+1234567890"));
    service.addChannel(std::make_unique<PushNotification>("device-token-123"));
    
    // Send notification through all channels
    service.sendNotification("Hello, World!");
    
    return 0;
}
```

## ❓ Frequently Asked Questions

### Q1: How can code be "closed for modification" but still change?
**A:** The principle applies to the *behavior* of existing code:
- **Closed:** Existing tested code doesn't need to change
- **Open:** New behavior is added through new classes/modules
- Example: Adding a new `PayPalPayment` class doesn't require modifying `CreditCardPayment`

### Q2: Does OCP mean I should never modify existing code?
**A:** No, it's about designing for extension. You may still modify code for:
- Bug fixes
- Performance improvements
- Refactoring (changing structure, not behavior)
- The goal is to avoid modifying code when *adding new features*

### Q3: What design patterns help achieve OCP?
**A:** Several patterns support OCP:
| Pattern | How It Helps |
|---------|--------------|
| **Strategy** | Swap algorithms without changing context |
| **Template Method** | Override steps without changing skeleton |
| **Decorator** | Add behavior without modifying original |
| **Factory Method** | Create new types without changing client |
| **Observer** | Add subscribers without modifying publisher |

### Q4: How do I identify OCP violations?
**A:** Look for these code smells:
- `switch` statements on type (add case for each new type)
- `if-else` chains checking `instanceof`
- Modifying existing classes to add new features
- Changes in one class causing changes in many others

### Q5: Is OCP always achievable?
**A:** Not 100%. Perfect OCP would require predicting all future changes. Instead:
- Design for *likely* extensions based on domain knowledge
- Refactor towards OCP when patterns emerge
- Accept that some modifications are inevitable
- Focus on high-change areas of your codebase

### Q6: How does OCP relate to abstraction?
**A:** They're deeply connected:
- OCP relies on abstractions (interfaces, abstract classes)
- Client code depends on abstractions, not concrete implementations
- New implementations extend the abstraction without changing clients
- This is why "program to interfaces" is fundamental to OCP

## 📚 Additional Resources

1. [Clean Code by Robert C. Martin - Chapter 9: Unit Tests](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
2. [Design Patterns - Gang of Four](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
3. [SOLID Principles in Java](https://www.baeldung.com/solid-principles) 