# 🔌 Interface Segregation Principle (ISP)

## 📝 Definition
The Interface Segregation Principle states that clients should not be forced to depend on interfaces they don't use. In other words, it's better to have many smaller, specific interfaces rather than a few large, general ones.

## 🎯 Key Concepts

### 1. Interface Pollution
- Large interfaces lead to tight coupling
- Classes implement methods they don't need
```java
// Bad - Fat interface
public interface Worker {
    void work();
    void eat();
    void sleep();
    void calculateSalary();
    void reportHours();
    void takeBreak();
    void requestVacation();
    void attendMeeting();
}

// Good - Segregated interfaces
public interface Workable {
    void work();
    void takeBreak();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public interface Payable {
    void calculateSalary();
    void reportHours();
}

public interface Employee extends Workable, Payable {
    void requestVacation();
    void attendMeeting();
}
```

### 2. Role Interfaces
- Interfaces should represent roles or capabilities
- Classes can implement multiple role interfaces
```java
public interface Printer {
    void print(Document document);
}

public interface Scanner {
    void scan(Document document);
}

public interface Faxer {
    void fax(Document document);
}

// Simple printer only implements what it can do
public class SimplePrinter implements Printer {
    @Override
    public void print(Document document) {
        // Print implementation
    }
}

// Multi-function device implements multiple interfaces
public class MultiFunction implements Printer, Scanner, Faxer {
    @Override
    public void print(Document document) {
        // Print implementation
    }
    
    @Override
    public void scan(Document document) {
        // Scan implementation
    }
    
    @Override
    public void fax(Document document) {
        // Fax implementation
    }
}
```

## 💡 Best Practices

1. **Keep Interfaces Focused**
   ```java
   // Bad - Mixed responsibilities
   public interface ShoppingCart {
       void addItem(Item item);
       void removeItem(Item item);
       void processPayment();
       void generateInvoice();
       void sendConfirmationEmail();
   }
   
   // Good - Separated interfaces
   public interface Cart {
       void addItem(Item item);
       void removeItem(Item item);
   }
   
   public interface PaymentProcessor {
       void processPayment();
   }
   
   public interface InvoiceGenerator {
       void generateInvoice();
   }
   
   public interface EmailService {
       void sendConfirmationEmail();
   }
   ```

2. **Use Composition**
   ```java
   public class OnlineOrder {
       private Cart cart;
       private PaymentProcessor paymentProcessor;
       private InvoiceGenerator invoiceGenerator;
       private EmailService emailService;
       
       public void checkout() {
           paymentProcessor.processPayment();
           invoiceGenerator.generateInvoice();
           emailService.sendConfirmationEmail();
       }
   }
   ```

3. **Interface Inheritance**
   ```java
   public interface Repository<T> {
       T findById(Long id);
       void save(T entity);
   }
   
   public interface UserRepository extends Repository<User> {
       User findByEmail(String email);
   }
   
   public interface OrderRepository extends Repository<Order> {
       List<Order> findByUser(User user);
   }
   ```

## ⚠️ Common Pitfalls

1. **God Interfaces**
   ```java
   // Bad - God interface
   public interface SuperService {
       void processOrder();
       void generateReport();
       void sendEmail();
       void calculateTax();
       void updateInventory();
       void handleShipping();
       void processRefund();
   }
   ```

2. **Forcing Implementation**
   ```java
   // Bad - Forces implementation of unused methods
   public interface Animal {
       void fly();
       void swim();
       void run();
   }
   
   public class Fish implements Animal {
       public void swim() { }
       public void fly() { /* Can't fly */ }
       public void run() { /* Can't run */ }
   }
   ```

3. **Interface Bloat**
   ```java
   // Bad - Interface bloat
   public interface UserService {
       User findUser(Long id);
       void saveUser(User user);
       void sendEmail(String to, String subject);
       void generateReport();
       void processPayment(Payment payment);
   }
   ```

## 🎯 Interview Questions

1. **How do you identify violations of ISP?**
   - Classes implementing methods they don't use
   - Large interfaces with unrelated methods
   - Methods throwing UnsupportedOperationException
   - High coupling between classes

2. **Refactor this code to follow ISP:**
   ```java
   // Before
   public interface Machine {
       void print(Document d);
       void scan(Document d);
       void fax(Document d);
       void photocopy(Document d);
   }
   
   // After
   public interface Printer {
       void print(Document d);
   }
   
   public interface Scanner {
       void scan(Document d);
   }
   
   public interface Fax {
       void fax(Document d);
   }
   
   public interface Photocopier extends Printer, Scanner {
       void photocopy(Document d);
   }
   
   // Implementations
   public class SimplePrinter implements Printer {
       public void print(Document d) { }
   }
   
   public class AllInOnePrinter implements Printer, Scanner, Fax {
       public void print(Document d) { }
       public void scan(Document d) { }
       public void fax(Document d) { }
   }
   ```

3. **What are the benefits of following ISP?**
   - Reduced coupling
   - Better maintainability
   - More flexible code
   - Easier testing
   - Clear dependencies

## 💻 Practice Exercise

Create a media player system following ISP:

```java
// Media player interfaces
public interface Playable {
    void play();
    void pause();
    void stop();
}

public interface VolumeControl {
    void setVolume(int volume);
    int getVolume();
}

public interface Seekable {
    void seek(int position);
    int getCurrentPosition();
}

public interface PlaylistControl {
    void next();
    void previous();
    void shuffle();
}

// Basic audio player
public class AudioPlayer implements Playable, VolumeControl {
    private boolean isPlaying;
    private int volume;
    
    @Override
    public void play() {
        isPlaying = true;
        System.out.println("Playing audio");
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
    public void setVolume(int volume) {
        this.volume = Math.min(100, Math.max(0, volume));
        System.out.println("Volume set to: " + this.volume);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
}

// Advanced media player
public class AdvancedMediaPlayer implements Playable, VolumeControl, Seekable, PlaylistControl {
    private boolean isPlaying;
    private int volume;
    private int position;
    
    @Override
    public void play() {
        isPlaying = true;
        System.out.println("Playing media");
    }
    
    @Override
    public void pause() {
        isPlaying = false;
        System.out.println("Media paused");
    }
    
    @Override
    public void stop() {
        isPlaying = false;
        position = 0;
        System.out.println("Media stopped");
    }
    
    @Override
    public void setVolume(int volume) {
        this.volume = Math.min(100, Math.max(0, volume));
        System.out.println("Volume set to: " + this.volume);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public void seek(int position) {
        this.position = position;
        System.out.println("Seeked to position: " + position);
    }
    
    @Override
    public int getCurrentPosition() {
        return position;
    }
    
    @Override
    public void next() {
        System.out.println("Playing next track");
    }
    
    @Override
    public void previous() {
        System.out.println("Playing previous track");
    }
    
    @Override
    public void shuffle() {
        System.out.println("Shuffling playlist");
    }
}

// Usage example
public class Main {
    public static void main(String[] args) {
        // Basic audio player
        AudioPlayer audioPlayer = new AudioPlayer();
        audioPlayer.play();
        audioPlayer.setVolume(75);
        audioPlayer.pause();
        
        // Advanced media player
        AdvancedMediaPlayer advancedPlayer = new AdvancedMediaPlayer();
        advancedPlayer.play();
        advancedPlayer.setVolume(80);
        advancedPlayer.seek(120);
        advancedPlayer.next();
        advancedPlayer.shuffle();
        advancedPlayer.stop();
    }
}
```

## 📚 Additional Resources

1. [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
2. [Design Patterns and Interface Segregation](https://www.pluralsight.com/courses/design-patterns-interface-segregation)
3. [SOLID Principles in Java](https://www.baeldung.com/solid-principles) 