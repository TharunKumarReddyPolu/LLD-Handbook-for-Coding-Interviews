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

## Introduction

Clean code is code that is easy to understand, maintain, and modify. It follows consistent patterns and practices that make it readable and maintainable by other developers.

## Naming Conventions

### Variables
- Use meaningful and pronounceable variable names
- Use the same vocabulary for the same type of variable
- Use searchable names
- Avoid magic numbers and strings

```java
// Bad
int d; // elapsed time in days
String n; // user name

// Good
int elapsedTimeInDays;
String userName;
```

### Functions
- Use verb-based names for functions that perform actions
- Use noun-based names for functions that return values
- Be consistent with function naming patterns

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

### Classes
- Use noun-based names for classes
- Be specific but not verbose
- Follow your team/language conventions

```java
// Bad
class Data {} // too vague
class UserDataServiceManagerImpl {} // too verbose

// Good
class Customer {}
class OrderProcessor {}
class PaymentService {}
```

## Function Design

### Function Length
- Keep functions small and focused
- Follow the Single Responsibility Principle
- Aim for 20 lines or less per function

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

### Parameters
- Limit the number of parameters (ideally ≤ 3)
- Use objects to group related parameters
- Avoid boolean flags as parameters

```java
// Bad
void createUser(String name, String email, String address, String phone, boolean isAdmin);

// Good
void createUser(UserDTO userDTO);
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

## Code Organization

### File Structure
- One class per file
- Related classes in the same package
- Logical package hierarchy

### Class Structure
- Follow a consistent order for class members
- Group related methods together
- Use regions/markers sparingly

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

## Error Handling

### Best Practices
- Use exceptions for exceptional cases
- Create custom exceptions when needed
- Always clean up resources
- Don't swallow exceptions

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

## Unit Testing

### Test Structure
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test
- Meaningful test names

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

## Additional Resources
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring by Martin Fowler](https://refactoring.com/)
- [Code Complete by Steve McConnell](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670) 