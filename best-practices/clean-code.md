# Clean Code Guidelines

## Table of Contents
- [Introduction](#introduction)
- [Naming Conventions](#naming-conventions)
- [Function Design](#function-design)
- [Comments and Documentation](#comments-and-documentation)
- [Code Organization](#code-organization)
- [Error Handling](#error-handling)
- [Unit Testing](#unit-testing)
- [Code Smells](#code-smells)

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Clean Code, you should understand:
- [Classes & Objects](../ood-basics/classes-and-objects.md) - Basic OOP concepts
- [Encapsulation](../ood-basics/encapsulation.md) - Data hiding principles
- [Single Responsibility Principle](../solid-principles/srp.md) - One class, one job

### Learning Path
Clean Code can be studied **at any point** in your LLD journey. It complements:
1. **With SOLID:** Apply clean code while learning SOLID principles
2. **With Patterns:** Write cleaner pattern implementations
3. **With Testing:** Clean code is testable code

### Related Topics
| Topic | Relationship |
|-------|-------------|
| [Error Handling](error-handling.md) | Exception handling practices |
| [Testing](testing.md) | Clean tests and TDD |
| [Code Review](code-review.md) | Review for code quality |
| [SRP](../solid-principles/srp.md) | Small, focused classes |

### How This Fits in the Big Picture
```
Clean Code principles apply throughout your learning:
OOD Basics + Clean Code → SOLID + Clean Code → Patterns + Clean Code
                              ↓
              Better code quality at every stage
```

## Introduction

Clean code is code that is easy to understand, maintain, and modify. It follows consistent patterns and practices that make it readable and maintainable by other developers.

## Naming Conventions

### Variables
- Use meaningful and pronounceable variable names
- Use the same vocabulary for the same type of variable
- Use searchable names
- Avoid magic numbers and strings

#### Java
```java
// Bad
int d; // elapsed time in days
String n; // user name

// Good
int elapsedTimeInDays;
String userName;
```

#### Python
```python
# Bad
d = 0  # elapsed time in days
n = ""  # user name

# Good
elapsed_time_in_days = 0
user_name = ""
```

#### C++
```cpp
// Bad
int d;  // elapsed time in days
std::string n;  // user name

// Good
int elapsedTimeInDays;
std::string userName;
```

### Functions
- Use verb-based names for functions that perform actions
- Use noun-based names for functions that return values
- Be consistent with function naming patterns

#### Java
```java
// Bad
void data(); // ambiguous
boolean userInfo(); // unclear if getting or checking

// Good
void processData();
void saveUser();
boolean isValidUser();
User getUser();
```

#### Python
```python
# Bad
def data(): pass  # ambiguous
def user_info() -> bool: pass  # unclear if getting or checking

# Good
def process_data() -> None: pass
def save_user() -> None: pass
def is_valid_user() -> bool: pass
def get_user() -> User: pass
```

#### C++
```cpp
// Bad
void data();  // ambiguous
bool userInfo();  // unclear if getting or checking

// Good
void processData();
void saveUser();
bool isValidUser();
User getUser();
```

### Classes
- Use noun-based names for classes
- Be specific but not verbose
- Follow your team/language conventions

#### Java
```java
// Bad
class Data {} // too vague
class UserDataServiceManagerImpl {} // too verbose

// Good
class Customer {}
class OrderProcessor {}
class PaymentService {}
```

#### Python
```python
# Bad
class Data: pass  # too vague
class UserDataServiceManagerImpl: pass  # too verbose

# Good
class Customer: pass
class OrderProcessor: pass
class PaymentService: pass
```

#### C++
```cpp
// Bad
class Data {};  // too vague
class UserDataServiceManagerImpl {};  // too verbose

// Good
class Customer {};
class OrderProcessor {};
class PaymentService {};
```

## Function Design

### Function Length
- Keep functions small and focused
- Follow the Single Responsibility Principle
- Aim for 20 lines or less per function

#### Java
```java
// Bad
void processOrder(Order order) {
    // 100 lines of code doing multiple things
}

// Good
void processOrder(Order order) {
    validateOrder(order);
    calculateTotal(order);
    applyDiscounts(order);
    saveOrder(order);
    notifyCustomer(order);
}
```

#### Python
```python
# Bad
def process_order(order):
    # 100 lines of code doing multiple things
    pass

# Good
def process_order(order):
    validate_order(order)
    calculate_total(order)
    apply_discounts(order)
    save_order(order)
    notify_customer(order)
```

#### C++
```cpp
// Bad
void processOrder(Order& order) {
    // 100 lines of code doing multiple things
}

// Good
void processOrder(Order& order) {
    validateOrder(order);
    calculateTotal(order);
    applyDiscounts(order);
    saveOrder(order);
    notifyCustomer(order);
}
```

### Parameters
- Limit the number of parameters (ideally ≤ 3)
- Use objects to group related parameters
- Avoid boolean flags as parameters

#### Java
```java
// Bad
void createUser(String name, String email, String address, String phone, boolean isAdmin);

// Good
void createUser(UserDTO userDTO);
```

#### Python
```python
# Bad
def create_user(name: str, email: str, address: str, phone: str, is_admin: bool):
    pass

# Good
def create_user(user_dto: UserDTO):
    pass

# Alternative - using dataclass
@dataclass
class UserDTO:
    name: str
    email: str
    address: str
    phone: str
    is_admin: bool = False
```

#### C++
```cpp
// Bad
void createUser(std::string name, std::string email, std::string address, 
                std::string phone, bool isAdmin);

// Good
void createUser(const UserDTO& userDTO);
```

## Comments and Documentation

### When to Comment
- Explain complex algorithms
- Document public APIs
- Clarify business rules
- TODO comments for future work

### When Not to Comment
- Don't comment obvious code
- Don't keep commented-out code
- Don't write redundant documentation

#### Java
```java
// Bad
// Increment i by 1
i++;

// Good
// Apply Dijkstra's algorithm for finding shortest path
// Time complexity: O(V + E log V)
void findShortestPath() {
    // Algorithm implementation
}
```

#### Python
```python
# Bad
# Increment i by 1
i += 1

# Good
# Apply Dijkstra's algorithm for finding shortest path
# Time complexity: O(V + E log V)
def find_shortest_path():
    """Algorithm implementation"""
    pass
```

#### C++
```cpp
// Bad
// Increment i by 1
i++;

// Good
// Apply Dijkstra's algorithm for finding shortest path
// Time complexity: O(V + E log V)
void findShortestPath() {
    // Algorithm implementation
}
```

## Code Organization

### File Structure
- One class per file
- Related classes in the same package
- Logical package hierarchy

### Class Structure
- Follow a consistent order for class members
- Group related methods together
- Use regions/markers sparingly

#### Java
```java
public class User {
    // Constants
    private static final int MAX_LOGIN_ATTEMPTS = 3;
    
    // Fields
    private String username;
    private String email;
    
    // Constructors
    public User() {}
    
    // Public methods
    public void login() {}
    
    // Private helper methods
    private void validateCredentials() {}
}
```

#### Python
```python
class User:
    # Constants
    MAX_LOGIN_ATTEMPTS = 3
    
    # Constructor
    def __init__(self):
        # Instance fields
        self._username = ""
        self._email = ""
    
    # Public methods
    def login(self):
        pass
    
    # Private helper methods
    def _validate_credentials(self):
        pass
```

#### C++
```cpp
class User {
private:
    // Constants
    static const int MAX_LOGIN_ATTEMPTS = 3;
    
    // Fields
    std::string username;
    std::string email;
    
    // Private helper methods
    void validateCredentials();

public:
    // Constructors
    User() = default;
    
    // Public methods
    void login();
};
```

## Error Handling

### Best Practices
- Use exceptions for exceptional cases
- Create custom exceptions when needed
- Always clean up resources
- Don't swallow exceptions

#### Java
```java
// Bad
try {
    // risky operation
} catch (Exception e) {}

// Good
try {
    // risky operation
} catch (SpecificException e) {
    logger.error("Operation failed", e);
    throw new CustomBusinessException("Could not complete operation", e);
} finally {
    cleanupResources();
}
```

#### Python
```python
# Bad
try:
    # risky operation
    pass
except Exception:
    pass

# Good
try:
    # risky operation
    pass
except SpecificException as e:
    logger.error("Operation failed", exc_info=True)
    raise CustomBusinessException("Could not complete operation") from e
finally:
    cleanup_resources()
```

#### C++
```cpp
// Bad
try {
    // risky operation
} catch (...) {}

// Good
try {
    // risky operation
} catch (const SpecificException& e) {
    logger.error("Operation failed: " + std::string(e.what()));
    throw CustomBusinessException("Could not complete operation", e);
}
// Use RAII for automatic cleanup instead of finally
```

## Unit Testing

### Test Structure
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test
- Meaningful test names

#### Java
```java
@Test
void shouldReturnUserWhenValidIdProvided() {
    // Arrange
    long userId = 123L;
    User expectedUser = new User(userId);
    when(userRepository.findById(userId)).thenReturn(expectedUser);
    
    // Act
    User actualUser = userService.getUser(userId);
    
    // Assert
    assertEquals(expectedUser, actualUser);
}
```

#### Python
```python
def test_should_return_user_when_valid_id_provided():
    # Arrange
    user_id = 123
    expected_user = User(user_id)
    user_repository.find_by_id = Mock(return_value=expected_user)
    
    # Act
    actual_user = user_service.get_user(user_id)
    
    # Assert
    assert actual_user == expected_user
```

#### C++
```cpp
TEST(UserServiceTest, ShouldReturnUserWhenValidIdProvided) {
    // Arrange
    long userId = 123L;
    User expectedUser(userId);
    EXPECT_CALL(mockRepository, findById(userId))
        .WillOnce(Return(expectedUser));
    
    // Act
    User actualUser = userService.getUser(userId);
    
    // Assert
    EXPECT_EQ(expectedUser, actualUser);
}
```

## Code Smells

### Common Code Smells
1. **Duplicate Code**
   - Extract common code into methods/classes
   - Use inheritance or composition

2. **Long Method**
   - Break into smaller methods
   - Extract complex logic

3. **Large Class**
   - Split into smaller classes
   - Use composition

4. **Feature Envy**
   - Move method to the class it uses most
   - Respect encapsulation

#### Java
```java
// Bad - Feature Envy
class Order {
    private Customer customer;
    
    public void printCustomerDetails() {
        System.out.println(customer.getName());
        System.out.println(customer.getAddress());
        System.out.println(customer.getEmail());
    }
}

// Good
class Customer {
    private String name;
    private String address;
    private String email;
    
    public void printDetails() {
        System.out.println(name);
        System.out.println(address);
        System.out.println(email);
    }
}
```

#### Python
```python
# Bad - Feature Envy
class Order:
    def __init__(self, customer):
        self._customer = customer
    
    def print_customer_details(self):
        print(self._customer.name)
        print(self._customer.address)
        print(self._customer.email)

# Good
class Customer:
    def __init__(self, name, address, email):
        self._name = name
        self._address = address
        self._email = email
    
    def print_details(self):
        print(self._name)
        print(self._address)
        print(self._email)
```

#### C++
```cpp
// Bad - Feature Envy
class Order {
    Customer* customer;
    
public:
    void printCustomerDetails() {
        std::cout << customer->getName() << std::endl;
        std::cout << customer->getAddress() << std::endl;
        std::cout << customer->getEmail() << std::endl;
    }
};

// Good
class Customer {
    std::string name;
    std::string address;
    std::string email;
    
public:
    void printDetails() {
        std::cout << name << std::endl;
        std::cout << address << std::endl;
        std::cout << email << std::endl;
    }
};
```

## ❓ Frequently Asked Questions

### Q1: How long should a function be?
**A:** Guidelines:
- Ideal: 5-20 lines
- Maximum: 50 lines (consider refactoring)
- One screen without scrolling
- Does one thing well
- **Key metric:** If you can't describe it in one sentence, it's too long

### Q2: How do I choose good variable names?
**A:** Follow these principles:
| Do | Don't |
|----|-------|
| `customerCount` | `n`, `cnt` |
| `isAvailable` | `flag` |
| `maxRetryAttempts` | `max` |
| `elapsedTimeMs` | `time` |
| Pronounceable names | Abbreviations |

### Q3: When should I write comments?
**A:**
| Write Comments For | Don't Comment |
|-------------------|---------------|
| Complex algorithms | Obvious code |
| Business rules/why | What code does |
| Public APIs (docs) | Commented-out code |
| Workarounds | Every line |
| TODO/FIXME | Bad code (fix it instead) |

### Q4: What is the "Boy Scout Rule"?
**A:** "Leave the code cleaner than you found it"
- Small improvements each time
- Rename unclear variables
- Extract small methods
- Remove dead code
- Don't make huge refactors in unrelated changes

### Q5: How do I refactor without breaking things?
**A:** Safe refactoring steps:
1. Ensure tests exist (write if needed)
2. Make small, incremental changes
3. Run tests after each change
4. Commit frequently
5. Use IDE refactoring tools

### Q6: What are the most common code smells?
**A:**
| Smell | Fix |
|-------|-----|
| Long Method | Extract methods |
| Large Class | Split into smaller classes |
| Duplicate Code | Extract common code |
| Feature Envy | Move method to right class |
| Data Clumps | Create object for data group |
| Primitive Obsession | Use value objects |

### Q7: How important is consistent formatting?
**A:** Very important:
- Use team-wide code formatter
- Configure IDE auto-format on save
- Include in CI/CD checks
- Consistency > personal preference
- Tools: Prettier, Black, clang-format

## Additional Resources
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring by Martin Fowler](https://refactoring.com/)
- [Code Complete by Steve McConnell](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670) 