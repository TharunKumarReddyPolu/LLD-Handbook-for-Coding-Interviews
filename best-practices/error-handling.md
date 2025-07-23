# Error Handling Best Practices

## Table of Contents
- [Introduction](#introduction)
- [Exception Handling Principles](#exception-handling-principles)
- [Types of Exceptions](#types-of-exceptions)
- [Error Handling Patterns](#error-handling-patterns)
- [Logging Best Practices](#logging-best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Language-Specific Guidelines](#language-specific-guidelines)

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

## Types of Exceptions

### 1. Checked Exceptions
- Used for recoverable errors
- Must be declared or handled
- Part of method signature

```java
public class FileProcessor {
    public void processFile(String path) throws IOException {
        try (FileInputStream fis = new FileInputStream(path)) {
            // Process file
        }
    }
}
```

### 2. Unchecked Exceptions
- Used for programming errors
- Don't need to be declared
- Typically shouldn't be caught

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

### 3. Custom Exceptions
- Create for specific business cases
- Extend appropriate base class
- Include relevant context

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

## Error Handling Patterns

### 1. Try-With-Resources
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

### 2. Exception Translation
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

### 3. Exception Wrapping
```java
try {
    // Complex operation
} catch (Exception e) {
    throw new CustomException("Operation failed", e)
        .addContext("userId", userId)
        .addContext("operation", "complex-operation");
}
```

## Logging Best Practices

### 1. Log Levels
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

### 2. Context Information
```java
try {
    processOrder(order);
} catch (Exception e) {
    logger.error("Order processing failed. OrderId: {}, Customer: {}, Amount: {}",
        order.getId(), order.getCustomerId(), order.getAmount(), e);
}
```

## Common Pitfalls

### 1. Swallowing Exceptions
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

### 2. Overly Broad Catch Blocks
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

### 3. Inappropriate Exception Types
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

## Additional Resources
- [Java Exception Handling Best Practices](https://www.oracle.com/java/technologies/exception-handling.html)
- [Python Error Handling Guide](https://docs.python.org/3/tutorial/errors.html)
- [JavaScript Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) 