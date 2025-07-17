# 🔄 Inheritance in Object-Oriented Programming

## 📝 Definition
Inheritance is a fundamental OOP concept that allows a class (child/derived class) to inherit properties and methods from another class (parent/base class). It promotes code reuse and establishes a relationship between parent and child classes.

## 🎯 Key Concepts

### Types of Inheritance
1. **Single Inheritance**
   - A class inherits from only one parent class
   ```java
   class Animal {
       void eat() {
           System.out.println("Eating...");
       }
   }
   
   class Dog extends Animal {
       void bark() {
           System.out.println("Barking...");
       }
   }
   ```

2. **Multiple Inheritance** (Through Interfaces in Java)
   ```java
   interface Flyable {
       void fly();
   }
   
   interface Swimmable {
       void swim();
   }
   
   class Duck implements Flyable, Swimmable {
       public void fly() {
           System.out.println("Duck flying");
       }
       
       public void swim() {
           System.out.println("Duck swimming");
       }
   }
   ```

3. **Multilevel Inheritance**
   ```java
   class Animal {
       void eat() { }
   }
   
   class Mammal extends Animal {
       void walk() { }
   }
   
   class Dog extends Mammal {
       void bark() { }
   }
   ```

4. **Hierarchical Inheritance**
   ```java
   class Animal {
       void eat() { }
   }
   
   class Dog extends Animal {
       void bark() { }
   }
   
   class Cat extends Animal {
       void meow() { }
   }
   ```

## 💡 Best Practices

1. **Use Inheritance for "IS-A" Relationships**
   - A Dog "is-a" Animal
   - A Car "is-a" Vehicle
   - Avoid using inheritance for "has-a" relationships

2. **Favor Composition Over Inheritance**
   - Inheritance creates tight coupling
   - Composition is more flexible and maintainable
   ```java
   // Instead of inheritance
   class Car extends Engine { } // Bad
   
   // Use composition
   class Car {
       private Engine engine; // Good
   }
   ```

3. **Keep Inheritance Hierarchies Shallow**
   - Deep inheritance hierarchies are hard to understand and maintain
   - Try to keep it to 2-3 levels maximum

4. **Use the Protected Access Modifier**
   - Makes inheritance more maintainable
   - Provides encapsulation while allowing inheritance

## ⚠️ Common Pitfalls

1. **Deep Inheritance Hierarchies**
   - Makes code hard to understand and maintain
   - Increases coupling between classes

2. **Breaking LSP (Liskov Substitution Principle)**
   - Child classes should be substitutable for their parent class
   ```java
   // Bad example
   class Bird {
       void fly() { }
   }
   
   class Penguin extends Bird { // Penguins can't fly!
       void fly() {
           throw new UnsupportedOperationException();
       }
   }
   ```

3. **Inheritance for Code Reuse Only**
   - Don't use inheritance just to reuse code
   - Use composition if there's no "is-a" relationship

## 🎯 Interview Questions

1. **What is the difference between inheritance and composition?**
   ```java
   // Inheritance
   class Car extends Vehicle { }
   
   // Composition
   class Car {
       private Engine engine;
   }
   ```

2. **How does Java support multiple inheritance?**
   - Through interfaces
   - Diamond problem and how Java avoids it

3. **When would you choose composition over inheritance?**
   - When relationship is "has-a" instead of "is-a"
   - When you need more flexibility
   - When you want to avoid tight coupling

## 💻 Practice Exercise

Design a vehicle hierarchy system:
1. Create a base Vehicle class
2. Implement different types of vehicles
3. Add appropriate methods and properties
4. Consider using both inheritance and composition

```java
// Sample solution
abstract class Vehicle {
    protected String brand;
    protected String model;
    
    public abstract void start();
    public abstract void stop();
}

class Car extends Vehicle {
    private Engine engine;
    private Transmission transmission;
    
    @Override
    public void start() {
        engine.start();
    }
    
    @Override
    public void stop() {
        engine.stop();
    }
}

class Bicycle extends Vehicle {
    @Override
    public void start() {
        System.out.println("Start pedaling");
    }
    
    @Override
    public void stop() {
        System.out.println("Stop pedaling");
    }
}
```

## 📚 Additional Resources

1. [Oracle Java Documentation on Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)
2. [Effective Java by Joshua Bloch - Chapter on Inheritance](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Design Patterns that use Inheritance](https://refactoring.guru/design-patterns/classification) 