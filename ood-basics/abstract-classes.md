# 🏗️ Abstract Classes in Object-Oriented Programming

## 📝 Definition
An abstract class is a class that is declared with the `abstract` keyword and may contain both abstract and concrete methods. It cannot be instantiated but can be subclassed. Abstract classes are used to provide a common base class implementation to derived classes.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Abstract Classes, you should understand:
- [Classes & Objects](classes-and-objects.md) - Class structure and instances
- [Inheritance](inheritance.md) - Extending classes
- [Polymorphism](polymorphism.md) - Method overriding
- [Abstraction](abstraction.md) - Hiding complexity

### Learning Path
After mastering Abstract Classes, continue with:
1. **Next:** [Interfaces](interfaces.md) - Pure contracts vs partial implementations
2. **Then:** [Relationships](relationships.md) - How classes relate to each other
3. **Related:** [Template Method Pattern](../design-patterns/behavioral/README.md) - Abstract classes in patterns
4. **SOLID:** [Liskov Substitution Principle](../solid-principles/lsp.md) - Proper abstract hierarchies

### How This Fits in the Big Picture
```
Inheritance → Abstract Classes ←→ Interfaces
                    ↓
    Provide common functionality with extension points
    Key to Template Method and Factory patterns
```

## 🎯 Key Concepts

### 1. Abstract Class Declaration

**Java:**
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

**Python:**
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name: str, age: int):
        self._name = name
        self._age = age
    
    # Abstract method
    @abstractmethod
    def make_sound(self):
        pass
    
    # Concrete method
    def eat(self):
        print(f"{self._name} is eating")
```

**C++:**
```cpp
#include <iostream>
#include <string>

class Animal {
protected:
    std::string name;
    int age;

public:
    // Constructor
    Animal(const std::string& name, int age) : name(name), age(age) {}
    
    // Abstract method (pure virtual)
    virtual void makeSound() = 0;
    
    // Concrete method
    void eat() {
        std::cout << name << " is eating" << std::endl;
    }
    
    virtual ~Animal() = default;
};
```

### 2. Abstract Class Implementation

**Java:**
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

**Python:**
```python
class Dog(Animal):
    def __init__(self, name: str, age: int):
        super().__init__(name, age)
    
    def make_sound(self):
        print("Woof!")
    
    # Additional method
    def fetch(self):
        print(f"{self._name} is fetching the ball")
```

**C++:**
```cpp
class Dog : public Animal {
public:
    Dog(const std::string& name, int age) : Animal(name, age) {}
    
    void makeSound() override {
        std::cout << "Woof!" << std::endl;
    }
    
    // Additional method
    void fetch() {
        std::cout << name << " is fetching the ball" << std::endl;
    }
};
```

### 3. Abstract Class vs Interface

**Java:**
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

**Python:**
```python
from abc import ABC, abstractmethod

# Abstract class - can have state and implementation
class DatabaseConnection(ABC):
    def __init__(self, connection_string: str):
        self._connection_string = connection_string
        self._is_connected = False
    
    @abstractmethod
    def connect(self):
        pass
    
    @abstractmethod
    def disconnect(self):
        pass
    
    # Shared implementation
    def is_connected(self) -> bool:
        return self._is_connected

# Interface-like - only contract (ABC with only abstract methods)
class Connection(ABC):
    @abstractmethod
    def connect(self):
        pass
    
    @abstractmethod
    def disconnect(self):
        pass
    
    @abstractmethod
    def is_connected(self) -> bool:
        pass
```

**C++:**
```cpp
// Abstract class - can have state and implementation
class DatabaseConnection {
protected:
    std::string connectionString;
    bool connected;

public:
    DatabaseConnection(const std::string& connStr) 
        : connectionString(connStr), connected(false) {}
    
    virtual void connect() = 0;
    virtual void disconnect() = 0;
    
    // Shared implementation
    bool isConnected() const {
        return connected;
    }
    
    virtual ~DatabaseConnection() = default;
};

// Interface - only contract (pure abstract class)
class Connection {
public:
    virtual void connect() = 0;
    virtual void disconnect() = 0;
    virtual bool isConnected() const = 0;
    virtual ~Connection() = default;
};
```

## 💡 Best Practices

1. **Use Abstract Classes for Common Functionality**

   **Java:**
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

   **Python:**
   ```python
   from abc import ABC, abstractmethod
   import logging

   class BaseController(ABC):
       def __init__(self):
           self._logger = logging.getLogger(self.__class__.__name__)
       
       # Common error handling
       def handle_error(self, e: Exception):
           self._logger.error(f"Error occurred: {str(e)}")
       
       # Abstract methods for specific implementations
       @abstractmethod
       def process_request(self):
           pass
       
       @abstractmethod
       def validate_input(self):
           pass
   ```

   **C++:**
   ```cpp
   class BaseController {
   protected:
       Logger* logger;
       
       // Common error handling
       void handleError(const std::exception& e) {
           logger->error("Error occurred: " + std::string(e.what()));
       }
       
       // Abstract methods for specific implementations
       virtual void processRequest() = 0;
       virtual void validateInput() = 0;
       
   public:
       virtual ~BaseController() = default;
   };
   ```

2. **Template Method Pattern**

   **Java:**
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

   **Python:**
   ```python
   from abc import ABC, abstractmethod

   class DataProcessor(ABC):
       # Template method
       def process(self):
           self.read_data()
           self.process_data()
           self.save_data()
       
       # Steps that can be overridden
       @abstractmethod
       def read_data(self):
           pass
       
       @abstractmethod
       def process_data(self):
           pass
       
       # Common implementation
       def save_data(self):
           print("Saving processed data")
   ```

   **C++:**
   ```cpp
   class DataProcessor {
   public:
       // Template method (final to prevent override)
       void process() {
           readData();
           processData();
           saveData();
       }
       
   protected:
       // Steps that can be overridden
       virtual void readData() = 0;
       virtual void processData() = 0;
       
       // Common implementation
       virtual void saveData() {
           std::cout << "Saving processed data" << std::endl;
       }
       
   public:
       virtual ~DataProcessor() = default;
   };
   ```

3. **Provide Default Implementations**

   **Java:**
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

   **Python:**
   ```python
   from abc import ABC, abstractmethod

   class Shape(ABC):
       def __init__(self):
           self._color = ""
       
       # Default implementation
       def set_color(self, color: str):
           self._color = color
       
       # Must be implemented by subclasses
       @abstractmethod
       def get_area(self) -> float:
           pass
       
       @abstractmethod
       def get_perimeter(self) -> float:
           pass
   ```

   **C++:**
   ```cpp
   class Shape {
   protected:
       std::string color;
       
   public:
       // Default implementation
       void setColor(const std::string& color) {
           this->color = color;
       }
       
       // Must be implemented by subclasses
       virtual double getArea() = 0;
       virtual double getPerimeter() = 0;
       virtual ~Shape() = default;
   };
   ```

## ⚠️ Common Pitfalls

1. **Too Many Abstract Methods**

   **Java:**
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

   **Python:**
   ```python
   # Bad - too many abstract methods
   class Vehicle(ABC):
       @abstractmethod
       def start(self): pass
       @abstractmethod
       def stop(self): pass
       @abstractmethod
       def accelerate(self): pass
       @abstractmethod
       def brake(self): pass
       @abstractmethod
       def turn_left(self): pass
       @abstractmethod
       def turn_right(self): pass
       # ... more abstract methods
   
   # Better - mix of abstract and concrete methods
   class Vehicle(ABC):
       def __init__(self):
           self._speed = 0
       
       @abstractmethod
       def start(self): pass
       
       @abstractmethod
       def stop(self): pass
       
       # Common implementations
       def accelerate(self):
           self._speed += 5
       
       def brake(self):
           self._speed = max(0, self._speed - 5)
   ```

   **C++:**
   ```cpp
   // Bad - too many abstract methods
   class Vehicle {
   public:
       virtual void start() = 0;
       virtual void stop() = 0;
       virtual void accelerate() = 0;
       virtual void brake() = 0;
       virtual void turnLeft() = 0;
       virtual void turnRight() = 0;
       // ... more abstract methods
       virtual ~Vehicle() = default;
   };
   
   // Better - mix of abstract and concrete methods
   class Vehicle {
   protected:
       int speed = 0;
       
   public:
       virtual void start() = 0;
       virtual void stop() = 0;
       
       // Common implementations
       virtual void accelerate() {
           speed += 5;
       }
       
       virtual void brake() {
           speed = std::max(0, speed - 5);
       }
       
       virtual ~Vehicle() = default;
   };
   ```

2. **Deep Inheritance Hierarchy**

   **Java:**
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

   **Python:**
   ```python
   # Bad - deep hierarchy
   class Animal(ABC): pass
   class Mammal(Animal): pass
   class Carnivore(Mammal): pass
   class Feline(Carnivore): pass
   class Lion(Feline): pass
   
   # Better - flatter hierarchy
   class Animal(ABC): pass
   class Mammal(Animal): pass
   class Lion(Mammal): pass
   ```

   **C++:**
   ```cpp
   // Bad - deep hierarchy
   class Animal { public: virtual ~Animal() = default; };
   class Mammal : public Animal { };
   class Carnivore : public Mammal { };
   class Feline : public Carnivore { };
   class Lion : public Feline { };
   
   // Better - flatter hierarchy
   class Animal { public: virtual ~Animal() = default; };
   class Mammal : public Animal { };
   class Lion : public Mammal { };
   ```

3. **Abstract Class Constructors**

   **Java:**
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

   **Python:**
   ```python
   # Bad - complex constructor
   class Base(ABC):
       def __init__(self):
           # Complex initialization
           # Calls abstract methods
           self.initialize()  # Dangerous in constructor
       
       @abstractmethod
       def initialize(self):
           pass
   
   # Better - simple constructor
   class Base(ABC):
       def __init__(self):
           # Minimal initialization
           pass
       
       def initialize(self):
           # Safe to call after construction
           self.do_initialize()
       
       @abstractmethod
       def do_initialize(self):
           pass
   ```

   **C++:**
   ```cpp
   // Bad - complex constructor
   class Base {
   public:
       Base() {
           // Complex initialization
           // Calls pure virtual - undefined behavior!
           initialize();  // Dangerous in constructor
       }
       
       virtual void initialize() = 0;
       virtual ~Base() = default;
   };
   
   // Better - simple constructor
   class Base {
   public:
       Base() {
           // Minimal initialization
       }
       
       void initialize() {
           // Safe to call after construction
           doInitialize();
       }
       
       virtual void doInitialize() = 0;
       virtual ~Base() = default;
   };
   ```

## 🎯 Interview Questions

1. **When would you use an abstract class instead of an interface?**
   - When you need to share code among several related classes
   - When you need to access modifiers other than public
   - When you need to declare non-static or non-final fields

2. **Can abstract classes have constructors?**

   **Java:**
   ```java
   public abstract class Base {
       private String name;
       
       // Yes, they can have constructors
       public Base(String name) {
           this.name = name;
       }
   }
   ```

   **Python:**
   ```python
   class Base(ABC):
       # Yes, they can have constructors
       def __init__(self, name: str):
           self._name = name
   ```

   **C++:**
   ```cpp
   class Base {
   private:
       std::string name;
       
   public:
       // Yes, they can have constructors
       Base(const std::string& name) : name(name) {}
       virtual ~Base() = default;
   };
   ```

3. **Can abstract classes have final methods?**

   **Java:**
   ```java
   public abstract class Base {
       // Yes, final methods prevent overriding
       public final void criticalOperation() {
           // Implementation that shouldn't be overridden
       }
       
       public abstract void normalOperation();
   }
   ```

   **Python:**
   ```python
   from typing import final

   class Base(ABC):
       # Yes, @final decorator prevents overriding (Python 3.8+)
       @final
       def critical_operation(self):
           # Implementation that shouldn't be overridden
           pass
       
       @abstractmethod
       def normal_operation(self):
           pass
   ```

   **C++:**
   ```cpp
   class Base {
   public:
       // Yes, final keyword prevents overriding
       void criticalOperation() final {
           // Implementation that shouldn't be overridden
       }
       
       virtual void normalOperation() = 0;
       virtual ~Base() = default;
   };
   ```

## 💻 Practice Exercise

Create a game character system using abstract classes:

**Java:**
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

**Python:**
```python
from abc import ABC, abstractmethod

class GameCharacter(ABC):
    def __init__(self, name: str):
        self._name = name
        self._health = 100
        self._level = 1
    
    # Abstract methods
    @abstractmethod
    def attack(self):
        pass
    
    @abstractmethod
    def use_special_ability(self):
        pass
    
    # Concrete methods
    def take_damage(self, damage: int):
        self._health = max(0, self._health - damage)
        if self._health == 0:
            self._die()
    
    def heal(self, amount: int):
        self._health = min(100, self._health + amount)
    
    def _die(self):
        print(f"{self._name} has been defeated!")
    
    def level_up(self):
        self._level += 1
        print(f"{self._name} reached level {self._level}!")

# Warrior implementation
class Warrior(GameCharacter):
    def __init__(self, name: str):
        super().__init__(name)
        self._rage = 0
    
    def attack(self):
        print(f"{self._name} swings their sword!")
        self._rage += 10
    
    def use_special_ability(self):
        if self._rage >= 50:
            print(f"{self._name} uses Berserker Rage!")
            self._rage = 0
        else:
            print("Not enough rage!")

# Mage implementation
class Mage(GameCharacter):
    def __init__(self, name: str):
        super().__init__(name)
        self._mana = 100
    
    def attack(self):
        print(f"{self._name} casts a fireball!")
        self._mana -= 10
    
    def use_special_ability(self):
        if self._mana >= 50:
            print(f"{self._name} casts Arcane Explosion!")
            self._mana -= 50
        else:
            print("Not enough mana!")
```

**C++:**
```cpp
#include <iostream>
#include <string>
#include <algorithm>

class GameCharacter {
protected:
    std::string name;
    int health;
    int level;
    
    void die() {
        std::cout << name << " has been defeated!" << std::endl;
    }

public:
    GameCharacter(const std::string& name) 
        : name(name), health(100), level(1) {}
    
    // Abstract methods
    virtual void attack() = 0;
    virtual void useSpecialAbility() = 0;
    
    // Concrete methods
    void takeDamage(int damage) {
        health = std::max(0, health - damage);
        if (health == 0) {
            die();
        }
    }
    
    void heal(int amount) {
        health = std::min(100, health + amount);
    }
    
    void levelUp() {
        level++;
        std::cout << name << " reached level " << level << "!" << std::endl;
    }
    
    virtual ~GameCharacter() = default;
};

// Warrior implementation
class Warrior : public GameCharacter {
private:
    int rage;

public:
    Warrior(const std::string& name) : GameCharacter(name), rage(0) {}
    
    void attack() override {
        std::cout << name << " swings their sword!" << std::endl;
        rage += 10;
    }
    
    void useSpecialAbility() override {
        if (rage >= 50) {
            std::cout << name << " uses Berserker Rage!" << std::endl;
            rage = 0;
        } else {
            std::cout << "Not enough rage!" << std::endl;
        }
    }
};

// Mage implementation
class Mage : public GameCharacter {
private:
    int mana;

public:
    Mage(const std::string& name) : GameCharacter(name), mana(100) {}
    
    void attack() override {
        std::cout << name << " casts a fireball!" << std::endl;
        mana -= 10;
    }
    
    void useSpecialAbility() override {
        if (mana >= 50) {
            std::cout << name << " casts Arcane Explosion!" << std::endl;
            mana -= 50;
        } else {
            std::cout << "Not enough mana!" << std::endl;
        }
    }
};
```

## ❓ Frequently Asked Questions

### Q1: Can abstract classes have constructors?
**A:** Yes! Even though you can't instantiate them:
- Constructors initialize fields for subclasses
- Called via `super()` from subclass constructors
- Can be used to enforce initialization rules
- Common for setting up shared state

### Q2: Can abstract classes have non-abstract methods?
**A:** Yes! That's a key difference from interfaces:
- Mix of abstract and concrete methods
- Concrete methods provide shared implementation
- Subclasses inherit concrete methods
- Can override concrete methods if needed

### Q3: Can an abstract class implement an interface?
**A:** Yes!
```java
interface Printable { void print(); }

abstract class Document implements Printable {
    // Can leave print() abstract
    // Or provide default implementation
}
```
- Abstract class can partially implement interface
- Subclasses complete the implementation

### Q4: When should I make a method abstract vs concrete?
**A:**
| Make Abstract | Make Concrete |
|--------------|---------------|
| Implementation varies by subclass | Same for all subclasses |
| No sensible default | Useful default exists |
| Force subclasses to implement | Optional to override |
| Template Method hooks | Utility/helper methods |

### Q5: What is the Template Method pattern?
**A:** Uses abstract class to define algorithm skeleton:
```java
abstract class DataProcessor {
    // Template method (final)
    public final void process() {
        readData();      // Concrete
        processData();   // Abstract - subclass defines
        writeData();     // Concrete
    }
    abstract void processData();
}
```
- Algorithm structure is fixed
- Steps are customizable by subclasses

### Q6: Can I have a final method in an abstract class?
**A:** Yes! Used to:
- Prevent subclasses from overriding specific behavior
- Template Method pattern uses final for the template
- Protect invariants in the class hierarchy
- Ensure consistent behavior across subclasses

### Q7: What happens if a subclass doesn't implement all abstract methods?
**A:** The subclass must also be declared abstract:
```java
abstract class Shape { abstract void draw(); }
abstract class Polygon extends Shape { /* draw() still abstract */ }
class Rectangle extends Polygon { void draw() { /* implementation */ } }
```

## 📚 Additional Resources

1. [Oracle Java Documentation on Abstract Classes](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html)
2. [Design Patterns using Abstract Classes](https://refactoring.guru/design-patterns/template-method)
3. [Effective Java - Item 19: Design and document for inheritance or else prohibit it](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997) 