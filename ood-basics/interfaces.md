# 🔌 Interfaces in Object-Oriented Programming

## 📝 Definition
An interface is a contract that specifies what a class must do without dictating how it should do it. It defines a set of abstract methods that implementing classes must provide. Interfaces enable polymorphism and help achieve loose coupling in software design.

## 🎯 Key Concepts

### 1. Interface Declaration
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

### 2. Interface Implementation
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

### 3. Multiple Interface Implementation
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

## 💡 Best Practices

1. **Keep Interfaces Small and Focused**
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

2. **Use Default Methods Judiciously**
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

3. **Program to Interfaces**
   ```java
   // Good - programming to interface
   List<String> list = new ArrayList<>();
   Map<String, Integer> map = new HashMap<>();
   
   // Not as flexible
   ArrayList<String> list = new ArrayList<>();
   HashMap<String, Integer> map = new HashMap<>();
   ```

## ⚠️ Common Pitfalls

1. **Interface Pollution**
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

2. **Breaking Interface Segregation**
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

3. **Not Using Functional Interfaces**
   ```java
   // Bad - custom interface for simple function
   interface Transformer {
       String transform(String input);
   }
   
   // Good - use built-in functional interface
   Function<String, String> transformer = input -> input.toUpperCase();
   ```

## 🎯 Interview Questions

1. **What are the differences between interfaces and abstract classes?**
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

2. **How do you handle multiple inheritance with interfaces?**
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

3. **What are functional interfaces and when to use them?**
   ```java
   // Functional interface - only one abstract method
   @FunctionalInterface
   interface Validator {
       boolean validate(String input);
   }
   
   // Usage with lambda
   Validator emailValidator = email -> email.contains("@");
   ```

## 💻 Practice Exercise

Create a media player system using interfaces:

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

## 📚 Additional Resources

1. [Oracle Java Documentation on Interfaces](https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html)
2. [Effective Java - Item 20: Prefer interfaces to abstract classes](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Clean Code - Chapter 12: Emergence](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 