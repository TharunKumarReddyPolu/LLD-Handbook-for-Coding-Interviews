# Easy Low Level Design Interview Questions

This section contains entry-level LLD interview questions that focus on basic OOP concepts and simple design patterns.

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

## Additional Resources
- [Clean Code Principles](../../best-practices/clean-code.md)
- [Design Patterns](../../design-patterns/README.md)
- [SOLID Principles](../../solid-principles/README.md) 