# 🏗️ Abstract Classes in Object-Oriented Programming

## 📝 Definition
An abstract class is a class that is declared with the `abstract` keyword and may contain both abstract and concrete methods. It cannot be instantiated but can be subclassed. Abstract classes are used to provide a common base class implementation to derived classes.

## 🎯 Key Concepts

### 1. Abstract Class Declaration
```java
public abstract class Animal {
    protected String name;
    protected int age;
    
    // Constructor
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Abstract method
    public abstract void makeSound();
    
    // Concrete method
    public void eat() {
        System.out.println(name + " is eating");
    }
}
```

### 2. Abstract Class Implementation
```java
public class Dog extends Animal {
    public Dog(String name, int age) {
        super(name, age);
    }
    
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
    
    // Additional method
    public void fetch() {
        System.out.println(name + " is fetching the ball");
    }
}
```

### 3. Abstract Class vs Interface
```java
// Abstract class - can have state and implementation
public abstract class DatabaseConnection {
    protected String connectionString;
    protected boolean isConnected;
    
    public DatabaseConnection(String connectionString) {
        this.connectionString = connectionString;
    }
    
    public abstract void connect();
    public abstract void disconnect();
    
    // Shared implementation
    public boolean isConnected() {
        return isConnected;
    }
}

// Interface - only contract
public interface Connection {
    void connect();
    void disconnect();
    boolean isConnected();
}
```

## 💡 Best Practices

1. **Use Abstract Classes for Common Functionality**
   ```java
   public abstract class BaseController {
       protected Logger logger;
       
       // Common error handling
       protected void handleError(Exception e) {
           logger.error("Error occurred: " + e.getMessage());
       }
       
       // Abstract methods for specific implementations
       protected abstract void processRequest();
       protected abstract void validateInput();
   }
   ```

2. **Template Method Pattern**
   ```java
   public abstract class DataProcessor {
       // Template method
       public final void process() {
           readData();
           processData();
           saveData();
       }
       
       // Steps that can be overridden
       protected abstract void readData();
       protected abstract void processData();
       
       // Common implementation
       protected void saveData() {
           System.out.println("Saving processed data");
       }
   }
   ```

3. **Provide Default Implementations**
   ```java
   public abstract class Shape {
       protected String color;
       
       // Default implementation
       public void setColor(String color) {
           this.color = color;
       }
       
       // Must be implemented by subclasses
       public abstract double getArea();
       public abstract double getPerimeter();
   }
   ```

## ⚠️ Common Pitfalls

1. **Too Many Abstract Methods**
   ```java
   // Bad - too many abstract methods
   public abstract class Vehicle {
       public abstract void start();
       public abstract void stop();
       public abstract void accelerate();
       public abstract void brake();
       public abstract void turnLeft();
       public abstract void turnRight();
       // ... more abstract methods
   }
   
   // Better - mix of abstract and concrete methods
   public abstract class Vehicle {
       protected int speed;
       
       public abstract void start();
       public abstract void stop();
       
       // Common implementations
       public void accelerate() {
           speed += 5;
       }
       
       public void brake() {
           speed = Math.max(0, speed - 5);
       }
   }
   ```

2. **Deep Inheritance Hierarchy**
   ```java
   // Bad - deep hierarchy
   abstract class Animal { }
   abstract class Mammal extends Animal { }
   abstract class Carnivore extends Mammal { }
   abstract class Feline extends Carnivore { }
   class Lion extends Feline { }
   
   // Better - flatter hierarchy
   abstract class Animal { }
   abstract class Mammal extends Animal { }
   class Lion extends Mammal { }
   ```

3. **Abstract Class Constructors**
   ```java
   // Bad - complex constructor
   public abstract class Base {
       public Base() {
           // Complex initialization
           // Calls abstract methods
           initialize();  // Dangerous in constructor
       }
       
       protected abstract void initialize();
   }
   
   // Better - simple constructor
   public abstract class Base {
       public Base() {
           // Minimal initialization
       }
       
       public void initialize() {
           // Safe to call after construction
           doInitialize();
       }
       
       protected abstract void doInitialize();
   }
   ```

## 🎯 Interview Questions

1. **When would you use an abstract class instead of an interface?**
   - When you need to share code among several related classes
   - When you need to access modifiers other than public
   - When you need to declare non-static or non-final fields

2. **Can abstract classes have constructors?**
   ```java
   public abstract class Base {
       private String name;
       
       // Yes, they can have constructors
       public Base(String name) {
           this.name = name;
       }
   }
   ```

3. **Can abstract classes have final methods?**
   ```java
   public abstract class Base {
       // Yes, final methods prevent overriding
       public final void criticalOperation() {
           // Implementation that shouldn't be overridden
       }
       
       public abstract void normalOperation();
   }
   ```

## 💻 Practice Exercise

Create a game character system using abstract classes:

```java
public abstract class GameCharacter {
    protected String name;
    protected int health;
    protected int level;
    
    public GameCharacter(String name) {
        this.name = name;
        this.health = 100;
        this.level = 1;
    }
    
    // Abstract methods
    public abstract void attack();
    public abstract void useSpecialAbility();
    
    // Concrete methods
    public void takeDamage(int damage) {
        this.health = Math.max(0, this.health - damage);
        if (health == 0) {
            die();
        }
    }
    
    public void heal(int amount) {
        this.health = Math.min(100, this.health + amount);
    }
    
    protected void die() {
        System.out.println(name + " has been defeated!");
    }
    
    public void levelUp() {
        level++;
        System.out.println(name + " reached level " + level + "!");
    }
}

// Warrior implementation
public class Warrior extends GameCharacter {
    private int rage;
    
    public Warrior(String name) {
        super(name);
        this.rage = 0;
    }
    
    @Override
    public void attack() {
        System.out.println(name + " swings their sword!");
        rage += 10;
    }
    
    @Override
    public void useSpecialAbility() {
        if (rage >= 50) {
            System.out.println(name + " uses Berserker Rage!");
            rage = 0;
        } else {
            System.out.println("Not enough rage!");
        }
    }
}

// Mage implementation
public class Mage extends GameCharacter {
    private int mana;
    
    public Mage(String name) {
        super(name);
        this.mana = 100;
    }
    
    @Override
    public void attack() {
        System.out.println(name + " casts a fireball!");
        mana -= 10;
    }
    
    @Override
    public void useSpecialAbility() {
        if (mana >= 50) {
            System.out.println(name + " casts Arcane Explosion!");
            mana -= 50;
        } else {
            System.out.println("Not enough mana!");
        }
    }
}
```

## 📚 Additional Resources

1. [Oracle Java Documentation on Abstract Classes](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html)
2. [Design Patterns using Abstract Classes](https://refactoring.guru/design-patterns/template-method)
3. [Effective Java - Item 19: Design and document for inheritance or else prohibit it](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997) 