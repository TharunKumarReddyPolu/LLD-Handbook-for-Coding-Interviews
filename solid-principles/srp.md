# 🎯 Single Responsibility Principle (SRP)

## 📝 Definition
The Single Responsibility Principle states that a class should have only one reason to change, meaning it should have only one job or responsibility. This principle helps create more maintainable and flexible code by ensuring that classes are focused and cohesive.

## 🎯 Key Concepts

### 1. One Class, One Responsibility
```java
// Bad - Multiple responsibilities
public class User {
    private String name;
    private String email;
    
    public void saveToDatabase() { }
    public void sendEmail() { }
    public void generateReport() { }
}

// Good - Separated responsibilities
public class User {
    private String name;
    private String email;
    
    public String getName() { return name; }
    public String getEmail() { return email; }
}

public class UserRepository {
    public void save(User user) { }
    public User findById(Long id) { }
}

public class EmailService {
    public void sendEmail(String to, String subject, String body) { }
}

public class ReportGenerator {
    public void generateUserReport(User user) { }
}
```

### 2. Signs of SRP Violation
1. Large classes with many methods
2. Methods that manipulate different types of data
3. Classes that change for multiple reasons
4. Methods with side effects

## 💡 Best Practices

1. **Keep Classes Focused**
   ```java
   // Bad - Mixed responsibilities
   public class OrderProcessor {
       public void processOrder(Order order) {
           validateOrder(order);
           saveToDatabase(order);
           sendConfirmationEmail(order);
           updateInventory(order);
       }
   }
   
   // Good - Separated responsibilities
   public class OrderProcessor {
       private OrderValidator validator;
       private OrderRepository repository;
       private EmailService emailService;
       private InventoryService inventoryService;
       
       public void processOrder(Order order) {
           validator.validate(order);
           repository.save(order);
           emailService.sendConfirmation(order);
           inventoryService.update(order);
       }
   }
   ```

2. **Use Composition**
   ```java
   public class OrderService {
       private final OrderValidator validator;
       private final OrderRepository repository;
       
       public OrderService(OrderValidator validator, OrderRepository repository) {
           this.validator = validator;
           this.repository = repository;
       }
       
       public void createOrder(Order order) {
           validator.validate(order);
           repository.save(order);
       }
   }
   ```

3. **Extract Responsibilities**
   ```java
   // Before
   public class Employee {
       public void calculatePay() { }
       public void save() { }
       public void reportHours() { }
   }
   
   // After
   public class Employee {
       private String name;
       private int id;
   }
   
   public class PayrollCalculator {
       public double calculatePay(Employee employee) { }
   }
   
   public class TimeReporter {
       public void reportHours(Employee employee) { }
   }
   ```

## ⚠️ Common Pitfalls

1. **God Classes**
   ```java
   // Bad - God class
   public class SuperService {
       public void handleUserRegistration() { }
       public void processPayment() { }
       public void generateReports() { }
       public void sendEmails() { }
       public void updateInventory() { }
   }
   ```

2. **Mixed Levels of Abstraction**
   ```java
   // Bad - Mixed abstraction levels
   public class OrderProcessor {
       public void processOrder(Order order) {
           // High-level logic mixed with low-level details
           validateOrder(order);
           Connection conn = DriverManager.getConnection("db_url");
           // ... database operations
           SmtpClient smtp = new SmtpClient();
           // ... email sending
       }
   }
   ```

3. **Feature Envy**
   ```java
   // Bad - Feature envy
   public class OrderReport {
       public void generateReport(Order order) {
           // Too many calls to Order's methods
           String customerName = order.getCustomerName();
           double total = order.calculateTotal();
           List<Item> items = order.getItems();
           double tax = order.calculateTax();
       }
   }
   ```

## 🎯 Interview Questions

1. **How do you identify if a class violates SRP?**
   - Multiple unrelated methods
   - Changes for different reasons
   - Handles different types of data
   - Has multiple responsibilities

2. **How would you refactor this code to follow SRP?**
   ```java
   // Before
   public class Invoice {
       public void calculateTotal() { }
       public void generatePDF() { }
       public void sendEmail() { }
       public void saveToDatabase() { }
   }
   
   // After
   public class Invoice {
       private List<Item> items;
       private double total;
       
       public double calculateTotal() { }
   }
   
   public class InvoicePdfGenerator {
       public void generatePDF(Invoice invoice) { }
   }
   
   public class InvoiceEmailer {
       public void sendEmail(Invoice invoice) { }
   }
   
   public class InvoiceRepository {
       public void save(Invoice invoice) { }
   }
   ```

3. **What are the benefits of following SRP?**
   - Easier maintenance
   - Better testability
   - Reduced coupling
   - Improved reusability

## 💻 Practice Exercise

Refactor an e-commerce system to follow SRP:

```java
// Original code with multiple responsibilities
public class Order {
    private List<Product> products;
    private Customer customer;
    private double total;
    
    public void addProduct(Product product) {
        products.add(product);
        calculateTotal();
    }
    
    public void calculateTotal() {
        total = products.stream()
                       .mapToDouble(Product::getPrice)
                       .sum();
    }
    
    public void processOrder() {
        validateOrder();
        saveToDatabase();
        sendConfirmationEmail();
        updateInventory();
    }
    
    private void validateOrder() {
        // Validation logic
    }
    
    private void saveToDatabase() {
        // Database operations
    }
    
    private void sendConfirmationEmail() {
        // Email sending logic
    }
    
    private void updateInventory() {
        // Inventory update logic
    }
}

// Refactored code following SRP
public class Order {
    private List<Product> products;
    private Customer customer;
    private double total;
    
    public void addProduct(Product product) {
        products.add(product);
        recalculateTotal();
    }
    
    private void recalculateTotal() {
        total = products.stream()
                       .mapToDouble(Product::getPrice)
                       .sum();
    }
    
    // Getters
    public List<Product> getProducts() { return products; }
    public Customer getCustomer() { return customer; }
    public double getTotal() { return total; }
}

public class OrderValidator {
    public boolean validate(Order order) {
        // Validation logic
        return true;
    }
}

public class OrderRepository {
    public void save(Order order) {
        // Database operations
    }
    
    public Order findById(Long id) {
        // Retrieval logic
        return null;
    }
}

public class OrderEmailService {
    public void sendConfirmationEmail(Order order) {
        // Email sending logic
    }
}

public class InventoryService {
    public void updateStock(Order order) {
        // Inventory update logic
    }
}

public class OrderProcessor {
    private final OrderValidator validator;
    private final OrderRepository repository;
    private final OrderEmailService emailService;
    private final InventoryService inventoryService;
    
    public OrderProcessor(
            OrderValidator validator,
            OrderRepository repository,
            OrderEmailService emailService,
            InventoryService inventoryService) {
        this.validator = validator;
        this.repository = repository;
        this.emailService = emailService;
        this.inventoryService = inventoryService;
    }
    
    public void processOrder(Order order) {
        if (validator.validate(order)) {
            repository.save(order);
            emailService.sendConfirmationEmail(order);
            inventoryService.updateStock(order);
        }
    }
}
```

## 📚 Additional Resources

1. [Clean Code by Robert C. Martin - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
2. [SOLID Principles in Java](https://www.baeldung.com/solid-principles)
3. [Martin Fowler - Single Responsibility Principle](https://www.martinfowler.com/bliki/SingleResponsibilityPrinciple.html) 