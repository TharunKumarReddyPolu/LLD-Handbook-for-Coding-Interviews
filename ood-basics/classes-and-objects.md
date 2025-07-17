# Classes and Objects 📌

## Introduction

Classes and objects are the fundamental building blocks of Object-Oriented Programming (OOP). A class is a blueprint for creating objects, and an object is an instance of a class.

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

### Creating and Using Objects
```java
// Creating objects
Car myCar = new Car("Toyota", "Camry", 2022);
Car anotherCar = new Car("Honda", "Civic", 2023);

// Using objects
myCar.startEngine();
System.out.println(myCar.getInfo());
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

## Additional Resources

- [Oracle Java Documentation - Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)
- [Effective Java by Joshua Bloch](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
- [Clean Code - Classes Chapter](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 