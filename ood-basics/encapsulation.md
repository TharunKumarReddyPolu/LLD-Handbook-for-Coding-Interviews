# 🔒 Encapsulation in Object-Oriented Programming

## 📝 Definition
Encapsulation is the bundling of data and the methods that operate on that data within a single unit or object, keeping the internal workings hidden from the outside world. It's one of the fundamental principles of OOP that helps achieve data hiding and abstraction.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Encapsulation, you should understand:
- [Classes & Objects](classes-and-objects.md) - Class structure, fields, and methods
- Basic understanding of access levels (public vs private concept)

### Learning Path
After mastering Encapsulation, continue with:
1. **Next:** [Inheritance](inheritance.md) - How encapsulation works with inheritance
2. **Then:** [Abstraction](abstraction.md) - Higher level of hiding complexity
3. **Related:** [Single Responsibility Principle](../solid-principles/srp.md) - Focused encapsulated classes
4. **Best Practices:** [Clean Code](../best-practices/clean-code.md) - Encapsulation in practice

### How This Fits in the Big Picture
```
Classes & Objects → Encapsulation → Inheritance → Polymorphism
                         ↓
          Protects data integrity and hides implementation
          Foundation for maintainable, secure code
```

## 🎯 Key Concepts

### 1. Data Hiding
- Restricting direct access to class members
- Using access modifiers (private, protected, public)

#### Java
```java
public class BankAccount {
    private double balance;  // Data hiding
    private String accountNumber;
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}
```

#### Python
```python
class BankAccount:
    def __init__(self):
        self._balance = 0.0  # Protected (convention)
        self.__account_number = ""  # Private (name mangling)
    
    def deposit(self, amount: float) -> None:
        if amount > 0:
            self._balance += amount
    
    def get_balance(self) -> float:
        return self._balance
```

#### C++
```cpp
class BankAccount {
private:
    double balance = 0.0;  // Data hiding
    std::string accountNumber;

public:
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    double getBalance() const {
        return balance;
    }
};
```

### 2. Access Modifiers
1. **Private**
   - Accessible only within the class
   ```java
   public class Employee {
       private int salary;  // Only accessible within Employee class
   }
   ```

2. **Protected**
   - Accessible within package and by subclasses
   ```java
   public class Person {
       protected String name;  // Accessible by subclasses
   }
   ```

3. **Public**
   - Accessible from anywhere
   ```java
   public class Calculator {
       public double add(double a, double b) {  // Accessible by any class
           return a + b;
       }
   }
   ```

4. **Package-Private (Default)**
   - Accessible only within the same package
   ```java
   class Helper {  // Package-private class
       void helperMethod() { }  // Package-private method
   }
   ```

## 💡 Best Practices

1. **Use Private Fields with Getters/Setters**
   ```java
   public class User {
       private String username;
       private String password;
       
       public String getUsername() {
           return username;
       }
       
       public void setUsername(String username) {
           if (username != null && !username.isEmpty()) {
               this.username = username;
           }
       }
   }
   ```

2. **Validate Data in Setters**
   ```java
   public class Product {
       private double price;
       
       public void setPrice(double price) {
           if (price >= 0) {
               this.price = price;
           } else {
               throw new IllegalArgumentException("Price cannot be negative");
           }
       }
   }
   ```

3. **Immutable Classes**
   ```java
   public final class ImmutablePoint {
       private final int x;
       private final int y;
       
       public ImmutablePoint(int x, int y) {
           this.x = x;
           this.y = y;
       }
       
       public int getX() { return x; }
       public int getY() { return y; }
   }
   ```

## ⚠️ Common Pitfalls

1. **Public Fields**
   ```java
   // Bad practice
   public class BadExample {
       public int data;  // No encapsulation
   }
   
   // Good practice
   public class GoodExample {
       private int data;
       public int getData() { return data; }
       public void setData(int value) { this.data = value; }
   }
   ```

2. **Exposing Mutable Objects**
   ```java
   public class Student {
       private List<Integer> grades;
       
       // Bad - exposes internal list
       public List<Integer> getGrades() {
           return grades;
       }
       
       // Good - returns copy
       public List<Integer> getGrades() {
           return new ArrayList<>(grades);
       }
   }
   ```

3. **Getter/Setter for Everything**
   ```java
   // Unnecessary getters/setters
   public class OverEncapsulated {
       private int internalCounter;
       
       // Unnecessary if this is truly internal
       public int getInternalCounter() {
           return internalCounter;
       }
   }
   ```

## 🎯 Interview Questions

1. **Why is encapsulation important?**
   - Data hiding
   - Control over data access
   - Flexibility to change implementation
   - Maintainability

2. **What's the difference between encapsulation and abstraction?**
   ```java
   // Encapsulation - hiding implementation details
   public class BankAccount {
       private double balance;
       public void deposit(double amount) { /* implementation */ }
   }
   
   // Abstraction - hiding complexity
   public interface PaymentProcessor {
       void processPayment(double amount);
   }
   ```

3. **How do you create an immutable class?**
   ```java
   public final class ImmutablePerson {
       private final String name;
       private final int age;
       
       public ImmutablePerson(String name, int age) {
           this.name = name;
           this.age = age;
       }
       
       public String getName() { return name; }
       public int getAge() { return age; }
   }
   ```

## 💻 Practice Exercise

Create a library management system demonstrating encapsulation:

```java
public class Book {
    private String isbn;
    private String title;
    private String author;
    private boolean isAvailable;
    
    public Book(String isbn, String title, String author) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }
    
    public String getTitle() {
        return title;
    }
    
    public boolean isAvailable() {
        return isAvailable;
    }
    
    public void borrowBook() {
        if (isAvailable) {
            isAvailable = false;
        } else {
            throw new IllegalStateException("Book is not available");
        }
    }
    
    public void returnBook() {
        isAvailable = true;
    }
}

public class Library {
    private List<Book> books;
    
    public Library() {
        this.books = new ArrayList<>();
    }
    
    public void addBook(String isbn, String title, String author) {
        books.add(new Book(isbn, title, author));
    }
    
    public List<Book> getAvailableBooks() {
        return books.stream()
                   .filter(Book::isAvailable)
                   .collect(Collectors.toList());
    }
    
    public void borrowBook(String title) {
        books.stream()
             .filter(book -> book.getTitle().equals(title))
             .findFirst()
             .ifPresent(Book::borrowBook);
    }
}
```

## ❓ Frequently Asked Questions

### Q1: What's the difference between encapsulation and abstraction?
**A:**
| Encapsulation | Abstraction |
|---------------|-------------|
| Hides *data* | Hides *complexity* |
| Uses access modifiers | Uses interfaces/abstract classes |
| "How it's stored" | "What it does" |
| Implementation detail | External behavior |
| Bundling data + methods | Exposing only essential features |

### Q2: Should I always use getters and setters?
**A:** Not necessarily:
- ✅ Use for external access to private fields
- ✅ Use when validation is needed
- ❌ Avoid for internal class use
- ❌ Avoid if they expose mutable internal state
- Consider: Does exposing this data break encapsulation?

### Q3: What are the access modifiers in order of restrictiveness?
**A:**
| Modifier | Same Class | Same Package | Subclass | World |
|----------|------------|--------------|----------|-------|
| `private` | ✅ | ❌ | ❌ | ❌ |
| (default) | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

### Q4: How do I properly return collections from getters?
**A:** Return defensive copies to prevent external modification:
```java
// Bad - exposes internal list
public List<Item> getItems() { return items; }

// Good - return copy or unmodifiable view
public List<Item> getItems() { 
    return Collections.unmodifiableList(items);
}
```

### Q5: What's the "Tell, Don't Ask" principle?
**A:** Instead of getting data and making decisions externally, tell the object what to do:
```java
// Ask (Bad)
if (account.getBalance() >= amount) {
    account.setBalance(account.getBalance() - amount);
}

// Tell (Good)
account.withdraw(amount); // Object handles logic
```

### Q6: Can encapsulation be broken with reflection?
**A:** Yes, but it's generally bad practice:
- Reflection can access private members
- Breaks the contract of the class
- May cause unexpected behavior
- Security managers can restrict this
- Don't rely on encapsulation for security

## 📚 Additional Resources

1. [Oracle Java Documentation on Access Control](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html)
2. [Effective Java - Item 15: Minimize the accessibility of classes and members](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Clean Code - Chapter 6: Objects and Data Structures](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 