# 🔄 Liskov Substitution Principle (LSP)

## 📝 Definition
The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. In other words, derived classes must be substitutable for their base classes.

## 🎯 Key Concepts

### 1. Behavioral Subtyping
- Subclass methods should expect no more and provide no less than the base class
- Maintain the contract defined by the base class
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

### 2. Contract Conditions
1. **Preconditions** cannot be strengthened in a subtype
2. **Postconditions** cannot be weakened in a subtype
3. **Invariants** must be preserved in a subtype
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

## 💡 Best Practices

1. **Design by Contract**
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

2. **Use Abstract Classes Correctly**
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

3. **Factory Method Pattern**
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

## 📚 Additional Resources

1. [Barbara Liskov's Paper on Behavioral Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)
2. [Clean Code by Robert C. Martin - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
3. [Design by Contract](https://www.eiffel.com/values/design-by-contract/introduction/) 