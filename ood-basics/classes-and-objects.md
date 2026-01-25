# Classes and Objects 📌

## Introduction

Classes and objects are the fundamental building blocks of Object-Oriented Programming (OOP). A class is a blueprint for creating objects, and an object is an instance of a class.

## 📚 Prerequisites & Learning Path

### Prerequisites
This is the **starting point** for Object-Oriented Design. Before studying this topic, you should have:
- Basic programming knowledge (variables, functions, control flow)
- Understanding of data types and basic syntax in your preferred language
- Familiarity with any programming language (Java, Python, or C++)

### Learning Path
After mastering Classes & Objects, continue with:
1. **Next:** [Encapsulation](encapsulation.md) - Learn to protect your data
2. **Then:** [Inheritance](inheritance.md) - Extend and reuse classes
3. **Then:** [Polymorphism](polymorphism.md) - One interface, many implementations
4. **Finally:** [Abstraction](abstraction.md) - Hide complexity

### How This Fits in the Big Picture
```
📍 YOU ARE HERE
       ↓
Classes & Objects → Encapsulation → Inheritance → Polymorphism → Abstraction
       ↓
These form the foundation for SOLID Principles and Design Patterns
```

## Key Concepts

### 1. Classes
- Template/blueprint for creating objects
- Defines attributes (state) and methods (behavior)
- Encapsulates related data and functions

### 2. Objects
- Instances of a class
- Have their own state
- Share behavior defined in the class
- Created using constructors

### 3. Constructor
- Special method for initializing objects
- Same name as the class
- Can be overloaded
- No return type

### 4. Instance Variables
- Represent object state
- Unique to each instance
- Defined in the class
- Access level can be controlled

### 5. Methods
- Define object behavior
- Can access instance variables
- Can be public/private/protected
- Can be static or instance methods

## Examples

### Basic Class Definition

#### Java
```java
public class Car {
    // Instance variables
    private String brand;
    private String model;
    private int year;
    
    // Constructor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    
    // Methods
    public void startEngine() {
        System.out.println("Engine started!");
    }
    
    public String getInfo() {
        return year + " " + brand + " " + model;
    }
}
```

#### Python
```python
class Car:
    # Constructor
    def __init__(self, brand: str, model: str, year: int):
        # Instance variables
        self._brand = brand
        self._model = model
        self._year = year
    
    # Methods
    def start_engine(self) -> None:
        print("Engine started!")
    
    def get_info(self) -> str:
        return f"{self._year} {self._brand} {self._model}"
```

#### C++
```cpp
class Car {
private:
    // Instance variables
    std::string brand;
    std::string model;
    int year;

public:
    // Constructor
    Car(const std::string& brand, const std::string& model, int year)
        : brand(brand), model(model), year(year) {}
    
    // Methods
    void startEngine() {
        std::cout << "Engine started!" << std::endl;
    }
    
    std::string getInfo() const {
        return std::to_string(year) + " " + brand + " " + model;
    }
};
```

### Creating and Using Objects

#### Java
```java
// Creating objects
Car myCar = new Car("Toyota", "Camry", 2022);
Car anotherCar = new Car("Honda", "Civic", 2023);

// Using objects
myCar.startEngine();
System.out.println(myCar.getInfo());
```

#### Python
```python
# Creating objects
my_car = Car("Toyota", "Camry", 2022)
another_car = Car("Honda", "Civic", 2023)

# Using objects
my_car.start_engine()
print(my_car.get_info())
```

#### C++
```cpp
// Creating objects
Car myCar("Toyota", "Camry", 2022);
Car anotherCar("Honda", "Civic", 2023);

// Using objects
myCar.startEngine();
std::cout << myCar.getInfo() << std::endl;
```

## Common Pitfalls

1. **Not Initializing Variables**
   ```java
   public class Example {
       private int number;  // Uninitialized
       
       public void printNumber() {
           System.out.println(number);  // Prints 0 (default value)
       }
   }
   ```

2. **Memory Leaks**
   ```java
   public class ResourceHolder {
       private Resource resource;
       
       public void processResource() {
           resource = new Resource();
           // ... use resource ...
           // Forgot to close/cleanup resource
       }
   }
   ```

3. **Exposing Internal State**
   ```java
   public class User {
       public ArrayList<String> roles;  // Direct access to mutable object
       // Should be private with controlled access methods
   }
   ```

## Best Practices

1. **Encapsulation**
   ```java
   public class BankAccount {
       private double balance;  // Private state
       
       public void deposit(double amount) {
           if (amount > 0) {
               balance += amount;
           }
       }
   }
   ```

2. **Immutable Objects**
   ```java
   public final class Point {
       private final int x;
       private final int y;
       
       public Point(int x, int y) {
           this.x = x;
           this.y = y;
       }
       
       // Only getters, no setters
       public int getX() { return x; }
       public int getY() { return y; }
   }
   ```

3. **Builder Pattern for Complex Objects**
   ```java
   public class User {
       private final String name;
       private final String email;
       private final int age;
       
       private User(UserBuilder builder) {
           this.name = builder.name;
           this.email = builder.email;
           this.age = builder.age;
       }
       
       public static class UserBuilder {
           private String name;
           private String email;
           private int age;
           
           public UserBuilder name(String name) {
               this.name = name;
               return this;
           }
           
           public User build() {
               return new User(this);
           }
       }
   }
   ```

## Interview Questions

1. **What is the difference between a class and an object?**
   - Class: Blueprint/template for creating objects
   - Object: Instance of a class with its own state

2. **Explain the role of constructors.**
   - Initialize object state
   - Can have multiple overloaded versions
   - Called when creating new objects

3. **What is the 'this' keyword used for?**
   - Refers to current instance
   - Disambiguates instance variables from parameters
   - Can call other constructors

4. **How do you implement immutable classes?**
   - Make class final
   - Make fields private and final
   - No setters
   - Deep copy mutable objects

## Exercises

1. Create a `Student` class with:
   - Name, ID, and grades
   - Method to calculate average grade
   - Method to add new grade

2. Implement a `BankAccount` class with:
   - Proper encapsulation
   - Methods for deposit/withdraw
   - Transaction history

3. Design an immutable `Address` class with:
   - Street, city, state, zip
   - Proper validation
   - ToString method

## ❓ Frequently Asked Questions

### Q1: What's the difference between a class and an object?
**A:**
| Class | Object |
|-------|--------|
| Blueprint/template | Instance of a class |
| Defines structure | Has actual values |
| Exists at compile time | Exists at runtime |
| No memory allocated | Memory allocated |
| One per type | Many can exist |

### Q2: When should I use a class vs a struct?
**A:**
- **Java:** Only has classes (no structs)
- **C++:** Use struct for data-only, class for behavior + data
- **Python:** Use class for everything; dataclass for simple data containers
- **General rule:** If it has behavior, use a class

### Q3: What is `this` keyword used for?
**A:** `this` refers to the current object instance:
- Distinguish instance variables from parameters with same name
- Pass current object to other methods
- Chain constructor calls (`this()`)
- Return the current object for method chaining

### Q4: What's the difference between instance and class (static) members?
**A:**
| Instance Members | Static Members |
|-----------------|----------------|
| Belong to object | Belong to class |
| Each object has own copy | Shared across all objects |
| Accessed via object | Accessed via class name |
| Can access static members | Cannot access instance members directly |

### Q5: Can a class have multiple constructors?
**A:** Yes! This is called constructor overloading:
- Each constructor has different parameters
- Use `this()` to chain constructors
- Useful for providing default values
- Common pattern: simple constructor calls complex one

### Q6: What happens if I don't define a constructor?
**A:** The compiler provides a default constructor:
- Takes no arguments
- Initializes fields to default values (0, null, false)
- Not provided if you define any constructor yourself
- Called implicitly when creating objects

## Additional Resources

- [Oracle Java Documentation - Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)
- [Effective Java by Joshua Bloch](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
- [Clean Code - Classes Chapter](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 