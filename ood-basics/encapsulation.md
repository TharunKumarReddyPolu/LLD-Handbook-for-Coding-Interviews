# 🔒 Encapsulation in Object-Oriented Programming

## 📝 Definition
Encapsulation is the bundling of data and the methods that operate on that data within a single unit or object, keeping the internal workings hidden from the outside world. It's one of the fundamental principles of OOP that helps achieve data hiding and abstraction.

## 🎯 Key Concepts

### 1. Data Hiding
- Restricting direct access to class members
- Using access modifiers (private, protected, public)
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

## 📚 Additional Resources

1. [Oracle Java Documentation on Access Control](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html)
2. [Effective Java - Item 15: Minimize the accessibility of classes and members](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)
3. [Clean Code - Chapter 6: Objects and Data Structures](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 