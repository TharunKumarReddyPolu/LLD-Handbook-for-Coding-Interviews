# 🎯 Single Responsibility Principle (SRP)

## 📝 Definition
The Single Responsibility Principle states that a class should have only one reason to change, meaning it should have only one job or responsibility. This principle helps create more maintainable and flexible code by ensuring that classes are focused and cohesive.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying SRP, you should understand:
- [Classes & Objects](../ood-basics/classes-and-objects.md) - Basic class structure and object creation
- [Encapsulation](../ood-basics/encapsulation.md) - Data hiding and access modifiers
- Basic understanding of methods and responsibilities

### Learning Path
After mastering SRP, continue with:
1. **Next:** [Open/Closed Principle (OCP)](ocp.md) - Learn about extending behavior without modification
2. **Then:** [Liskov Substitution Principle (LSP)](lsp.md) - Understand proper inheritance
3. **Related:** [Clean Code Guidelines](../best-practices/clean-code.md) - Apply SRP in practice

### How SRP Fits in the Big Picture
```
OOD Basics → SRP → OCP → LSP → ISP → DIP → Design Patterns
     ↓
Classes & Objects are the foundation for understanding
why separating responsibilities matters
```

## 🎯 Key Concepts

### 1. One Class, One Responsibility

#### Java
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

#### Python
```python
# Bad - Multiple responsibilities
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
    
    def save_to_database(self): pass
    def send_email(self): pass
    def generate_report(self): pass

# Good - Separated responsibilities
class User:
    def __init__(self, name: str, email: str):
        self._name = name
        self._email = email
    
    @property
    def name(self) -> str:
        return self._name
    
    @property
    def email(self) -> str:
        return self._email

class UserRepository:
    def save(self, user: User) -> None: pass
    def find_by_id(self, id: int) -> User: pass

class EmailService:
    def send_email(self, to: str, subject: str, body: str) -> None: pass

class ReportGenerator:
    def generate_user_report(self, user: User) -> None: pass
```

#### C++
```cpp
// Bad - Multiple responsibilities
class User {
private:
    std::string name;
    std::string email;
public:
    void saveToDatabase() { }
    void sendEmail() { }
    void generateReport() { }
};

// Good - Separated responsibilities
class User {
private:
    std::string name;
    std::string email;
public:
    User(const std::string& name, const std::string& email) 
        : name(name), email(email) {}
    
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
};

class UserRepository {
public:
    void save(const User& user) { }
    User* findById(long id) { return nullptr; }
};

class EmailService {
public:
    void sendEmail(const std::string& to, const std::string& subject, 
                   const std::string& body) { }
};

class ReportGenerator {
public:
    void generateUserReport(const User& user) { }
};
```

### 2. Signs of SRP Violation
1. Large classes with many methods
2. Methods that manipulate different types of data
3. Classes that change for multiple reasons
4. Methods with side effects

## 💡 Best Practices

1. **Keep Classes Focused**

   #### Java
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

   #### Python
   ```python
   # Bad - Mixed responsibilities
   class OrderProcessor:
       def process_order(self, order: Order) -> None:
           self._validate_order(order)
           self._save_to_database(order)
           self._send_confirmation_email(order)
           self._update_inventory(order)
   
   # Good - Separated responsibilities
   class OrderProcessor:
       def __init__(self, validator: OrderValidator, repository: OrderRepository,
                    email_service: EmailService, inventory_service: InventoryService):
           self.validator = validator
           self.repository = repository
           self.email_service = email_service
           self.inventory_service = inventory_service
       
       def process_order(self, order: Order) -> None:
           self.validator.validate(order)
           self.repository.save(order)
           self.email_service.send_confirmation(order)
           self.inventory_service.update(order)
   ```

   #### C++
   ```cpp
   // Bad - Mixed responsibilities
   class OrderProcessor {
   public:
       void processOrder(Order& order) {
           validateOrder(order);
           saveToDatabase(order);
           sendConfirmationEmail(order);
           updateInventory(order);
       }
   };
   
   // Good - Separated responsibilities
   class OrderProcessor {
   private:
       std::unique_ptr<OrderValidator> validator;
       std::unique_ptr<OrderRepository> repository;
       std::unique_ptr<EmailService> emailService;
       std::unique_ptr<InventoryService> inventoryService;
   public:
       OrderProcessor(std::unique_ptr<OrderValidator> v,
                      std::unique_ptr<OrderRepository> r,
                      std::unique_ptr<EmailService> e,
                      std::unique_ptr<InventoryService> i)
           : validator(std::move(v)), repository(std::move(r)),
             emailService(std::move(e)), inventoryService(std::move(i)) {}
       
       void processOrder(Order& order) {
           validator->validate(order);
           repository->save(order);
           emailService->sendConfirmation(order);
           inventoryService->update(order);
       }
   };
   ```

2. **Use Composition**

   #### Java
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

   #### Python
   ```python
   class OrderService:
       def __init__(self, validator: OrderValidator, repository: OrderRepository):
           self._validator = validator
           self._repository = repository
       
       def create_order(self, order: Order) -> None:
           self._validator.validate(order)
           self._repository.save(order)
   ```

   #### C++
   ```cpp
   class OrderService {
   private:
       const OrderValidator& validator;
       OrderRepository& repository;
   public:
       OrderService(const OrderValidator& v, OrderRepository& r)
           : validator(v), repository(r) {}
       
       void createOrder(Order& order) {
           validator.validate(order);
           repository.save(order);
       }
   };
   ```

3. **Extract Responsibilities**

   #### Java
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
       public double calculatePay(Employee employee) { return 0.0; }
   }
   
   public class TimeReporter {
       public void reportHours(Employee employee) { }
   }
   ```

   #### Python
   ```python
   # Before
   class Employee:
       def calculate_pay(self): pass
       def save(self): pass
       def report_hours(self): pass
   
   # After
   class Employee:
       def __init__(self, name: str, id: int):
           self.name = name
           self.id = id

   class PayrollCalculator:
       def calculate_pay(self, employee: Employee) -> float:
           return 0.0

   class TimeReporter:
       def report_hours(self, employee: Employee) -> None:
           pass
   ```

   #### C++
   ```cpp
   // Before
   class Employee {
   public:
       void calculatePay() { }
       void save() { }
       void reportHours() { }
   };
   
   // After
   class Employee {
   private:
       std::string name;
       int id;
   public:
       Employee(const std::string& n, int i) : name(n), id(i) {}
       std::string getName() const { return name; }
       int getId() const { return id; }
   };
   
   class PayrollCalculator {
   public:
       double calculatePay(const Employee& employee) { return 0.0; }
   };
   
   class TimeReporter {
   public:
       void reportHours(const Employee& employee) { }
   };
   ```

## ⚠️ Common Pitfalls

1. **God Classes**

   #### Java
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

   #### Python
   ```python
   # Bad - God class
   class SuperService:
       def handle_user_registration(self): pass
       def process_payment(self): pass
       def generate_reports(self): pass
       def send_emails(self): pass
       def update_inventory(self): pass
   ```

   #### C++
   ```cpp
   // Bad - God class
   class SuperService {
   public:
       void handleUserRegistration() { }
       void processPayment() { }
       void generateReports() { }
       void sendEmails() { }
       void updateInventory() { }
   };
   ```

2. **Mixed Levels of Abstraction**

   #### Java
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

   #### Python
   ```python
   # Bad - Mixed abstraction levels
   class OrderProcessor:
       def process_order(self, order: Order) -> None:
           # High-level logic mixed with low-level details
           self._validate_order(order)
           conn = psycopg2.connect("db_url")
           # ... database operations
           smtp = smtplib.SMTP("smtp_server")
           # ... email sending
   ```

   #### C++
   ```cpp
   // Bad - Mixed abstraction levels
   class OrderProcessor {
   public:
       void processOrder(Order& order) {
           // High-level logic mixed with low-level details
           validateOrder(order);
           auto conn = DatabaseDriver::getConnection("db_url");
           // ... database operations
           SmtpClient smtp;
           // ... email sending
       }
   };
   ```

3. **Feature Envy**

   #### Java
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

   #### Python
   ```python
   # Bad - Feature envy
   class OrderReport:
       def generate_report(self, order: Order) -> None:
           # Too many calls to Order's methods
           customer_name = order.get_customer_name()
           total = order.calculate_total()
           items = order.get_items()
           tax = order.calculate_tax()
   ```

   #### C++
   ```cpp
   // Bad - Feature envy
   class OrderReport {
   public:
       void generateReport(const Order& order) {
           // Too many calls to Order's methods
           std::string customerName = order.getCustomerName();
           double total = order.calculateTotal();
           std::vector<Item> items = order.getItems();
           double tax = order.calculateTax();
       }
   };
   ```

## 🎯 Interview Questions

1. **How do you identify if a class violates SRP?**
   - Multiple unrelated methods
   - Changes for different reasons
   - Handles different types of data
   - Has multiple responsibilities

2. **How would you refactor this code to follow SRP?**

   #### Java
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
       
       public double calculateTotal() { return 0.0; }
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

   #### Python
   ```python
   # Before
   class Invoice:
       def calculate_total(self): pass
       def generate_pdf(self): pass
       def send_email(self): pass
       def save_to_database(self): pass
   
   # After
   class Invoice:
       def __init__(self):
           self.items: list[Item] = []
           self.total: float = 0.0
       
       def calculate_total(self) -> float:
           return sum(item.price for item in self.items)

   class InvoicePdfGenerator:
       def generate_pdf(self, invoice: Invoice) -> None: pass

   class InvoiceEmailer:
       def send_email(self, invoice: Invoice) -> None: pass

   class InvoiceRepository:
       def save(self, invoice: Invoice) -> None: pass
   ```

   #### C++
   ```cpp
   // Before
   class Invoice {
   public:
       void calculateTotal() { }
       void generatePDF() { }
       void sendEmail() { }
       void saveToDatabase() { }
   };
   
   // After
   class Invoice {
   private:
       std::vector<Item> items;
       double total;
   public:
       double calculateTotal() { return 0.0; }
   };
   
   class InvoicePdfGenerator {
   public:
       void generatePDF(const Invoice& invoice) { }
   };
   
   class InvoiceEmailer {
   public:
       void sendEmail(const Invoice& invoice) { }
   };
   
   class InvoiceRepository {
   public:
       void save(const Invoice& invoice) { }
   };
   ```

3. **What are the benefits of following SRP?**
   - Easier maintenance
   - Better testability
   - Reduced coupling
   - Improved reusability

## 💻 Practice Exercise

Refactor an e-commerce system to follow SRP:

### Java
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

### Python
```python
from typing import List, Optional
from dataclasses import dataclass, field

# Original code with multiple responsibilities
class OrderBad:
    def __init__(self):
        self.products: List[Product] = []
        self.customer: Optional[Customer] = None
        self.total: float = 0.0
    
    def add_product(self, product: Product) -> None:
        self.products.append(product)
        self._calculate_total()
    
    def _calculate_total(self) -> None:
        self.total = sum(p.price for p in self.products)
    
    def process_order(self) -> None:
        self._validate_order()
        self._save_to_database()
        self._send_confirmation_email()
        self._update_inventory()

# Refactored code following SRP
@dataclass
class Order:
    products: List[Product] = field(default_factory=list)
    customer: Optional[Customer] = None
    total: float = 0.0
    
    def add_product(self, product: Product) -> None:
        self.products.append(product)
        self._recalculate_total()
    
    def _recalculate_total(self) -> None:
        self.total = sum(p.price for p in self.products)

class OrderValidator:
    def validate(self, order: Order) -> bool:
        # Validation logic
        return len(order.products) > 0

class OrderRepository:
    def save(self, order: Order) -> None:
        # Database operations
        pass
    
    def find_by_id(self, id: int) -> Optional[Order]:
        # Retrieval logic
        return None

class OrderEmailService:
    def send_confirmation_email(self, order: Order) -> None:
        # Email sending logic
        pass

class InventoryService:
    def update_stock(self, order: Order) -> None:
        # Inventory update logic
        pass

class OrderProcessor:
    def __init__(self, validator: OrderValidator, repository: OrderRepository,
                 email_service: OrderEmailService, inventory_service: InventoryService):
        self._validator = validator
        self._repository = repository
        self._email_service = email_service
        self._inventory_service = inventory_service
    
    def process_order(self, order: Order) -> None:
        if self._validator.validate(order):
            self._repository.save(order)
            self._email_service.send_confirmation_email(order)
            self._inventory_service.update_stock(order)
```

### C++
```cpp
#include <vector>
#include <memory>
#include <numeric>

// Original code with multiple responsibilities - BAD
class OrderBad {
private:
    std::vector<Product> products;
    Customer* customer;
    double total;
    
public:
    void addProduct(const Product& product) {
        products.push_back(product);
        calculateTotal();
    }
    
    void calculateTotal() {
        total = std::accumulate(products.begin(), products.end(), 0.0,
            [](double sum, const Product& p) { return sum + p.getPrice(); });
    }
    
    void processOrder() {
        validateOrder();
        saveToDatabase();
        sendConfirmationEmail();
        updateInventory();
    }
};

// Refactored code following SRP
class Order {
private:
    std::vector<Product> products;
    Customer* customer;
    double total;
    
    void recalculateTotal() {
        total = std::accumulate(products.begin(), products.end(), 0.0,
            [](double sum, const Product& p) { return sum + p.getPrice(); });
    }
    
public:
    void addProduct(const Product& product) {
        products.push_back(product);
        recalculateTotal();
    }
    
    const std::vector<Product>& getProducts() const { return products; }
    Customer* getCustomer() const { return customer; }
    double getTotal() const { return total; }
};

class OrderValidator {
public:
    bool validate(const Order& order) {
        return !order.getProducts().empty();
    }
};

class OrderRepository {
public:
    void save(const Order& order) {
        // Database operations
    }
    
    std::unique_ptr<Order> findById(long id) {
        return nullptr;
    }
};

class OrderEmailService {
public:
    void sendConfirmationEmail(const Order& order) {
        // Email sending logic
    }
};

class InventoryService {
public:
    void updateStock(const Order& order) {
        // Inventory update logic
    }
};

class OrderProcessor {
private:
    OrderValidator& validator;
    OrderRepository& repository;
    OrderEmailService& emailService;
    InventoryService& inventoryService;
    
public:
    OrderProcessor(OrderValidator& v, OrderRepository& r,
                   OrderEmailService& e, InventoryService& i)
        : validator(v), repository(r), emailService(e), inventoryService(i) {}
    
    void processOrder(Order& order) {
        if (validator.validate(order)) {
            repository.save(order);
            emailService.sendConfirmationEmail(order);
            inventoryService.updateStock(order);
        }
    }
};
```

## ❓ Frequently Asked Questions

### Q1: How do I know if a class has too many responsibilities?
**A:** Look for these signs:
- The class has more than one reason to change
- The class name contains "And" or "Manager" (e.g., `UserAndOrderManager`)
- The class has methods that don't use the same instance variables
- You find yourself modifying the class for unrelated features
- The class is difficult to test in isolation

### Q2: Does SRP mean one method per class?
**A:** No! SRP means one *responsibility* or *reason to change*, not one method. A class can have multiple methods as long as they all serve the same responsibility. For example, a `UserRepository` can have `save()`, `findById()`, `delete()`, and `findAll()` methods—they all relate to user data persistence.

### Q3: How is SRP different from "separation of concerns"?
**A:** They're related but not identical:
- **SRP** focuses on classes having one reason to change
- **Separation of Concerns** is broader—it applies to modules, layers, and systems
- SRP is a specific application of separation of concerns at the class level

### Q4: Can following SRP lead to too many small classes?
**A:** Yes, if taken to extremes. Balance is key:
- Don't create a class for every method
- Group cohesive operations together
- Consider readability and navigation
- If related classes are always used together, consider if separation adds value

### Q5: How do I refactor a class that violates SRP?
**A:** Follow these steps:
1. Identify distinct responsibilities in the class
2. Create new classes for each responsibility
3. Move related methods and fields to new classes
4. Use composition to coordinate between classes
5. Update clients to use the new structure

### Q6: What's a "reason to change" exactly?
**A:** A reason to change is typically tied to a stakeholder or actor. Ask: "Who might request changes to this class?"
- Database team → persistence logic
- UI team → display logic
- Business team → business rules
- If multiple teams might request changes, the class likely has multiple responsibilities

## 📚 Additional Resources

1. [Clean Code by Robert C. Martin - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
2. [SOLID Principles in Java](https://www.baeldung.com/solid-principles)
3. [Martin Fowler - Single Responsibility Principle](https://www.martinfowler.com/bliki/SingleResponsibilityPrinciple.html) 