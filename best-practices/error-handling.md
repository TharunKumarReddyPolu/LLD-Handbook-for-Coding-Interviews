# Error Handling Best Practices

## Table of Contents
- [Introduction](#introduction)
- [Exception Handling Principles](#exception-handling-principles)
- [Types of Exceptions](#types-of-exceptions)
- [Error Handling Patterns](#error-handling-patterns)
- [Logging Best Practices](#logging-best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Language-Specific Guidelines](#language-specific-guidelines)

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Error Handling, you should understand:
- [Classes & Objects](../ood-basics/classes-and-objects.md) - Exception classes
- [Inheritance](../ood-basics/inheritance.md) - Exception hierarchies
- [Encapsulation](../ood-basics/encapsulation.md) - Information hiding in errors

### Learning Path
Error Handling can be studied **alongside other topics**:
1. **After OOD Basics:** Understand exception class design
2. **With Clean Code:** Error handling is part of clean code
3. **Before Testing:** Tests verify error handling behavior

### Related Topics
| Topic | Relationship |
|-------|-------------|
| [Clean Code](clean-code.md) | Error handling section |
| [Testing](testing.md) | Testing exception scenarios |
| [Design Patterns](../design-patterns/README.md) | Null Object, Strategy for errors |

### Interview Relevance
Error handling is frequently discussed in interviews:
- Custom exception design
- When to use checked vs unchecked
- Error logging strategies
- Resource cleanup patterns

### How This Fits in the Big Picture
```
OOD Basics → Error Handling → Testing
                  ↓
    Critical for robust system design
    Asked in coding and design interviews
```

## Introduction

Proper error handling is crucial for building robust and maintainable applications. This guide covers best practices for handling errors and exceptions effectively.

## Exception Handling Principles

### Core Principles
1. **Fail Fast** - Detect and report errors as soon as possible
2. **Fail Safe** - Maintain system stability when errors occur
3. **Be Specific** - Use specific exception types
4. **Be Informative** - Provide meaningful error messages
5. **Clean Up** - Always release resources properly

### Best Practices

#### Java
```java
// Good - Specific exception handling
try {
    processOrder(order);
} catch (InvalidOrderException e) {
    logger.error("Invalid order data", e);
    throw new BusinessException("Could not process order", e);
} catch (DatabaseException e) {
    logger.error("Database error", e);
    throw new SystemException("System unavailable", e);
} finally {
    cleanupResources();
}

// Bad - Generic exception handling
try {
    processOrder(order);
} catch (Exception e) {
    // Don't do this!
    e.printStackTrace();
}
```

#### Python
```python
# Good - Specific exception handling
try:
    process_order(order)
except InvalidOrderError as e:
    logger.error("Invalid order data", exc_info=True)
    raise BusinessException("Could not process order") from e
except DatabaseError as e:
    logger.error("Database error", exc_info=True)
    raise SystemException("System unavailable") from e
finally:
    cleanup_resources()

# Bad - Generic exception handling
try:
    process_order(order)
except Exception as e:
    # Don't do this!
    pass
```

#### C++
```cpp
// Good - Specific exception handling
try {
    processOrder(order);
} catch (const InvalidOrderException& e) {
    logger.error("Invalid order data: " + std::string(e.what()));
    throw BusinessException("Could not process order", e);
} catch (const DatabaseException& e) {
    logger.error("Database error: " + std::string(e.what()));
    throw SystemException("System unavailable", e);
}
// Use RAII for cleanup - no finally needed

// Bad - Generic exception handling
try {
    processOrder(order);
} catch (...) {
    // Don't do this!
}
```

## Types of Exceptions

### 1. Checked Exceptions
- Used for recoverable errors
- Must be declared or handled
- Part of method signature

#### Java
```java
public class FileProcessor {
    public void processFile(String path) throws IOException {
        try (FileInputStream fis = new FileInputStream(path)) {
            // Process file
        }
    }
}
```

#### Python
```python
# Python doesn't have checked exceptions, but you can document them
class FileProcessor:
    def process_file(self, path: str) -> None:
        """
        Process a file.
        
        Raises:
            FileNotFoundError: If file doesn't exist
            IOError: If file cannot be read
        """
        with open(path, 'r') as f:
            # Process file
            pass
```

#### C++
```cpp
// C++ doesn't have checked exceptions (noexcept specifier is opt-in)
class FileProcessor {
public:
    void processFile(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) {
            throw std::runtime_error("Cannot open file: " + path);
        }
        // Process file - RAII ensures cleanup
    }
};
```

### 2. Unchecked Exceptions
- Used for programming errors
- Don't need to be declared
- Typically shouldn't be caught

#### Java
```java
public class Calculator {
    public double divide(double a, double b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisor cannot be zero");
        }
        return a / b;
    }
}
```

#### Python
```python
class Calculator:
    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Divisor cannot be zero")
        return a / b
```

#### C++
```cpp
class Calculator {
public:
    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Divisor cannot be zero");
        }
        return a / b;
    }
};
```

### 3. Custom Exceptions
- Create for specific business cases
- Extend appropriate base class
- Include relevant context

#### Java
```java
public class OrderProcessingException extends BusinessException {
    private final String orderId;
    
    public OrderProcessingException(String message, String orderId, Throwable cause) {
        super(message, cause);
        this.orderId = orderId;
    }
    
    public String getOrderId() {
        return orderId;
    }
}
```

#### Python
```python
class OrderProcessingException(BusinessException):
    def __init__(self, message: str, order_id: str, cause: Exception = None):
        super().__init__(message)
        self.order_id = order_id
        self.__cause__ = cause
    
    def __str__(self):
        return f"{super().__str__()} (Order ID: {self.order_id})"
```

#### C++
```cpp
class OrderProcessingException : public BusinessException {
private:
    std::string orderId;

public:
    OrderProcessingException(const std::string& message, 
                            const std::string& orderId)
        : BusinessException(message), orderId(orderId) {}
    
    const std::string& getOrderId() const { return orderId; }
    
    const char* what() const noexcept override {
        static std::string msg;
        msg = BusinessException::what() + std::string(" (Order ID: ") + orderId + ")";
        return msg.c_str();
    }
};
```

## Error Handling Patterns

### 1. Try-With-Resources

#### Java
```java
// Good - Resources automatically closed
try (Connection conn = getConnection();
     PreparedStatement stmt = conn.prepareStatement(SQL)) {
    // Use resources
}

// Bad - Manual resource management
Connection conn = null;
try {
    conn = getConnection();
    // Use connection
} finally {
    if (conn != null) {
        conn.close();
    }
}
```

#### Python
```python
# Good - Resources automatically closed (context manager)
with get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute(SQL)
    # Use resources - automatically closed

# Bad - Manual resource management
conn = None
try:
    conn = get_connection()
    # Use connection
finally:
    if conn:
        conn.close()
```

#### C++
```cpp
// Good - RAII handles cleanup automatically
{
    auto conn = getConnection();  // unique_ptr or RAII wrapper
    auto stmt = conn->prepareStatement(SQL);
    // Use resources - automatically cleaned up when scope ends
}

// Alternative using custom RAII wrapper
class ConnectionGuard {
    Connection* conn;
public:
    ConnectionGuard(Connection* c) : conn(c) {}
    ~ConnectionGuard() { if (conn) conn->close(); }
    Connection* operator->() { return conn; }
};
```

### 2. Exception Translation

#### Java
```java
public class UserService {
    public User findUser(String id) {
        try {
            return userRepository.findById(id);
        } catch (SQLException e) {
            throw new ServiceException("Failed to find user", e);
        }
    }
}
```

#### Python
```python
class UserService:
    def find_user(self, id: str) -> User:
        try:
            return self.user_repository.find_by_id(id)
        except DatabaseError as e:
            raise ServiceException("Failed to find user") from e
```

#### C++
```cpp
class UserService {
public:
    User findUser(const std::string& id) {
        try {
            return userRepository.findById(id);
        } catch (const SQLException& e) {
            throw ServiceException("Failed to find user: " + std::string(e.what()));
        }
    }
};
```

### 3. Exception Wrapping

#### Java
```java
try {
    // Complex operation
} catch (Exception e) {
    throw new CustomException("Operation failed", e)
        .addContext("userId", userId)
        .addContext("operation", "complex-operation");
}
```

#### Python
```python
try:
    # Complex operation
    pass
except Exception as e:
    error = CustomException("Operation failed")
    error.context = {
        "user_id": user_id,
        "operation": "complex-operation"
    }
    raise error from e
```

#### C++
```cpp
try {
    // Complex operation
} catch (const std::exception& e) {
    CustomException error("Operation failed");
    error.addContext("userId", userId);
    error.addContext("operation", "complex-operation");
    throw error;
}
```

## Logging Best Practices

### 1. Log Levels

#### Java
```java
// Debug - Detailed information for debugging
logger.debug("Processing user registration: {}", user.getId());

// Info - General operational events
logger.info("User {} successfully registered", user.getId());

// Warn - Potentially harmful situations
logger.warn("User {} made too many login attempts", user.getId());

// Error - Error events that might still allow the application to continue
logger.error("Failed to process payment for order {}", orderId, e);

// Fatal - Very severe errors that will abort the application
logger.fatal("Database connection failed, shutting down", e);
```

#### Python
```python
import logging

# Debug - Detailed information for debugging
logger.debug(f"Processing user registration: {user.id}")

# Info - General operational events
logger.info(f"User {user.id} successfully registered")

# Warning - Potentially harmful situations
logger.warning(f"User {user.id} made too many login attempts")

# Error - Error events that might still allow the application to continue
logger.error(f"Failed to process payment for order {order_id}", exc_info=True)

# Critical - Very severe errors that will abort the application
logger.critical("Database connection failed, shutting down", exc_info=True)
```

#### C++
```cpp
// Using spdlog or similar logging library
// Debug - Detailed information for debugging
spdlog::debug("Processing user registration: {}", user.getId());

// Info - General operational events
spdlog::info("User {} successfully registered", user.getId());

// Warn - Potentially harmful situations
spdlog::warn("User {} made too many login attempts", user.getId());

// Error - Error events that might still allow the application to continue
spdlog::error("Failed to process payment for order {}: {}", orderId, e.what());

// Critical - Very severe errors that will abort the application
spdlog::critical("Database connection failed, shutting down");
```

### 2. Context Information

#### Java
```java
try {
    processOrder(order);
} catch (Exception e) {
    logger.error("Order processing failed. OrderId: {}, Customer: {}, Amount: {}",
        order.getId(), order.getCustomerId(), order.getAmount(), e);
}
```

#### Python
```python
try:
    process_order(order)
except Exception as e:
    logger.error(
        "Order processing failed. OrderId: %s, Customer: %s, Amount: %s",
        order.id, order.customer_id, order.amount,
        exc_info=True
    )
```

#### C++
```cpp
try {
    processOrder(order);
} catch (const std::exception& e) {
    spdlog::error("Order processing failed. OrderId: {}, Customer: {}, Amount: {}, Error: {}",
        order.getId(), order.getCustomerId(), order.getAmount(), e.what());
}
```

## Common Pitfalls

### 1. Swallowing Exceptions

#### Java
```java
// Bad - Exception information lost
try {
    riskyOperation();
} catch (Exception e) {
    // Don't do this!
}

// Good - Exception properly handled
try {
    riskyOperation();
} catch (Exception e) {
    logger.error("Operation failed", e);
    throw new ServiceException("Could not complete operation", e);
}
```

#### Python
```python
# Bad - Exception information lost
try:
    risky_operation()
except Exception:
    pass  # Don't do this!

# Good - Exception properly handled
try:
    risky_operation()
except Exception as e:
    logger.error("Operation failed", exc_info=True)
    raise ServiceException("Could not complete operation") from e
```

#### C++
```cpp
// Bad - Exception information lost
try {
    riskyOperation();
} catch (...) {
    // Don't do this!
}

// Good - Exception properly handled
try {
    riskyOperation();
} catch (const std::exception& e) {
    logger.error("Operation failed: " + std::string(e.what()));
    throw ServiceException("Could not complete operation");
}
```

### 2. Overly Broad Catch Blocks

#### Java
```java
// Bad - Catching too broadly
try {
    doSomething();
} catch (Exception e) {
    handleError(e);
}

// Good - Specific exception handling
try {
    doSomething();
} catch (IllegalArgumentException e) {
    handleValidationError(e);
} catch (IOException e) {
    handleIOError(e);
} catch (SQLException e) {
    handleDatabaseError(e);
}
```

#### Python
```python
# Bad - Catching too broadly
try:
    do_something()
except Exception as e:
    handle_error(e)

# Good - Specific exception handling
try:
    do_something()
except ValueError as e:
    handle_validation_error(e)
except IOError as e:
    handle_io_error(e)
except DatabaseError as e:
    handle_database_error(e)
```

#### C++
```cpp
// Bad - Catching too broadly
try {
    doSomething();
} catch (...) {
    handleError();
}

// Good - Specific exception handling
try {
    doSomething();
} catch (const std::invalid_argument& e) {
    handleValidationError(e);
} catch (const std::ios_base::failure& e) {
    handleIOError(e);
} catch (const DatabaseException& e) {
    handleDatabaseError(e);
}
```

### 3. Inappropriate Exception Types

#### Java
```java
// Bad - Using runtime exception for business logic
if (!isValid) {
    throw new NullPointerException("Invalid data");
}

// Good - Using appropriate custom exception
if (!isValid) {
    throw new ValidationException("Data validation failed: " + details);
}
```

#### Python
```python
# Bad - Using generic exception for business logic
if not is_valid:
    raise Exception("Invalid data")  # Too generic

# Good - Using appropriate custom exception
if not is_valid:
    raise ValidationError(f"Data validation failed: {details}")
```

#### C++
```cpp
// Bad - Using generic exception for business logic
if (!isValid) {
    throw std::runtime_error("Invalid data");  // Too generic
}

// Good - Using appropriate custom exception
if (!isValid) {
    throw ValidationException("Data validation failed: " + details);
}
```

## Language-Specific Guidelines

### Java
```java
// Use Optional for null handling
public Optional<User> findUser(String id) {
    try {
        return Optional.ofNullable(userRepository.findById(id));
    } catch (Exception e) {
        logger.error("Error finding user", e);
        return Optional.empty();
    }
}

// Use try-with-resources for AutoCloseable
try (var connection = dataSource.getConnection()) {
    // Use connection
}
```

### Python
```python
# Use context managers
with open('file.txt', 'r') as file:
    content = file.read()

# Use try/except/else/finally
try:
    value = process_data()
except ValueError as e:
    logger.error("Invalid data", exc_info=True)
    raise ProcessingError("Data processing failed") from e
else:
    logger.info("Processing successful")
finally:
    cleanup_resources()
```

### JavaScript/TypeScript
```typescript
// Use async/await with try/catch
async function processOrder(order: Order): Promise<void> {
    try {
        await validateOrder(order);
        await saveOrder(order);
    } catch (error) {
        logger.error('Order processing failed', { orderId: order.id, error });
        throw new OrderProcessingError('Failed to process order', { cause: error });
    }
}

// Custom error classes
class OrderProcessingError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'OrderProcessingError';
    }
}
```

## ❓ Frequently Asked Questions

### Q1: When should I use checked vs unchecked exceptions?
**A:**
| Checked Exceptions | Unchecked Exceptions |
|-------------------|---------------------|
| Recoverable errors | Programming errors |
| Client can handle | Bugs that should be fixed |
| File not found, network issues | Null pointer, array bounds |
| Must be declared/caught | Don't need declaration |

### Q2: Should I create custom exceptions?
**A:** Create custom exceptions when:
- ✅ Built-in exceptions don't fit
- ✅ Need to carry additional context
- ✅ Want to distinguish error types
- ❌ Don't create for every error
- ❌ Don't duplicate existing exceptions

### Q3: What should be in an error message?
**A:** Include:
1. What happened
2. Why it happened (if known)
3. Context (IDs, values)
4. How to fix (if applicable)

```java
// Bad
throw new Exception("Error");

// Good
throw new OrderException(
    "Cannot process order: insufficient inventory for item " + 
    itemId + ". Available: " + available + ", Requested: " + requested);
```

### Q4: How do I handle exceptions in async code?
**A:**
| Language | Approach |
|----------|----------|
| Java | CompletableFuture.exceptionally() |
| Python | try/except with await |
| JavaScript | .catch() or try/catch with await |
| C++ | std::future::get() throws |

### Q5: What's the "fail fast" principle?
**A:** Detect and report errors immediately:
- Validate inputs at entry points
- Don't let bad data propagate
- Crash early rather than produce wrong results
- Makes debugging easier
- Example: Check constructor arguments

### Q6: How do I log exceptions properly?
**A:**
```java
// Bad - loses stack trace
logger.error("Error: " + e.getMessage());

// Good - includes full stack trace
logger.error("Failed to process order {}", orderId, e);
```
Log: message, context, exception object (for stack trace)

### Q7: Should I catch Exception or Throwable?
**A:**
| Catch | When |
|-------|------|
| Specific exceptions | Almost always (prefer this) |
| Exception | Framework code, top-level handlers |
| Throwable | Almost never (catches Error too) |

## Additional Resources
- [Java Exception Handling Best Practices](https://www.oracle.com/java/technologies/exception-handling.html)
- [Python Error Handling Guide](https://docs.python.org/3/tutorial/errors.html)
- [JavaScript Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) 