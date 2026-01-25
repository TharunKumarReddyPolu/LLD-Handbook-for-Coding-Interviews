# ↔️ Dependency Inversion Principle (DIP)

## 📝 Definition
The Dependency Inversion Principle states that:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying DIP, you should understand:
- [All Previous SOLID Principles](srp.md) - SRP, OCP, LSP, ISP
- [Interfaces](../ood-basics/interfaces.md) - Defining abstractions
- [Abstraction](../ood-basics/abstraction.md) - Hiding implementation details
- [Relationships](../ood-basics/relationships.md) - Association, Aggregation, Composition

### Learning Path
After mastering DIP, continue with:
1. **Next:** [Design Patterns Overview](../design-patterns/README.md) - Apply SOLID in real patterns
2. **Then:** [Creational Patterns](../design-patterns/creational/README.md) - Factory, Builder for DI
3. **Related:** [Testing Strategies](../best-practices/testing.md) - DIP enables testability

### How DIP Fits in the Big Picture
```
SRP → OCP → LSP → ISP → DIP → Design Patterns
                         ↓
DIP is the culmination of SOLID principles
Enables: Testability, Flexibility, Loose Coupling
```

## 🎯 Key Concepts

### 1. Dependency on Abstractions
- Use interfaces and abstract classes instead of concrete implementations
- Decouple high-level and low-level modules

#### Java
```java
// Bad - Direct dependency on concrete class
public class OrderService {
    private MySQLDatabase database;  // Concrete dependency
    
    public OrderService() {
        database = new MySQLDatabase();
    }
}

// Good - Depends on abstraction
public interface Database {
    void save(Object data);
    Object find(String id);
}

public class OrderService {
    private Database database;  // Interface dependency
    
    public OrderService(Database database) {
        this.database = database;
    }
}
```

#### Python
```python
from abc import ABC, abstractmethod

# Bad - Direct dependency on concrete class
class OrderServiceBad:
    def __init__(self):
        self._database = MySQLDatabase()  # Concrete dependency

# Good - Depends on abstraction
class Database(ABC):
    @abstractmethod
    def save(self, data: object) -> None: pass
    
    @abstractmethod
    def find(self, id: str) -> object: pass

class OrderService:
    def __init__(self, database: Database):  # Interface dependency
        self._database = database
```

#### C++
```cpp
// Bad - Direct dependency on concrete class
class OrderServiceBad {
private:
    MySQLDatabase database;  // Concrete dependency
};

// Good - Depends on abstraction
class Database {
public:
    virtual ~Database() = default;
    virtual void save(const void* data) = 0;
    virtual void* find(const std::string& id) = 0;
};

class OrderService {
private:
    std::unique_ptr<Database> database;  // Interface dependency
public:
    OrderService(std::unique_ptr<Database> db) 
        : database(std::move(db)) {}
};
```

### 2. Inversion of Control (IoC)
- Control is inverted from high-level modules to a container/framework
- Dependencies are injected rather than created internally

#### Java
```java
// Dependency Injection Container
public class Container {
    private Map<Class<?>, Object> dependencies = new HashMap<>();
    
    public void register(Class<?> type, Object implementation) {
        dependencies.put(type, implementation);
    }
    
    public <T> T resolve(Class<T> type) {
        return (T) dependencies.get(type);
    }
}

// Usage
Container container = new Container();
container.register(Database.class, new MySQLDatabase());
container.register(EmailService.class, new SMTPEmailService());

OrderService orderService = new OrderService(
    container.resolve(Database.class),
    container.resolve(EmailService.class)
);
```

#### Python
```python
from typing import Dict, Type, TypeVar, Any

T = TypeVar('T')

# Dependency Injection Container
class Container:
    def __init__(self):
        self._dependencies: Dict[Type, Any] = {}
    
    def register(self, type_class: Type, implementation: Any) -> None:
        self._dependencies[type_class] = implementation
    
    def resolve(self, type_class: Type[T]) -> T:
        return self._dependencies.get(type_class)

# Usage
container = Container()
container.register(Database, MySQLDatabase())
container.register(EmailService, SMTPEmailService())

order_service = OrderService(
    container.resolve(Database),
    container.resolve(EmailService)
)
```

#### C++
```cpp
#include <unordered_map>
#include <typeindex>
#include <any>

// Dependency Injection Container
class Container {
private:
    std::unordered_map<std::type_index, std::any> dependencies;
public:
    template<typename T>
    void registerType(T* implementation) {
        dependencies[std::type_index(typeid(T))] = implementation;
    }
    
    template<typename T>
    T* resolve() {
        auto it = dependencies.find(std::type_index(typeid(T)));
        if (it != dependencies.end()) {
            return std::any_cast<T*>(it->second);
        }
        return nullptr;
    }
};

// Usage
Container container;
container.registerType<Database>(new MySQLDatabase());
container.registerType<EmailService>(new SMTPEmailService());

auto orderService = std::make_unique<OrderService>(
    container.resolve<Database>(),
    container.resolve<EmailService>()
);
```

## 💡 Best Practices

1. **Constructor Injection**
   ```java
   public class UserService {
       private final UserRepository repository;
       private final EmailService emailService;
       
       // Dependencies injected through constructor
       public UserService(UserRepository repository, EmailService emailService) {
           this.repository = repository;
           this.emailService = emailService;
       }
       
       public void registerUser(User user) {
           repository.save(user);
           emailService.sendWelcomeEmail(user);
       }
   }
   ```

2. **Factory Pattern**
   ```java
   public interface ConnectionFactory {
       Connection createConnection();
   }
   
   public class MySQLConnectionFactory implements ConnectionFactory {
       @Override
       public Connection createConnection() {
           return new MySQLConnection();
       }
   }
   
   public class DatabaseService {
       private final ConnectionFactory connectionFactory;
       
       public DatabaseService(ConnectionFactory connectionFactory) {
           this.connectionFactory = connectionFactory;
       }
       
       public void executeQuery(String query) {
           Connection connection = connectionFactory.createConnection();
           // Use connection
       }
   }
   ```

3. **Abstract Factory Pattern**
   ```java
   public interface PaymentGatewayFactory {
       PaymentProcessor createProcessor();
       PaymentValidator createValidator();
   }
   
   public class StripeGatewayFactory implements PaymentGatewayFactory {
       @Override
       public PaymentProcessor createProcessor() {
           return new StripeProcessor();
       }
       
       @Override
       public PaymentValidator createValidator() {
           return new StripeValidator();
       }
   }
   
   public class PaymentService {
       private final PaymentGatewayFactory gatewayFactory;
       
       public PaymentService(PaymentGatewayFactory gatewayFactory) {
           this.gatewayFactory = gatewayFactory;
       }
   }
   ```

## ⚠️ Common Pitfalls

1. **Concrete Class Dependencies**
   ```java
   // Bad - Direct instantiation
   public class ReportGenerator {
       private PDFWriter writer = new PDFWriter();  // Concrete dependency
   }
   
   // Good - Interface dependency
   public class ReportGenerator {
       private DocumentWriter writer;  // Interface
       
       public ReportGenerator(DocumentWriter writer) {
           this.writer = writer;
       }
   }
   ```

2. **Hidden Dependencies**
   ```java
   // Bad - Hidden dependency
   public class UserController {
       public void createUser(User user) {
           UserService service = new UserService();  // Hidden dependency
           service.createUser(user);
       }
   }
   
   // Good - Explicit dependency
   public class UserController {
       private final UserService service;
       
       public UserController(UserService service) {
           this.service = service;
       }
   }
   ```

3. **Static Dependencies**
   ```java
   // Bad - Static dependency
   public class Logger {
       public static void log(String message) {
           // Static implementation
       }
   }
   
   // Good - Injectable dependency
   public interface Logger {
       void log(String message);
   }
   
   public class FileLogger implements Logger {
       @Override
       public void log(String message) {
           // Implementation
       }
   }
   ```

## 🎯 Interview Questions

1. **What's the difference between DIP and IoC?**
   - DIP is a principle about depending on abstractions
   - IoC is a pattern that implements DIP
   - IoC containers manage dependency injection
   - DIP can be implemented without IoC

2. **How would you refactor this code to follow DIP?**
   ```java
   // Before
   public class OrderProcessor {
       private MySQLDatabase database = new MySQLDatabase();
       private StripePayment payment = new StripePayment();
       
       public void process(Order order) {
           payment.charge(order.getAmount());
           database.save(order);
       }
   }
   
   // After
   public interface Database {
       void save(Order order);
   }
   
   public interface PaymentProcessor {
       void charge(double amount);
   }
   
   public class OrderProcessor {
       private final Database database;
       private final PaymentProcessor payment;
       
       public OrderProcessor(Database database, PaymentProcessor payment) {
           this.database = database;
           this.payment = payment;
       }
       
       public void process(Order order) {
           payment.charge(order.getAmount());
           database.save(order);
       }
   }
   ```

3. **What are the benefits of following DIP?**
   - Loose coupling
   - Easy testing with mocks
   - Flexible configuration
   - Better maintainability
   - Easier to change implementations

## 💻 Practice Exercise

Create a notification system following DIP:

```java
// Abstractions
public interface MessageSender {
    void send(String message, String recipient);
}

public interface MessageFormatter {
    String format(String message);
}

public interface Logger {
    void log(String message);
}

// Implementations
public class EmailSender implements MessageSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("Sending email to " + recipient + ": " + message);
    }
}

public class SMSSender implements MessageSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("Sending SMS to " + recipient + ": " + message);
    }
}

public class HTMLFormatter implements MessageFormatter {
    @Override
    public String format(String message) {
        return "<html><body>" + message + "</body></html>";
    }
}

public class PlainTextFormatter implements MessageFormatter {
    @Override
    public String format(String message) {
        return message;
    }
}

public class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("LOG: " + message);
    }
}

// High-level module
public class NotificationService {
    private final MessageSender sender;
    private final MessageFormatter formatter;
    private final Logger logger;
    
    public NotificationService(
            MessageSender sender,
            MessageFormatter formatter,
            Logger logger) {
        this.sender = sender;
        this.formatter = formatter;
        this.logger = logger;
    }
    
    public void notify(String message, String recipient) {
        String formattedMessage = formatter.format(message);
        sender.send(formattedMessage, recipient);
        logger.log("Notification sent to " + recipient);
    }
}

// Usage with dependency injection
public class Main {
    public static void main(String[] args) {
        // Create dependencies
        MessageSender emailSender = new EmailSender();
        MessageFormatter htmlFormatter = new HTMLFormatter();
        Logger logger = new ConsoleLogger();
        
        // Inject dependencies
        NotificationService emailService = new NotificationService(
            emailSender, htmlFormatter, logger);
        
        // Use the service
        emailService.notify(
            "Hello, this is a test message",
            "user@example.com"
        );
        
        // Easy to switch implementations
        MessageSender smsSender = new SMSSender();
        MessageFormatter plainTextFormatter = new PlainTextFormatter();
        
        NotificationService smsService = new NotificationService(
            smsSender, plainTextFormatter, logger);
        
        smsService.notify(
            "Hello, this is a test message",
            "+1234567890"
        );
    }
}
```

## ❓ Frequently Asked Questions

### Q1: What's the difference between DIP and Dependency Injection?
**A:**
| Concept | What It Is |
|---------|-----------|
| **DIP (Principle)** | High-level modules shouldn't depend on low-level modules; both depend on abstractions |
| **DI (Pattern)** | A technique to achieve DIP by injecting dependencies from outside |
| **IoC Container** | A framework that manages DI automatically |

DIP is the *why*, DI is the *how*.

### Q2: What are the types of Dependency Injection?
**A:** Three main types:
```
1. Constructor Injection (Preferred)
   - Dependencies passed via constructor
   - Makes dependencies explicit and required
   
2. Setter Injection
   - Dependencies set via setter methods
   - Good for optional dependencies
   
3. Interface Injection
   - Class implements an interface that injects dependencies
   - Less common, more complex
```

### Q3: Why is Constructor Injection preferred?
**A:**
- Makes dependencies explicit and visible
- Ensures object is fully initialized
- Supports immutability (final fields)
- Makes testing easier (just pass mocks)
- Fails fast if dependencies are missing

### Q4: What's Inversion of Control (IoC)?
**A:** IoC is a broader principle where control is inverted:
- **Traditional:** Your code calls library code
- **IoC:** Framework calls your code
- DIP is a specific type of IoC for dependencies
- Examples: Spring Framework, event handlers, plugin architectures

### Q5: How does DIP help with testing?
**A:** DIP makes code testable by:
- Allowing mock/stub injection for dependencies
- Isolating units for true unit testing
- Removing hard-coded dependencies on databases, APIs, etc.
- Enabling fast tests without external systems

```java
// Easy to test with mock
UserService service = new UserService(mockRepository, mockEmailSender);
```

### Q6: Can DIP be overused?
**A:** Yes, avoid these anti-patterns:
- Creating abstractions for everything (even simple utilities)
- One-to-one interface-to-implementation mapping without purpose
- Deep abstraction layers that add complexity without flexibility
- Abstracting stable, rarely-changing components

### Q7: What should I abstract and what shouldn't I?
**A:**
| Abstract (Create Interface) | Don't Abstract |
|---------------------------|----------------|
| External services (DB, API, Email) | Simple utilities (string, math) |
| Components likely to change | Stable framework classes |
| Components needing multiple implementations | Internal implementation details |
| Components needing mocking | Value objects |

## 📚 Additional Resources

1. [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
2. [Dependency Injection in .NET by Mark Seemann](https://www.manning.com/books/dependency-injection-in-dot-net)
3. [Martin Fowler on Dependency Injection](https://martinfowler.com/articles/injection.html) 