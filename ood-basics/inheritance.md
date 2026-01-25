# 🔄 Inheritance in Object-Oriented Programming

## 📝 Definition
Inheritance is a fundamental OOP concept that allows a class (child/derived class) to inherit properties and methods from another class (parent/base class). It promotes code reuse and establishes a relationship between parent and child classes.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Inheritance, you should understand:
- [Classes & Objects](classes-and-objects.md) - Creating and using classes
- [Encapsulation](encapsulation.md) - Access modifiers (public, private, protected)
- Basic understanding of code reuse concepts

### Learning Path
After mastering Inheritance, continue with:
1. **Next:** [Polymorphism](polymorphism.md) - Override inherited methods
2. **Then:** [Abstract Classes](abstract-classes.md) - Partial implementations
3. **Then:** [Interfaces](interfaces.md) - Multiple inheritance via interfaces
4. **Related:** [Liskov Substitution Principle](../solid-principles/lsp.md) - Proper inheritance design

### How This Fits in the Big Picture
```
Classes & Objects → Encapsulation → Inheritance → Polymorphism
                                         ↓
                          Enables code reuse and hierarchies
                          Foundation for LSP and Template Method Pattern
```

## 🎯 Key Concepts

### Types of Inheritance
1. **Single Inheritance**
   - A class inherits from only one parent class

   #### Java
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

   #### Python
   ```python
   class Animal:
       def eat(self) -> None:
           print("Eating...")

   class Dog(Animal):
       def bark(self) -> None:
           print("Barking...")
   ```

   #### C++
   ```cpp
   class Animal {
   public:
       void eat() {
           std::cout << "Eating..." << std::endl;
       }
   };

   class Dog : public Animal {
   public:
       void bark() {
           std::cout << "Barking..." << std::endl;
       }
   };
   ```

2. **Multiple Inheritance** (Through Interfaces in Java)

   #### Java
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

   #### Python
   ```python
   from abc import ABC, abstractmethod

   class Flyable(ABC):
       @abstractmethod
       def fly(self) -> None: pass

   class Swimmable(ABC):
       @abstractmethod
       def swim(self) -> None: pass

   class Duck(Flyable, Swimmable):
       def fly(self) -> None:
           print("Duck flying")
       
       def swim(self) -> None:
           print("Duck swimming")
   ```

   #### C++
   ```cpp
   class Flyable {
   public:
       virtual ~Flyable() = default;
       virtual void fly() = 0;
   };

   class Swimmable {
   public:
       virtual ~Swimmable() = default;
       virtual void swim() = 0;
   };

   class Duck : public Flyable, public Swimmable {
   public:
       void fly() override {
           std::cout << "Duck flying" << std::endl;
       }
       
       void swim() override {
           std::cout << "Duck swimming" << std::endl;
       }
   };
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

## ❓ Frequently Asked Questions

### Q1: When should I use inheritance vs composition?
**A:** Use this decision guide:
| Use Inheritance When | Use Composition When |
|---------------------|---------------------|
| True "is-a" relationship | "Has-a" relationship |
| Subclass is a specialization | Combining behaviors |
| Need polymorphism with parent type | Need flexibility to change |
| Behavior is stable and unlikely to change | Behavior may vary independently |

**Rule of thumb:** Favor composition over inheritance.

### Q2: What's the difference between `extends` and `implements`?
**A:**
| `extends` | `implements` |
|-----------|--------------|
| Inherit from class | Implement interface |
| Single inheritance only | Multiple interfaces allowed |
| Inherits implementation | Must provide implementation |
| "Is-a" relationship | "Can-do" relationship |

### Q3: Can I prevent a class from being inherited?
**A:** Yes!
- **Java:** Use `final` keyword: `final class MyClass`
- **C++:** Use `final` specifier: `class MyClass final`
- **Python:** No built-in way, but use metaclass or raise error in `__init_subclass__`

### Q4: What is method overriding?
**A:** Redefining a parent class method in the child class:
- Same method signature (name, parameters)
- Allows different behavior in subclass
- Use `@Override` annotation (Java) to catch errors
- Parent method can be called via `super.method()`

### Q5: What's the "diamond problem" in multiple inheritance?
**A:** When a class inherits from two classes that have a common ancestor:
```
      A
     / \
    B   C
     \ /
      D  ← Which A's method does D use?
```
- **Java:** Avoids by allowing only single class inheritance
- **C++:** Solved with virtual inheritance
- **Python:** Uses MRO (Method Resolution Order)

### Q6: What does `super` keyword do?
**A:** Refers to the parent class:
- Call parent constructor: `super()` or `super(args)`
- Call parent method: `super.methodName()`
- Access parent field: `super.fieldName`
- Must be first statement in constructor (Java)

## 📚 Additional Resources

1. [Oracle Java Documentation on Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)
2. [Effective Java by Joshua Bloch - Chapter on Inheritance](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Design Patterns that use Inheritance](https://refactoring.guru/design-patterns/classification) 