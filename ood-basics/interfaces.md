# 🔌 Interfaces in Object-Oriented Programming

## 📝 Definition
An interface is a contract that specifies what a class must do without dictating how it should do it. It defines a set of abstract methods that implementing classes must provide. Interfaces enable polymorphism and help achieve loose coupling in software design.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Interfaces, you should understand:
- [Classes & Objects](classes-and-objects.md) - Class structure
- [Polymorphism](polymorphism.md) - Method overriding
- [Abstraction](abstraction.md) - Hiding implementation details
- [Abstract Classes](abstract-classes.md) - Partial implementations

### Learning Path
After mastering Interfaces, continue with:
1. **Next:** [Relationships](relationships.md) - Association, Aggregation, Composition
2. **Then:** [Interface Segregation Principle](../solid-principles/isp.md) - Design focused interfaces
3. **Then:** [Dependency Inversion Principle](../solid-principles/dip.md) - Depend on interfaces
4. **Patterns:** [Strategy Pattern](../design-patterns/behavioral/README.md) - Interfaces in action

### How This Fits in the Big Picture
```
Abstract Classes ←→ Interfaces → SOLID Principles → Design Patterns
                        ↓
           Enable loose coupling and testability
           Foundation for Dependency Injection
```

## 🎯 Key Concepts

### 1. Interface Declaration

**Java:**
```java
public interface Drawable {
    void draw();  // Abstract method
    
    // Default method (Java 8+)
    default void clear() {
        System.out.println("Default clearing behavior");
    }
    
    // Static method (Java 8+)
    static boolean isDrawable(Object obj) {
        return obj instanceof Drawable;
    }
}
```

**Python:**
```python
from abc import ABC, abstractmethod

class Drawable(ABC):
    @abstractmethod
    def draw(self):  # Abstract method
        pass
    
    # Default method
    def clear(self):
        print("Default clearing behavior")
    
    # Static method
    @staticmethod
    def is_drawable(obj) -> bool:
        return isinstance(obj, Drawable)
```

**C++:**
```cpp
#include <iostream>

class Drawable {
public:
    virtual void draw() = 0;  // Abstract method (pure virtual)
    
    // Default method
    virtual void clear() {
        std::cout << "Default clearing behavior" << std::endl;
    }
    
    // Static method
    static bool isDrawable(void* obj) {
        return dynamic_cast<Drawable*>(static_cast<Drawable*>(obj)) != nullptr;
    }
    
    virtual ~Drawable() = default;
};
```

### 2. Interface Implementation

**Java:**
```java
public class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

public class Rectangle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
}
```

**Python:**
```python
class Circle(Drawable):
    def draw(self):
        print("Drawing a circle")

class Rectangle(Drawable):
    def draw(self):
        print("Drawing a rectangle")
```

**C++:**
```cpp
class Circle : public Drawable {
public:
    void draw() override {
        std::cout << "Drawing a circle" << std::endl;
    }
};

class Rectangle : public Drawable {
public:
    void draw() override {
        std::cout << "Drawing a rectangle" << std::endl;
    }
};
```

### 3. Multiple Interface Implementation

**Java:**
```java
public interface Movable {
    void move(int x, int y);
}

public interface Resizable {
    void resize(int width, int height);
}

public class GameSprite implements Drawable, Movable, Resizable {
    @Override
    public void draw() { }
    
    @Override
    public void move(int x, int y) { }
    
    @Override
    public void resize(int width, int height) { }
}
```

**Python:**
```python
from abc import ABC, abstractmethod

class Movable(ABC):
    @abstractmethod
    def move(self, x: int, y: int):
        pass

class Resizable(ABC):
    @abstractmethod
    def resize(self, width: int, height: int):
        pass

class GameSprite(Drawable, Movable, Resizable):
    def draw(self):
        pass
    
    def move(self, x: int, y: int):
        pass
    
    def resize(self, width: int, height: int):
        pass
```

**C++:**
```cpp
class Movable {
public:
    virtual void move(int x, int y) = 0;
    virtual ~Movable() = default;
};

class Resizable {
public:
    virtual void resize(int width, int height) = 0;
    virtual ~Resizable() = default;
};

class GameSprite : public Drawable, public Movable, public Resizable {
public:
    void draw() override { }
    void move(int x, int y) override { }
    void resize(int width, int height) override { }
};
```

## 💡 Best Practices

1. **Keep Interfaces Small and Focused**

   **Java:**
   ```java
   // Bad - too many responsibilities
   interface Employee {
       void work();
       void eat();
       void sleep();
       void calculateSalary();
   }
   
   // Good - separated interfaces
   interface Worker {
       void work();
   }
   
   interface PayrollCalculator {
       void calculateSalary();
   }
   ```

   **Python:**
   ```python
   # Bad - too many responsibilities
   class Employee(ABC):
       @abstractmethod
       def work(self): pass
       @abstractmethod
       def eat(self): pass
       @abstractmethod
       def sleep(self): pass
       @abstractmethod
       def calculate_salary(self): pass
   
   # Good - separated interfaces
   class Worker(ABC):
       @abstractmethod
       def work(self): pass
   
   class PayrollCalculator(ABC):
       @abstractmethod
       def calculate_salary(self): pass
   ```

   **C++:**
   ```cpp
   // Bad - too many responsibilities
   class Employee {
   public:
       virtual void work() = 0;
       virtual void eat() = 0;
       virtual void sleep() = 0;
       virtual void calculateSalary() = 0;
       virtual ~Employee() = default;
   };
   
   // Good - separated interfaces
   class Worker {
   public:
       virtual void work() = 0;
       virtual ~Worker() = default;
   };
   
   class PayrollCalculator {
   public:
       virtual void calculateSalary() = 0;
       virtual ~PayrollCalculator() = default;
   };
   ```

2. **Use Default Methods Judiciously**

   **Java:**
   ```java
   public interface Logger {
       void log(String message);
       
       // Default method providing common functionality
       default void logError(String error) {
           log("ERROR: " + error);
       }
       
       default void logWarning(String warning) {
           log("WARNING: " + warning);
       }
   }
   ```

   **Python:**
   ```python
   class Logger(ABC):
       @abstractmethod
       def log(self, message: str):
           pass
       
       # Default method providing common functionality
       def log_error(self, error: str):
           self.log(f"ERROR: {error}")
       
       def log_warning(self, warning: str):
           self.log(f"WARNING: {warning}")
   ```

   **C++:**
   ```cpp
   class Logger {
   public:
       virtual void log(const std::string& message) = 0;
       
       // Default method providing common functionality
       virtual void logError(const std::string& error) {
           log("ERROR: " + error);
       }
       
       virtual void logWarning(const std::string& warning) {
           log("WARNING: " + warning);
       }
       
       virtual ~Logger() = default;
   };
   ```

3. **Program to Interfaces**

   **Java:**
   ```java
   // Good - programming to interface
   List<String> list = new ArrayList<>();
   Map<String, Integer> map = new HashMap<>();
   
   // Not as flexible
   ArrayList<String> list = new ArrayList<>();
   HashMap<String, Integer> map = new HashMap<>();
   ```

   **Python:**
   ```python
   from typing import List, Dict
   from collections.abc import Mapping, Sequence

   # Good - programming to interface (type hints)
   def process_items(items: Sequence[str]) -> None:
       pass
   
   def process_data(data: Mapping[str, int]) -> None:
       pass
   
   # Not as flexible (concrete types)
   def process_items(items: list) -> None:
       pass
   ```

   **C++:**
   ```cpp
   #include <vector>
   #include <map>
   #include <memory>

   // Good - programming to interface (using pointers/references)
   std::unique_ptr<Container<std::string>> container;
   
   // Not as flexible (concrete types)
   std::vector<std::string> list;
   std::map<std::string, int> map;
   ```

## ⚠️ Common Pitfalls

1. **Interface Pollution**

   **Java:**
   ```java
   // Bad - forcing unnecessary methods
   interface Vehicle {
       void drive();
       void fly();  // Not all vehicles can fly
       void swim();  // Not all vehicles can swim
   }
   
   // Good - separate interfaces
   interface Driveable {
       void drive();
   }
   
   interface Flyable {
       void fly();
   }
   ```

   **Python:**
   ```python
   # Bad - forcing unnecessary methods
   class Vehicle(ABC):
       @abstractmethod
       def drive(self): pass
       @abstractmethod
       def fly(self): pass  # Not all vehicles can fly
       @abstractmethod
       def swim(self): pass  # Not all vehicles can swim
   
   # Good - separate interfaces
   class Driveable(ABC):
       @abstractmethod
       def drive(self): pass
   
   class Flyable(ABC):
       @abstractmethod
       def fly(self): pass
   ```

   **C++:**
   ```cpp
   // Bad - forcing unnecessary methods
   class Vehicle {
   public:
       virtual void drive() = 0;
       virtual void fly() = 0;   // Not all vehicles can fly
       virtual void swim() = 0;  // Not all vehicles can swim
       virtual ~Vehicle() = default;
   };
   
   // Good - separate interfaces
   class Driveable {
   public:
       virtual void drive() = 0;
       virtual ~Driveable() = default;
   };
   
   class Flyable {
   public:
       virtual void fly() = 0;
       virtual ~Flyable() = default;
   };
   ```

2. **Breaking Interface Segregation**

   **Java:**
   ```java
   // Bad - clients forced to implement unnecessary methods
   interface Printer {
       void print();
       void scan();
       void fax();
       void copy();
   }
   
   // Good - segregated interfaces
   interface Printer {
       void print();
   }
   
   interface Scanner {
       void scan();
   }
   ```

   **Python:**
   ```python
   # Bad - clients forced to implement unnecessary methods
   class Printer(ABC):
       @abstractmethod
       def print(self): pass
       @abstractmethod
       def scan(self): pass
       @abstractmethod
       def fax(self): pass
       @abstractmethod
       def copy(self): pass
   
   # Good - segregated interfaces
   class Printer(ABC):
       @abstractmethod
       def print(self): pass
   
   class Scanner(ABC):
       @abstractmethod
       def scan(self): pass
   ```

   **C++:**
   ```cpp
   // Bad - clients forced to implement unnecessary methods
   class Printer {
   public:
       virtual void print() = 0;
       virtual void scan() = 0;
       virtual void fax() = 0;
       virtual void copy() = 0;
       virtual ~Printer() = default;
   };
   
   // Good - segregated interfaces
   class Printer {
   public:
       virtual void print() = 0;
       virtual ~Printer() = default;
   };
   
   class Scanner {
   public:
       virtual void scan() = 0;
       virtual ~Scanner() = default;
   };
   ```

3. **Not Using Functional Interfaces**

   **Java:**
   ```java
   // Bad - custom interface for simple function
   interface Transformer {
       String transform(String input);
   }
   
   // Good - use built-in functional interface
   Function<String, String> transformer = input -> input.toUpperCase();
   ```

   **Python:**
   ```python
   from typing import Callable

   # Bad - custom class for simple function
   class Transformer(ABC):
       @abstractmethod
       def transform(self, input: str) -> str:
           pass
   
   # Good - use callable type hint
   transformer: Callable[[str], str] = lambda x: x.upper()
   ```

   **C++:**
   ```cpp
   #include <functional>
   #include <string>

   // Bad - custom interface for simple function
   class Transformer {
   public:
       virtual std::string transform(const std::string& input) = 0;
       virtual ~Transformer() = default;
   };
   
   // Good - use std::function
   std::function<std::string(const std::string&)> transformer = 
       [](const std::string& input) { 
           std::string result = input;
           std::transform(result.begin(), result.end(), result.begin(), ::toupper);
           return result;
       };
   ```

## 🎯 Interview Questions

1. **What are the differences between interfaces and abstract classes?**

   **Java:**
   ```java
   // Interface
   interface Shape {
       double getArea();  // Implicitly public abstract
       
       default void print() {  // Can have default methods
           System.out.println("Shape");
       }
   }
   
   // Abstract class
   abstract class Shape {
       protected String color;  // Can have fields
       
       public Shape(String color) {  // Can have constructor
           this.color = color;
       }
       
       abstract double getArea();  // Abstract method
   }
   ```

   **Python:**
   ```python
   from abc import ABC, abstractmethod

   # Interface-like (only abstract methods)
   class ShapeInterface(ABC):
       @abstractmethod
       def get_area(self) -> float:  # Abstract method
           pass
       
       def print_shape(self):  # Can have default methods
           print("Shape")
   
   # Abstract class
   class Shape(ABC):
       def __init__(self, color: str):  # Can have constructor
           self._color = color  # Can have fields
       
       @abstractmethod
       def get_area(self) -> float:  # Abstract method
           pass
   ```

   **C++:**
   ```cpp
   // Interface (pure abstract class)
   class ShapeInterface {
   public:
       virtual double getArea() = 0;  // Pure virtual
       
       virtual void print() {  // Can have default methods
           std::cout << "Shape" << std::endl;
       }
       
       virtual ~ShapeInterface() = default;
   };
   
   // Abstract class
   class Shape {
   protected:
       std::string color;  // Can have fields
       
   public:
       Shape(const std::string& color) : color(color) {}  // Can have constructor
       
       virtual double getArea() = 0;  // Abstract method
       virtual ~Shape() = default;
   };
   ```

2. **How do you handle multiple inheritance with interfaces?**

   **Java:**
   ```java
   interface A {
       default void method() {
           System.out.println("A");
       }
   }
   
   interface B {
       default void method() {
           System.out.println("B");
       }
   }
   
   class C implements A, B {
       @Override
       public void method() {
           A.super.method();  // Choose which default to use
       }
   }
   ```

   **Python:**
   ```python
   class A(ABC):
       def method(self):
           print("A")
   
   class B(ABC):
       def method(self):
           print("B")
   
   class C(A, B):  # Multiple inheritance
       def method(self):
           A.method(self)  # Choose which to use (or use super() for MRO)
   ```

   **C++:**
   ```cpp
   class A {
   public:
       virtual void method() {
           std::cout << "A" << std::endl;
       }
       virtual ~A() = default;
   };
   
   class B {
   public:
       virtual void method() {
           std::cout << "B" << std::endl;
       }
       virtual ~B() = default;
   };
   
   class C : public A, public B {
   public:
       void method() override {
           A::method();  // Choose which to use
       }
   };
   ```

3. **What are functional interfaces and when to use them?**

   **Java:**
   ```java
   // Functional interface - only one abstract method
   @FunctionalInterface
   interface Validator {
       boolean validate(String input);
   }
   
   // Usage with lambda
   Validator emailValidator = email -> email.contains("@");
   ```

   **Python:**
   ```python
   from typing import Callable

   # Protocol (structural typing) - similar to functional interface
   from typing import Protocol

   class Validator(Protocol):
       def __call__(self, input: str) -> bool: ...
   
   # Usage with lambda
   email_validator: Callable[[str], bool] = lambda email: "@" in email
   ```

   **C++:**
   ```cpp
   #include <functional>
   #include <string>

   // Functional interface using std::function
   using Validator = std::function<bool(const std::string&)>;
   
   // Usage with lambda
   Validator emailValidator = [](const std::string& email) {
       return email.find('@') != std::string::npos;
   };
   ```

## 💻 Practice Exercise

Create a media player system using interfaces:

**Java:**
```java
// Media interfaces
interface Playable {
    void play();
    void pause();
    void stop();
}

interface VolumeControl {
    void setVolume(int level);
    int getVolume();
}

interface MediaInfo {
    String getTitle();
    String getArtist();
    int getDuration();
}

// Concrete implementations
class AudioPlayer implements Playable, VolumeControl, MediaInfo {
    private String title;
    private String artist;
    private int duration;
    private int volume;
    private boolean isPlaying;
    
    public AudioPlayer(String title, String artist, int duration) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.volume = 50;  // Default volume
    }
    
    @Override
    public void play() {
        isPlaying = true;
        System.out.println("Playing audio: " + title);
    }
    
    @Override
    public void pause() {
        isPlaying = false;
        System.out.println("Audio paused");
    }
    
    @Override
    public void stop() {
        isPlaying = false;
        System.out.println("Audio stopped");
    }
    
    @Override
    public void setVolume(int level) {
        if (level >= 0 && level <= 100) {
            this.volume = level;
            System.out.println("Volume set to: " + level);
        }
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public String getTitle() {
        return title;
    }
    
    @Override
    public String getArtist() {
        return artist;
    }
    
    @Override
    public int getDuration() {
        return duration;
    }
}

// Media player manager
class MediaPlayer {
    private List<Playable> playlist;
    
    public MediaPlayer() {
        this.playlist = new ArrayList<>();
    }
    
    public void addMedia(Playable media) {
        playlist.add(media);
    }
    
    public void playAll() {
        playlist.forEach(Playable::play);
    }
    
    public void stopAll() {
        playlist.forEach(Playable::stop);
    }
}
```

**Python:**
```python
from abc import ABC, abstractmethod
from typing import List

# Media interfaces
class Playable(ABC):
    @abstractmethod
    def play(self): pass
    
    @abstractmethod
    def pause(self): pass
    
    @abstractmethod
    def stop(self): pass

class VolumeControl(ABC):
    @abstractmethod
    def set_volume(self, level: int): pass
    
    @abstractmethod
    def get_volume(self) -> int: pass

class MediaInfo(ABC):
    @abstractmethod
    def get_title(self) -> str: pass
    
    @abstractmethod
    def get_artist(self) -> str: pass
    
    @abstractmethod
    def get_duration(self) -> int: pass

# Concrete implementations
class AudioPlayer(Playable, VolumeControl, MediaInfo):
    def __init__(self, title: str, artist: str, duration: int):
        self._title = title
        self._artist = artist
        self._duration = duration
        self._volume = 50  # Default volume
        self._is_playing = False
    
    def play(self):
        self._is_playing = True
        print(f"Playing audio: {self._title}")
    
    def pause(self):
        self._is_playing = False
        print("Audio paused")
    
    def stop(self):
        self._is_playing = False
        print("Audio stopped")
    
    def set_volume(self, level: int):
        if 0 <= level <= 100:
            self._volume = level
            print(f"Volume set to: {level}")
    
    def get_volume(self) -> int:
        return self._volume
    
    def get_title(self) -> str:
        return self._title
    
    def get_artist(self) -> str:
        return self._artist
    
    def get_duration(self) -> int:
        return self._duration

# Media player manager
class MediaPlayer:
    def __init__(self):
        self._playlist: List[Playable] = []
    
    def add_media(self, media: Playable):
        self._playlist.append(media)
    
    def play_all(self):
        for media in self._playlist:
            media.play()
    
    def stop_all(self):
        for media in self._playlist:
            media.stop()
```

**C++:**
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>

// Media interfaces
class Playable {
public:
    virtual void play() = 0;
    virtual void pause() = 0;
    virtual void stop() = 0;
    virtual ~Playable() = default;
};

class VolumeControl {
public:
    virtual void setVolume(int level) = 0;
    virtual int getVolume() const = 0;
    virtual ~VolumeControl() = default;
};

class MediaInfo {
public:
    virtual std::string getTitle() const = 0;
    virtual std::string getArtist() const = 0;
    virtual int getDuration() const = 0;
    virtual ~MediaInfo() = default;
};

// Concrete implementations
class AudioPlayer : public Playable, public VolumeControl, public MediaInfo {
private:
    std::string title;
    std::string artist;
    int duration;
    int volume;
    bool isPlaying;

public:
    AudioPlayer(const std::string& title, const std::string& artist, int duration)
        : title(title), artist(artist), duration(duration), volume(50), isPlaying(false) {}
    
    void play() override {
        isPlaying = true;
        std::cout << "Playing audio: " << title << std::endl;
    }
    
    void pause() override {
        isPlaying = false;
        std::cout << "Audio paused" << std::endl;
    }
    
    void stop() override {
        isPlaying = false;
        std::cout << "Audio stopped" << std::endl;
    }
    
    void setVolume(int level) override {
        if (level >= 0 && level <= 100) {
            volume = level;
            std::cout << "Volume set to: " << level << std::endl;
        }
    }
    
    int getVolume() const override { return volume; }
    std::string getTitle() const override { return title; }
    std::string getArtist() const override { return artist; }
    int getDuration() const override { return duration; }
};

// Media player manager
class MediaPlayer {
private:
    std::vector<std::shared_ptr<Playable>> playlist;

public:
    void addMedia(std::shared_ptr<Playable> media) {
        playlist.push_back(media);
    }
    
    void playAll() {
        for (auto& media : playlist) {
            media->play();
        }
    }
    
    void stopAll() {
        for (auto& media : playlist) {
            media->stop();
        }
    }
};
```

## ❓ Frequently Asked Questions

### Q1: Can interfaces have method implementations?
**A:** Depends on the language:
| Language | Implementation Support |
|----------|----------------------|
| Java 8+ | Default methods, static methods |
| C# 8+ | Default implementations |
| C++ | No (use abstract class) |
| Python | Yes (ABC can have methods) |

### Q2: What are marker interfaces?
**A:** Interfaces with no methods (e.g., `Serializable`, `Cloneable`):
- Signal capability to the runtime
- Used for type checking
- Modern alternative: annotations/attributes
- Example: `if (obj instanceof Serializable)`

### Q3: What are functional interfaces?
**A:** Interfaces with exactly one abstract method:
- Can be used with lambda expressions
- Annotated with `@FunctionalInterface` (Java)
- Examples: `Runnable`, `Comparator`, `Consumer`
- Enable functional programming style

### Q4: Can an interface extend another interface?
**A:** Yes!
```java
interface Readable { void read(); }
interface Writable { void write(); }
interface ReadWritable extends Readable, Writable { }
```
- Creates interface inheritance hierarchy
- Multiple interface inheritance is allowed
- Implementing class must provide all methods

### Q5: What's the difference between interface and type?
**A:**
- **Interface:** Contract defining what methods must exist
- **Type:** Classification of values (includes interfaces, classes, primitives)
- All interfaces are types, but not all types are interfaces
- In static languages, interfaces enable polymorphism across unrelated types

### Q6: Should I create an interface for every class?
**A:** No! Create interfaces when:
- ✅ Multiple implementations exist or are planned
- ✅ You need to mock for testing
- ✅ You want to hide implementation details
- ❌ Single implementation with no planned variations
- ❌ Simple utility classes
- ❌ Data transfer objects (DTOs)

### Q7: What is interface pollution?
**A:** Having too many methods in an interface:
- Violates Interface Segregation Principle (ISP)
- Implementers must provide unwanted methods
- Solution: Split into smaller, focused interfaces
- Each interface should have a single purpose

## 📚 Additional Resources

1. [Oracle Java Documentation on Interfaces](https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html)
2. [Effective Java - Item 20: Prefer interfaces to abstract classes](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Clean Code - Chapter 12: Emergence](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 