# 🔌 Interface Segregation Principle (ISP)

## 📝 Definition
The Interface Segregation Principle states that clients should not be forced to depend on interfaces they don't use. In other words, it's better to have many smaller, specific interfaces rather than a few large, general ones.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying ISP, you should understand:
- [SRP](srp.md), [OCP](ocp.md) & [LSP](lsp.md) - Previous SOLID principles
- [Interfaces](../ood-basics/interfaces.md) - Contract definition and implementation
- [Abstract Classes](../ood-basics/abstract-classes.md) - When to use abstractions

### Learning Path
After mastering ISP, continue with:
1. **Next:** [Dependency Inversion Principle (DIP)](dip.md) - Complete SOLID knowledge
2. **Then:** [Design Patterns Overview](../design-patterns/README.md) - Apply SOLID in patterns
3. **Related:** [Adapter Pattern](../design-patterns/structural/README.md) - Bridge incompatible interfaces

### How ISP Fits in the Big Picture
```
SRP → OCP → LSP → ISP → DIP
                   ↓
ISP keeps interfaces focused and cohesive
Prevents "fat interfaces" and unnecessary dependencies
```

## 🎯 Key Concepts

### 1. Interface Pollution
- Large interfaces lead to tight coupling
- Classes implement methods they don't need

#### Java
```java
// Bad - Fat interface
public interface Worker {
    void work();
    void eat();
    void sleep();
    void calculateSalary();
    void reportHours();
    void takeBreak();
    void requestVacation();
    void attendMeeting();
}

// Good - Segregated interfaces
public interface Workable {
    void work();
    void takeBreak();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public interface Payable {
    void calculateSalary();
    void reportHours();
}

public interface Employee extends Workable, Payable {
    void requestVacation();
    void attendMeeting();
}
```

#### Python
```python
from abc import ABC, abstractmethod

# Bad - Fat interface
class Worker(ABC):
    @abstractmethod
    def work(self): pass
    @abstractmethod
    def eat(self): pass
    @abstractmethod
    def sleep(self): pass
    @abstractmethod
    def calculate_salary(self): pass
    @abstractmethod
    def report_hours(self): pass

# Good - Segregated interfaces
class Workable(ABC):
    @abstractmethod
    def work(self) -> None: pass
    @abstractmethod
    def take_break(self) -> None: pass

class Eatable(ABC):
    @abstractmethod
    def eat(self) -> None: pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self) -> None: pass

class Payable(ABC):
    @abstractmethod
    def calculate_salary(self) -> None: pass
    @abstractmethod
    def report_hours(self) -> None: pass

class Employee(Workable, Payable):
    @abstractmethod
    def request_vacation(self) -> None: pass
    @abstractmethod
    def attend_meeting(self) -> None: pass
```

#### C++
```cpp
// Bad - Fat interface
class Worker {
public:
    virtual ~Worker() = default;
    virtual void work() = 0;
    virtual void eat() = 0;
    virtual void sleep() = 0;
    virtual void calculateSalary() = 0;
    virtual void reportHours() = 0;
};

// Good - Segregated interfaces
class Workable {
public:
    virtual ~Workable() = default;
    virtual void work() = 0;
    virtual void takeBreak() = 0;
};

class Eatable {
public:
    virtual ~Eatable() = default;
    virtual void eat() = 0;
};

class Sleepable {
public:
    virtual ~Sleepable() = default;
    virtual void sleep() = 0;
};

class Payable {
public:
    virtual ~Payable() = default;
    virtual void calculateSalary() = 0;
    virtual void reportHours() = 0;
};

class Employee : public Workable, public Payable {
public:
    virtual void requestVacation() = 0;
    virtual void attendMeeting() = 0;
};
```

### 2. Role Interfaces
- Interfaces should represent roles or capabilities
- Classes can implement multiple role interfaces

#### Java
```java
public interface Printer {
    void print(Document document);
}

public interface Scanner {
    void scan(Document document);
}

public interface Faxer {
    void fax(Document document);
}

// Simple printer only implements what it can do
public class SimplePrinter implements Printer {
    @Override
    public void print(Document document) {
        // Print implementation
    }
}

// Multi-function device implements multiple interfaces
public class MultiFunction implements Printer, Scanner, Faxer {
    @Override
    public void print(Document document) {
        // Print implementation
    }
    
    @Override
    public void scan(Document document) {
        // Scan implementation
    }
    
    @Override
    public void fax(Document document) {
        // Fax implementation
    }
}
```

#### Python
```python
from abc import ABC, abstractmethod

class Printer(ABC):
    @abstractmethod
    def print(self, document: Document) -> None: pass

class Scanner(ABC):
    @abstractmethod
    def scan(self, document: Document) -> None: pass

class Faxer(ABC):
    @abstractmethod
    def fax(self, document: Document) -> None: pass

# Simple printer only implements what it can do
class SimplePrinter(Printer):
    def print(self, document: Document) -> None:
        # Print implementation
        pass

# Multi-function device implements multiple interfaces
class MultiFunction(Printer, Scanner, Faxer):
    def print(self, document: Document) -> None:
        # Print implementation
        pass
    
    def scan(self, document: Document) -> None:
        # Scan implementation
        pass
    
    def fax(self, document: Document) -> None:
        # Fax implementation
        pass
```

#### C++
```cpp
class Document;

class Printer {
public:
    virtual ~Printer() = default;
    virtual void print(const Document& document) = 0;
};

class Scanner {
public:
    virtual ~Scanner() = default;
    virtual void scan(const Document& document) = 0;
};

class Faxer {
public:
    virtual ~Faxer() = default;
    virtual void fax(const Document& document) = 0;
};

// Simple printer only implements what it can do
class SimplePrinter : public Printer {
public:
    void print(const Document& document) override {
        // Print implementation
    }
};

// Multi-function device implements multiple interfaces
class MultiFunction : public Printer, public Scanner, public Faxer {
public:
    void print(const Document& document) override {
        // Print implementation
    }
    
    void scan(const Document& document) override {
        // Scan implementation
    }
    
    void fax(const Document& document) override {
        // Fax implementation
    }
};
```

## 💡 Best Practices

1. **Keep Interfaces Focused**
   ```java
   // Bad - Mixed responsibilities
   public interface ShoppingCart {
       void addItem(Item item);
       void removeItem(Item item);
       void processPayment();
       void generateInvoice();
       void sendConfirmationEmail();
   }
   
   // Good - Separated interfaces
   public interface Cart {
       void addItem(Item item);
       void removeItem(Item item);
   }
   
   public interface PaymentProcessor {
       void processPayment();
   }
   
   public interface InvoiceGenerator {
       void generateInvoice();
   }
   
   public interface EmailService {
       void sendConfirmationEmail();
   }
   ```

2. **Use Composition**
   ```java
   public class OnlineOrder {
       private Cart cart;
       private PaymentProcessor paymentProcessor;
       private InvoiceGenerator invoiceGenerator;
       private EmailService emailService;
       
       public void checkout() {
           paymentProcessor.processPayment();
           invoiceGenerator.generateInvoice();
           emailService.sendConfirmationEmail();
       }
   }
   ```

3. **Interface Inheritance**
   ```java
   public interface Repository<T> {
       T findById(Long id);
       void save(T entity);
   }
   
   public interface UserRepository extends Repository<User> {
       User findByEmail(String email);
   }
   
   public interface OrderRepository extends Repository<Order> {
       List<Order> findByUser(User user);
   }
   ```

## ⚠️ Common Pitfalls

1. **God Interfaces**
   ```java
   // Bad - God interface
   public interface SuperService {
       void processOrder();
       void generateReport();
       void sendEmail();
       void calculateTax();
       void updateInventory();
       void handleShipping();
       void processRefund();
   }
   ```

2. **Forcing Implementation**
   ```java
   // Bad - Forces implementation of unused methods
   public interface Animal {
       void fly();
       void swim();
       void run();
   }
   
   public class Fish implements Animal {
       public void swim() { }
       public void fly() { /* Can't fly */ }
       public void run() { /* Can't run */ }
   }
   ```

3. **Interface Bloat**
   ```java
   // Bad - Interface bloat
   public interface UserService {
       User findUser(Long id);
       void saveUser(User user);
       void sendEmail(String to, String subject);
       void generateReport();
       void processPayment(Payment payment);
   }
   ```

## 🎯 Interview Questions

1. **How do you identify violations of ISP?**
   - Classes implementing methods they don't use
   - Large interfaces with unrelated methods
   - Methods throwing UnsupportedOperationException
   - High coupling between classes

2. **Refactor this code to follow ISP:**
   ```java
   // Before
   public interface Machine {
       void print(Document d);
       void scan(Document d);
       void fax(Document d);
       void photocopy(Document d);
   }
   
   // After
   public interface Printer {
       void print(Document d);
   }
   
   public interface Scanner {
       void scan(Document d);
   }
   
   public interface Fax {
       void fax(Document d);
   }
   
   public interface Photocopier extends Printer, Scanner {
       void photocopy(Document d);
   }
   
   // Implementations
   public class SimplePrinter implements Printer {
       public void print(Document d) { }
   }
   
   public class AllInOnePrinter implements Printer, Scanner, Fax {
       public void print(Document d) { }
       public void scan(Document d) { }
       public void fax(Document d) { }
   }
   ```

3. **What are the benefits of following ISP?**
   - Reduced coupling
   - Better maintainability
   - More flexible code
   - Easier testing
   - Clear dependencies

## 💻 Practice Exercise

Create a media player system following ISP:

```java
// Media player interfaces
public interface Playable {
    void play();
    void pause();
    void stop();
}

public interface VolumeControl {
    void setVolume(int volume);
    int getVolume();
}

public interface Seekable {
    void seek(int position);
    int getCurrentPosition();
}

public interface PlaylistControl {
    void next();
    void previous();
    void shuffle();
}

// Basic audio player
public class AudioPlayer implements Playable, VolumeControl {
    private boolean isPlaying;
    private int volume;
    
    @Override
    public void play() {
        isPlaying = true;
        System.out.println("Playing audio");
    }
    
    @Override
    public void pause() {
        isPlaying = false;
        System.out.println("Audio paused");
    }
    
    @Override
    public void stop() {
        isPlaying = false;
        System.out.println("Audio stopped");
    }
    
    @Override
    public void setVolume(int volume) {
        this.volume = Math.min(100, Math.max(0, volume));
        System.out.println("Volume set to: " + this.volume);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
}

// Advanced media player
public class AdvancedMediaPlayer implements Playable, VolumeControl, Seekable, PlaylistControl {
    private boolean isPlaying;
    private int volume;
    private int position;
    
    @Override
    public void play() {
        isPlaying = true;
        System.out.println("Playing media");
    }
    
    @Override
    public void pause() {
        isPlaying = false;
        System.out.println("Media paused");
    }
    
    @Override
    public void stop() {
        isPlaying = false;
        position = 0;
        System.out.println("Media stopped");
    }
    
    @Override
    public void setVolume(int volume) {
        this.volume = Math.min(100, Math.max(0, volume));
        System.out.println("Volume set to: " + this.volume);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public void seek(int position) {
        this.position = position;
        System.out.println("Seeked to position: " + position);
    }
    
    @Override
    public int getCurrentPosition() {
        return position;
    }
    
    @Override
    public void next() {
        System.out.println("Playing next track");
    }
    
    @Override
    public void previous() {
        System.out.println("Playing previous track");
    }
    
    @Override
    public void shuffle() {
        System.out.println("Shuffling playlist");
    }
}

// Usage example
public class Main {
    public static void main(String[] args) {
        // Basic audio player
        AudioPlayer audioPlayer = new AudioPlayer();
        audioPlayer.play();
        audioPlayer.setVolume(75);
        audioPlayer.pause();
        
        // Advanced media player
        AdvancedMediaPlayer advancedPlayer = new AdvancedMediaPlayer();
        advancedPlayer.play();
        advancedPlayer.setVolume(80);
        advancedPlayer.seek(120);
        advancedPlayer.next();
        advancedPlayer.shuffle();
        advancedPlayer.stop();
    }
}
```

## ❓ Frequently Asked Questions

### Q1: How small should interfaces be?
**A:** There's no fixed number, but follow these guidelines:
- Group methods that are always used together
- If clients only use some methods, the interface is too big
- Single-method interfaces are fine (especially for functional programming)
- 3-5 cohesive methods is often a good size
- Ask: "Would any client need only part of this interface?"

### Q2: What's the difference between ISP and SRP?
**A:**
| Aspect | SRP | ISP |
|--------|-----|-----|
| Focus | Class responsibilities | Interface design |
| Goal | One reason to change | Clients use what they need |
| Level | Implementation | Contract/API |
| Violation | Class does too much | Interface requires too much |

They're complementary: SRP for implementations, ISP for interfaces.

### Q3: How do I refactor a "fat interface"?
**A:** Follow these steps:
1. Identify groups of methods used together by clients
2. Create smaller, focused interfaces for each group
3. Have the original interface extend the smaller ones (if needed)
4. Update clients to depend only on interfaces they use
5. Update implementations to implement only needed interfaces

### Q4: Can a class implement multiple interfaces?
**A:** Yes! That's the power of ISP:
- One class can implement many small interfaces
- Different clients see only the interface they need
- This is how you get the benefits of multiple inheritance safely
- Example: `SmartPhone` implements `Callable`, `Camera`, `Browser`, `GPS`

### Q5: What's a "role interface"?
**A:** A role interface defines a specific role an object can play:
- Named for the role, not the implementation: `Printable`, `Serializable`, `Comparable`
- Focuses on what the object can *do* in a specific context
- Clients depend on roles, not concrete types
- A class can play multiple roles by implementing multiple interfaces

### Q6: Does ISP apply to abstract classes?
**A:** Yes, but differently:
- Abstract classes can have state and implementations
- You can't multiply inherit abstract classes (in most languages)
- Prefer small interfaces + abstract base classes when needed
- Example: Interface for contract, abstract class for shared implementation

### Q7: How does ISP help with testing?
**A:** Smaller interfaces make testing easier:
- Mock only the methods you need
- Test doubles are simpler to create
- Tests are more focused and less brittle
- Changes to unused methods don't break your tests

## 📚 Additional Resources

1. [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
2. [Design Patterns and Interface Segregation](https://www.pluralsight.com/courses/design-patterns-interface-segregation)
3. [SOLID Principles in Java](https://www.baeldung.com/solid-principles) 