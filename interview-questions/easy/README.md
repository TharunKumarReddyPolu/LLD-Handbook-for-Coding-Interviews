# Easy Low Level Design Interview Questions

This section contains entry-level LLD interview questions that focus on basic OOP concepts and simple design patterns.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before attempting Easy questions, ensure you understand:
- [OOD Basics](../../ood-basics/README.md) - All four pillars of OOP
- [Classes & Objects](../../ood-basics/classes-and-objects.md) - Fundamental building blocks
- [Encapsulation](../../ood-basics/encapsulation.md) - Data hiding
- [Inheritance](../../ood-basics/inheritance.md) - Code reuse
- [SOLID Principles](../../solid-principles/README.md) - At least SRP and OCP

### Recommended Patterns to Know
| Pattern | Used In |
|---------|---------|
| Singleton | Logger, Configuration |
| Factory | Object creation |
| Strategy | Algorithm selection |

### Interview Approach
```
1. Clarify Requirements (2-3 min)
         ↓
2. Identify Classes & Relationships (5 min)
         ↓
3. Define Interfaces & Methods (5 min)
         ↓
4. Write Core Implementation (15-20 min)
         ↓
5. Discuss Trade-offs & Extensions (5 min)
```

### Learning Path
| Level | Focus | Time Estimate |
|-------|-------|---------------|
| 📍 Easy (You're here) | OOP basics, simple patterns | 1-2 weeks |
| [Medium](../medium/README.md) | Complex patterns, concurrency | 2-3 weeks |
| [Hard](../hard/README.md) | Distributed systems, architecture | 3-4 weeks |

### Tips for Easy Questions
- Focus on clean class design
- Apply SRP consistently  
- Use meaningful names
- Handle edge cases
- Don't over-engineer

## Questions List

1. [Design a Simple Logger](#design-a-simple-logger)
2. [Design a Calculator](#design-a-calculator)
3. [Design a File System](#design-a-file-system)
4. [Design a Parking Lot](#design-a-parking-lot)
5. [Design a Vending Machine](#design-a-vending-machine)

## Design a Simple Logger

### Requirements
- Create a logging system that can log messages with different severity levels
- Support multiple output destinations (console, file)
- Implement basic formatting options
- Thread-safe logging

### Example Solution

#### Java
```java
public enum LogLevel {
    INFO, WARNING, ERROR, DEBUG
}

public interface LogDestination {
    void write(String message, LogLevel level);
}

public class ConsoleLogger implements LogDestination {
    @Override
    public void write(String message, LogLevel level) {
        System.out.println("[" + level + "] " + message);
    }
}

public class Logger {
    private static Logger instance;
    private List<LogDestination> destinations;
    
    private Logger() {
        destinations = new ArrayList<>();
    }
    
    public static synchronized Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }
    
    public void addDestination(LogDestination destination) {
        destinations.add(destination);
    }
    
    public synchronized void log(String message, LogLevel level) {
        for (LogDestination destination : destinations) {
            destination.write(message, level);
        }
    }
}
```

#### Python
```python
from enum import Enum
from abc import ABC, abstractmethod
from typing import List
import threading

class LogLevel(Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    DEBUG = "DEBUG"

class LogDestination(ABC):
    @abstractmethod
    def write(self, message: str, level: LogLevel) -> None:
        pass

class ConsoleLogger(LogDestination):
    def write(self, message: str, level: LogLevel) -> None:
        print(f"[{level.value}] {message}")

class Logger:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._destinations = []
        return cls._instance
    
    def add_destination(self, destination: LogDestination) -> None:
        self._destinations.append(destination)
    
    def log(self, message: str, level: LogLevel) -> None:
        with self._lock:
            for destination in self._destinations:
                destination.write(message, level)
```

#### C++
```cpp
#include <vector>
#include <mutex>
#include <iostream>

enum class LogLevel { INFO, WARNING, ERROR, DEBUG };

class LogDestination {
public:
    virtual ~LogDestination() = default;
    virtual void write(const std::string& message, LogLevel level) = 0;
};

class ConsoleLogger : public LogDestination {
public:
    void write(const std::string& message, LogLevel level) override {
        std::cout << "[" << static_cast<int>(level) << "] " << message << std::endl;
    }
};

class Logger {
private:
    static Logger* instance;
    static std::mutex mutex;
    std::vector<std::unique_ptr<LogDestination>> destinations;
    
    Logger() = default;
public:
    static Logger* getInstance() {
        std::lock_guard<std::mutex> lock(mutex);
        if (instance == nullptr) {
            instance = new Logger();
        }
        return instance;
    }
    
    void addDestination(std::unique_ptr<LogDestination> dest) {
        destinations.push_back(std::move(dest));
    }
    
    void log(const std::string& message, LogLevel level) {
        std::lock_guard<std::mutex> lock(mutex);
        for (auto& dest : destinations) {
            dest->write(message, level);
        }
    }
};
```

### Key Points
- Singleton pattern for logger instance
- Strategy pattern for different output destinations
- Thread safety considerations
- Extensibility for new destinations

## Design a Calculator

### Requirements
- Support basic arithmetic operations (+, -, *, /)
- Handle decimal numbers
- Support operation history
- Implement undo functionality

### Example Solution
```java
public interface Operation {
    double execute(double a, double b);
}

public class Calculator {
    private Stack<Double> history;
    private Map<String, Operation> operations;
    
    public Calculator() {
        history = new Stack<>();
        operations = new HashMap<>();
        
        operations.put("+", (a, b) -> a + b);
        operations.put("-", (a, b) -> a - b);
        operations.put("*", (a, b) -> a * b);
        operations.put("/", (a, b) -> a / b);
    }
    
    public double calculate(String operator, double a, double b) {
        Operation operation = operations.get(operator);
        if (operation == null) {
            throw new IllegalArgumentException("Invalid operator");
        }
        
        double result = operation.execute(a, b);
        history.push(result);
        return result;
    }
    
    public Double undo() {
        if (!history.isEmpty()) {
            return history.pop();
        }
        return null;
    }
}
```

### Key Points
- Command pattern for operations
- Strategy pattern for different operations
- Stack for history management
- Error handling

## Design a File System

### Requirements
- Support files and directories
- Implement basic operations (create, delete, move)
- Track file metadata
- Support file permissions

### Example Solution
```java
public abstract class FileSystemNode {
    protected String name;
    protected String path;
    protected LocalDateTime created;
    protected LocalDateTime modified;
    
    public abstract long getSize();
}

public class File extends FileSystemNode {
    private byte[] content;
    
    @Override
    public long getSize() {
        return content.length;
    }
}

public class Directory extends FileSystemNode {
    private List<FileSystemNode> children;
    
    @Override
    public long getSize() {
        return children.stream()
                      .mapToLong(FileSystemNode::getSize)
                      .sum();
    }
    
    public void addNode(FileSystemNode node) {
        children.add(node);
    }
}
```

### Key Points
- Composite pattern for directory structure
- Template pattern for common attributes
- Strategy pattern for file operations
- Error handling and validation

## Design a Parking Lot

### Requirements
- Multiple types of parking spots
- Vehicle tracking
- Payment calculation
- Spot allocation strategy

### Example Solution
```java
public enum VehicleType {
    CAR, MOTORCYCLE, BUS
}

public class ParkingSpot {
    private String id;
    private VehicleType type;
    private boolean isOccupied;
    
    public boolean canPark(Vehicle vehicle) {
        return !isOccupied && type == vehicle.getType();
    }
}

public class ParkingLot {
    private List<ParkingSpot> spots;
    private Map<String, Ticket> activeTickets;
    
    public Ticket parkVehicle(Vehicle vehicle) {
        ParkingSpot spot = findAvailableSpot(vehicle);
        if (spot == null) {
            throw new NoSpotAvailableException();
        }
        
        Ticket ticket = new Ticket(vehicle, spot);
        activeTickets.put(ticket.getId(), ticket);
        return ticket;
    }
}
```

### Key Points
- Strategy pattern for spot allocation
- Observer pattern for spot monitoring
- Factory pattern for ticket creation
- State pattern for spot status

## Design a Vending Machine

### Requirements
- Inventory management
- Payment processing
- Product selection
- Change calculation

### Example Solution
```java
public class VendingMachine {
    private Map<String, Product> inventory;
    private double currentAmount;
    private State currentState;
    
    public void insertCoin(double amount) {
        currentAmount += amount;
        updateState();
    }
    
    public Product selectProduct(String code) {
        Product product = inventory.get(code);
        if (product == null || product.getQuantity() == 0) {
            throw new ProductUnavailableException();
        }
        if (currentAmount < product.getPrice()) {
            throw new InsufficientFundsException();
        }
        
        product.decrementQuantity();
        currentAmount -= product.getPrice();
        return product;
    }
}

public class Product {
    private String code;
    private String name;
    private double price;
    private int quantity;
    
    public void decrementQuantity() {
        if (quantity > 0) {
            quantity--;
        }
    }
}
```

### Key Points
- State pattern for machine states
- Strategy pattern for payment methods
- Observer pattern for inventory tracking
- Factory pattern for product creation

## ❓ Frequently Asked Questions

### Q1: How do I start an LLD interview problem?
**A:** Follow this structure:
1. **Clarify requirements** (2-3 min) - Ask about scale, features, constraints
2. **Identify core entities** (2-3 min) - Nouns become classes
3. **Define relationships** (2-3 min) - How entities interact
4. **Design class structure** (5 min) - Interfaces, inheritance
5. **Implement core logic** (15-20 min) - Write actual code
6. **Discuss extensions** (5 min) - Trade-offs, improvements

### Q2: Should I use design patterns in every problem?
**A:** Use patterns when they fit naturally:
- ✅ Singleton for Logger (single instance)
- ✅ Strategy for payment methods (swappable algorithms)
- ✅ Factory for object creation (hide complexity)
- ❌ Don't force patterns where simple code works
- ❌ Don't use patterns you can't explain

### Q3: How much code should I write in an interview?
**A:** Focus on:
- Core classes and interfaces
- Main algorithms/logic
- Key methods (not getters/setters)
- Enough to show design works
- Skip boilerplate, mention you'd add it

### Q4: What if I don't know where to start?
**A:** Use this technique:
1. List the main use cases
2. For each use case, identify: actors, actions, objects
3. Objects → Classes
4. Actions → Methods
5. Relationships → Inheritance/Composition

### Q5: How do I handle requirements I'm unsure about?
**A:**
- Ask clarifying questions
- State your assumptions explicitly
- "I'll assume X, let me know if that's incorrect"
- Design for flexibility where uncertain
- Mention alternatives you considered

### Q6: What level of error handling should I include?
**A:** For easy problems:
- Validate inputs at entry points
- Throw meaningful exceptions
- Don't get lost in edge cases
- Mention you'd add more in production
- Focus on happy path first

## Additional Resources
- [Clean Code Principles](../../best-practices/clean-code.md)
- [Design Patterns](../../design-patterns/README.md)
- [SOLID Principles](../../solid-principles/srp.md) 