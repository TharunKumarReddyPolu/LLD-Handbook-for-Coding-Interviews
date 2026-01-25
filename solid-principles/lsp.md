# 🔄 Liskov Substitution Principle (LSP)

## 📝 Definition
The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. In other words, derived classes must be substitutable for their base classes.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying LSP, you should understand:
- [SRP](srp.md) & [OCP](ocp.md) - Foundation of SOLID
- [Inheritance](../ood-basics/inheritance.md) - Class hierarchies and extending behavior
- [Polymorphism](../ood-basics/polymorphism.md) - Method overriding and dynamic dispatch
- [Abstract Classes](../ood-basics/abstract-classes.md) - Partial implementations

### Learning Path
After mastering LSP, continue with:
1. **Next:** [Interface Segregation Principle (ISP)](isp.md) - Focused interfaces
2. **Then:** [Dependency Inversion Principle (DIP)](dip.md) - Depend on abstractions
3. **Related:** [Factory Pattern](../design-patterns/creational/README.md) - Creating substitutable objects

### How LSP Fits in the Big Picture
```
SRP → OCP → LSP → ISP → DIP
             ↓
LSP ensures inheritance hierarchies are correct
Violations lead to unexpected runtime behavior
```

## 🎯 Key Concepts

### 1. Behavioral Subtyping
- Subclass methods should expect no more and provide no less than the base class
- Maintain the contract defined by the base class

#### Java
```java
// Base class defining a contract
public class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) {
        this.width = width;
    }
    
    public void setHeight(int height) {
        this.height = height;
    }
    
    public int getArea() {
        return width * height;
    }
}

// LSP violation
public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        super.setWidth(width);
        super.setHeight(width);  // Violates LSP
    }
    
    @Override
    public void setHeight(int height) {
        super.setHeight(height);
        super.setWidth(height);  // Violates LSP
    }
}
```

#### Python
```python
# Base class defining a contract
class Rectangle:
    def __init__(self):
        self._width = 0
        self._height = 0
    
    def set_width(self, width: int) -> None:
        self._width = width
    
    def set_height(self, height: int) -> None:
        self._height = height
    
    def get_area(self) -> int:
        return self._width * self._height

# LSP violation
class Square(Rectangle):
    def set_width(self, width: int) -> None:
        self._width = width
        self._height = width  # Violates LSP
    
    def set_height(self, height: int) -> None:
        self._height = height
        self._width = height  # Violates LSP
```

#### C++
```cpp
// Base class defining a contract
class Rectangle {
protected:
    int width;
    int height;
public:
    virtual void setWidth(int w) { width = w; }
    virtual void setHeight(int h) { height = h; }
    int getArea() const { return width * height; }
};

// LSP violation
class Square : public Rectangle {
public:
    void setWidth(int w) override {
        width = w;
        height = w;  // Violates LSP
    }
    
    void setHeight(int h) override {
        height = h;
        width = h;  // Violates LSP
    }
};
```

### 2. Contract Conditions
1. **Preconditions** cannot be strengthened in a subtype
2. **Postconditions** cannot be weakened in a subtype
3. **Invariants** must be preserved in a subtype

#### Java
```java
public class Bird {
    public void fly() {
        // Base implementation
    }
}

// LSP violation - strengthens precondition
public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly");
    }
}

// Better design
public interface FlyingBird {
    void fly();
}

public class Bird { }

public class Sparrow extends Bird implements FlyingBird {
    @Override
    public void fly() {
        // Implementation
    }
}

public class Penguin extends Bird {
    // No fly method
}
```

#### Python
```python
from abc import ABC, abstractmethod

class Bird:
    def fly(self) -> None:
        # Base implementation
        pass

# LSP violation - strengthens precondition
class PenguinBad(Bird):
    def fly(self) -> None:
        raise NotImplementedError("Penguins can't fly")

# Better design
class FlyingBird(ABC):
    @abstractmethod
    def fly(self) -> None:
        pass

class Bird:
    pass

class Sparrow(Bird, FlyingBird):
    def fly(self) -> None:
        print("Sparrow flying")

class Penguin(Bird):
    # No fly method
    pass
```

#### C++
```cpp
class Bird {
public:
    virtual void fly() {
        // Base implementation
    }
};

// LSP violation - strengthens precondition
class PenguinBad : public Bird {
public:
    void fly() override {
        throw std::runtime_error("Penguins can't fly");
    }
};

// Better design
class FlyingBird {
public:
    virtual ~FlyingBird() = default;
    virtual void fly() = 0;
};

class Bird { };

class Sparrow : public Bird, public FlyingBird {
public:
    void fly() override {
        // Implementation
    }
};

class Penguin : public Bird {
    // No fly method
};
```

## 💡 Best Practices

1. **Design by Contract**

   #### Java
   ```java
   public interface Account {
       void withdraw(double amount);
       void deposit(double amount);
       double getBalance();
   }
   
   public class SavingsAccount implements Account {
       private double balance;
       
       @Override
       public void withdraw(double amount) {
           if (amount <= balance) {
               balance -= amount;
           } else {
               throw new InsufficientFundsException();
           }
       }
       
       @Override
       public void deposit(double amount) {
           if (amount > 0) {
               balance += amount;
           }
       }
       
       @Override
       public double getBalance() {
           return balance;
       }
   }
   ```

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class Account(ABC):
       @abstractmethod
       def withdraw(self, amount: float) -> None: pass
       
       @abstractmethod
       def deposit(self, amount: float) -> None: pass
       
       @abstractmethod
       def get_balance(self) -> float: pass

   class SavingsAccount(Account):
       def __init__(self):
           self._balance = 0.0
       
       def withdraw(self, amount: float) -> None:
           if amount <= self._balance:
               self._balance -= amount
           else:
               raise InsufficientFundsException()
       
       def deposit(self, amount: float) -> None:
           if amount > 0:
               self._balance += amount
       
       def get_balance(self) -> float:
           return self._balance
   ```

   #### C++
   ```cpp
   class Account {
   public:
       virtual ~Account() = default;
       virtual void withdraw(double amount) = 0;
       virtual void deposit(double amount) = 0;
       virtual double getBalance() const = 0;
   };

   class SavingsAccount : public Account {
   private:
       double balance = 0.0;
   public:
       void withdraw(double amount) override {
           if (amount <= balance) {
               balance -= amount;
           } else {
               throw InsufficientFundsException();
           }
       }
       
       void deposit(double amount) override {
           if (amount > 0) {
               balance += amount;
           }
       }
       
       double getBalance() const override {
           return balance;
       }
   };
   ```

2. **Use Abstract Classes Correctly**

   #### Java
   ```java
   public abstract class Vehicle {
       protected int speed;
       
       public abstract void accelerate();
       
       // Common behavior
       public void stop() {
           speed = 0;
       }
   }
   
   public class Car extends Vehicle {
       @Override
       public void accelerate() {
           speed += 10;
       }
   }
   
   public class Bicycle extends Vehicle {
       @Override
       public void accelerate() {
           speed += 5;
       }
   }
   ```

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class Vehicle(ABC):
       def __init__(self):
           self._speed = 0
       
       @abstractmethod
       def accelerate(self) -> None:
           pass
       
       # Common behavior
       def stop(self) -> None:
           self._speed = 0

   class Car(Vehicle):
       def accelerate(self) -> None:
           self._speed += 10

   class Bicycle(Vehicle):
       def accelerate(self) -> None:
           self._speed += 5
   ```

   #### C++
   ```cpp
   class Vehicle {
   protected:
       int speed = 0;
   public:
       virtual ~Vehicle() = default;
       virtual void accelerate() = 0;
       
       // Common behavior
       void stop() {
           speed = 0;
       }
   };

   class Car : public Vehicle {
   public:
       void accelerate() override {
           speed += 10;
       }
   };

   class Bicycle : public Vehicle {
   public:
       void accelerate() override {
           speed += 5;
       }
   };
   ```

3. **Factory Method Pattern**

   #### Java
   ```java
   public abstract class DocumentConverter {
       public final void convert(String input) {
           validateInput(input);
           doConversion(input);
           saveResult();
       }
       
       protected abstract void doConversion(String input);
       
       protected void validateInput(String input) {
           if (input == null || input.isEmpty()) {
               throw new IllegalArgumentException("Input cannot be empty");
           }
       }
       
       protected void saveResult() {
           // Common save logic
       }
   }
   ```

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class DocumentConverter(ABC):
       def convert(self, input: str) -> None:
           self._validate_input(input)
           self._do_conversion(input)
           self._save_result()
       
       @abstractmethod
       def _do_conversion(self, input: str) -> None:
           pass
       
       def _validate_input(self, input: str) -> None:
           if not input:
               raise ValueError("Input cannot be empty")
       
       def _save_result(self) -> None:
           # Common save logic
           pass
   ```

   #### C++
   ```cpp
   class DocumentConverter {
   public:
       virtual ~DocumentConverter() = default;
       
       void convert(const std::string& input) {
           validateInput(input);
           doConversion(input);
           saveResult();
       }
       
   protected:
       virtual void doConversion(const std::string& input) = 0;
       
       virtual void validateInput(const std::string& input) {
           if (input.empty()) {
               throw std::invalid_argument("Input cannot be empty");
           }
       }
       
       virtual void saveResult() {
           // Common save logic
       }
   };
   ```

## ⚠️ Common Pitfalls

1. **Violating Base Class Invariants**
   ```java
   // Bad example
   public class Rectangle {
       protected int width;
       protected int height;
       
       public void setDimensions(int width, int height) {
           assert width > 0 && height > 0;
           this.width = width;
           this.height = height;
       }
   }
   
   public class Square extends Rectangle {
       @Override
       public void setDimensions(int width, int height) {
           // Violates base class invariant by ignoring height
           super.setDimensions(width, width);
       }
   }
   ```

2. **Throwing Unexpected Exceptions**
   ```java
   public class File {
       public void save(String content) {
           // Save implementation
       }
   }
   
   // LSP violation
   public class ReadOnlyFile extends File {
       @Override
       public void save(String content) {
           throw new UnsupportedOperationException("Cannot save to read-only file");
       }
   }
   ```

3. **Return Type Violations**
   ```java
   public class Animal {
       protected String name;
       
       public Animal getParent() {
           return new Animal();
       }
   }
   
   // LSP violation
   public class Dog extends Animal {
       @Override
       public Dog getParent() {  // Covariant return type is okay
           return new Dog();
       }
   }
   ```

## 🎯 Interview Questions

1. **What's wrong with the Square/Rectangle example?**
   ```java
   Rectangle rect = new Square();
   rect.setWidth(5);
   rect.setHeight(4);
   // Area should be 20, but Square makes it 16
   assert rect.getArea() == 20;  // Fails!
   ```

2. **How would you fix this code to follow LSP?**
   ```java
   // Before - LSP violation
   public class Bird {
       public void fly() { }
   }
   
   public class Penguin extends Bird {
       @Override
       public void fly() {
           throw new UnsupportedOperationException();
       }
   }
   
   // After - LSP compliant
   public interface Flyable {
       void fly();
   }
   
   public class Bird { }
   
   public class FlyingBird extends Bird implements Flyable {
       @Override
       public void fly() { }
   }
   
   public class Penguin extends Bird {
       // No fly method
   }
   ```

3. **Explain how LSP relates to design by contract:**
   - Preconditions can't be strengthened
   - Postconditions can't be weakened
   - Invariants must be preserved
   - Base class behavior must be maintained

## 💻 Practice Exercise

Create a shape hierarchy that follows LSP:

```java
// Base interface for all shapes
public interface Shape {
    double getArea();
    double getPerimeter();
}

// Base class for quadrilaterals
public abstract class Quadrilateral implements Shape {
    protected double side1, side2, side3, side4;
    
    public Quadrilateral(double side1, double side2, double side3, double side4) {
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
        this.side4 = side4;
    }
    
    @Override
    public double getPerimeter() {
        return side1 + side2 + side3 + side4;
    }
}

// Rectangle implementation
public class Rectangle extends Quadrilateral {
    public Rectangle(double width, double height) {
        super(width, height, width, height);
    }
    
    @Override
    public double getArea() {
        return side1 * side2;
    }
}

// Square implementation
public class Square extends Quadrilateral {
    public Square(double side) {
        super(side, side, side, side);
    }
    
    @Override
    public double getArea() {
        return side1 * side1;
    }
}

// Circle implementation
public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}

// Shape processor that works with any shape
public class ShapeProcessor {
    public double calculateTotalArea(List<Shape> shapes) {
        return shapes.stream()
                    .mapToDouble(Shape::getArea)
                    .sum();
    }
    
    public double calculateTotalPerimeter(List<Shape> shapes) {
        return shapes.stream()
                    .mapToDouble(Shape::getPerimeter)
                    .sum();
    }
}

// Usage example
public class Main {
    public static void main(String[] args) {
        List<Shape> shapes = Arrays.asList(
            new Rectangle(5, 3),
            new Square(4),
            new Circle(2)
        );
        
        ShapeProcessor processor = new ShapeProcessor();
        System.out.println("Total area: " + processor.calculateTotalArea(shapes));
        System.out.println("Total perimeter: " + processor.calculateTotalPerimeter(shapes));
    }
}
```

## ❓ Frequently Asked Questions

### Q1: What's the classic Rectangle-Square problem?
**A:** It's the most famous LSP violation:
- Mathematically, a Square is a Rectangle
- But in code, `Square extends Rectangle` violates LSP
- `Rectangle.setWidth()` and `setHeight()` are independent
- `Square` must keep width == height, breaking the Rectangle contract
- Solution: Don't use inheritance; use a common `Shape` interface

### Q2: How do I know if I'm violating LSP?
**A:** Watch for these signs:
- Subclass throws exceptions the base class doesn't
- Subclass ignores or overrides parent methods with empty implementations
- Client code checks the type before calling methods
- Subclass weakens postconditions or strengthens preconditions
- Unit tests for parent class fail when run with subclass instances

### Q3: What are preconditions and postconditions?
**A:**
- **Preconditions:** What must be true *before* a method runs (input requirements)
- **Postconditions:** What will be true *after* a method runs (guaranteed outcomes)
- **LSP rule:** Subclass preconditions ≤ parent; subclass postconditions ≥ parent

### Q4: Can I throw different exceptions in a subclass?
**A:** It depends:
- ✅ OK: Throw more specific exceptions (subclass of parent's exception)
- ❌ Not OK: Throw new exception types the parent doesn't declare
- ❌ Not OK: Throw exceptions when parent method doesn't throw any
- The key is: client code expecting parent behavior shouldn't be surprised

### Q5: How does LSP relate to "favor composition over inheritance"?
**A:** LSP violations often indicate inheritance is the wrong choice:
- If subclass can't fully substitute for parent, don't use inheritance
- Use composition instead: "has-a" rather than "is-a"
- Interfaces can still provide polymorphism without inheritance hierarchy
- Example: Instead of `Square extends Rectangle`, both implement `Shape`

### Q6: What's the difference between LSP and "is-a" relationship?
**A:**
- **"Is-a"** is often misunderstood as just conceptual similarity
- **LSP** is about *behavioral* substitutability in code
- A Square "is-a" Rectangle mathematically, but not behaviorally in OOP
- Always ask: "Can I use subclass everywhere parent is expected without issues?"

## 📚 Additional Resources

1. [Barbara Liskov's Paper on Behavioral Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)
2. [Clean Code by Robert C. Martin - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
3. [Design by Contract](https://www.eiffel.com/values/design-by-contract/introduction/) 