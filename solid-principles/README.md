# SOLID Principles 🌟

SOLID is an acronym for five design principles intended to make object-oriented designs more understandable, flexible, and maintainable.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying SOLID Principles, you should understand:
- [OOD Basics](../ood-basics/README.md) - All four pillars of OOP
- [Classes & Objects](../ood-basics/classes-and-objects.md) - Fundamental building blocks
- [Interfaces](../ood-basics/interfaces.md) - Contract-based design
- [Inheritance](../ood-basics/inheritance.md) - Class hierarchies

### Recommended Learning Order
```
1. Single Responsibility Principle (SRP) - Foundation
         ↓
2. Open/Closed Principle (OCP) - Extension patterns
         ↓
3. Liskov Substitution Principle (LSP) - Inheritance contracts
         ↓
4. Interface Segregation Principle (ISP) - Focused interfaces
         ↓
5. Dependency Inversion Principle (DIP) - Loose coupling
```

### After This Section
Continue your learning journey with:
1. [Design Patterns](../design-patterns/README.md) - Apply SOLID through patterns
2. [Interview Questions](../interview-questions/README.md) - Practice problems
3. [Best Practices](../best-practices/README.md) - Write better code

## 📋 The Five Principles

### 1. [Single Responsibility Principle (SRP)](srp.md)
> A class should have only one reason to change.

**Key Points:**
- One class, one responsibility
- Separate concerns
- Easier to test and maintain

**Example Violation:** A `User` class that handles authentication, database operations, AND email sending.

---

### 2. [Open/Closed Principle (OCP)](ocp.md)
> Software entities should be open for extension, but closed for modification.

**Key Points:**
- Extend behavior without modifying existing code
- Use abstractions and polymorphism
- Reduces risk of breaking existing functionality

**Example:** Adding new payment methods by creating new classes, not modifying existing payment logic.

---

### 3. [Liskov Substitution Principle (LSP)](lsp.md)
> Subtypes must be substitutable for their base types.

**Key Points:**
- Derived classes must honor base class contracts
- No surprises when using subclasses
- Ensures proper inheritance hierarchies

**Example Violation:** A `Square` class extending `Rectangle` that breaks when `setWidth()` and `setHeight()` are called.

---

### 4. [Interface Segregation Principle (ISP)](isp.md)
> Clients should not be forced to depend on interfaces they don't use.

**Key Points:**
- Many small, specific interfaces over one large interface
- Clients only implement what they need
- Reduces coupling and complexity

**Example:** Splitting a `Worker` interface into `Workable`, `Eatable`, and `Sleepable` interfaces.

---

### 5. [Dependency Inversion Principle (DIP)](dip.md)
> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Key Points:**
- Depend on abstractions, not concretions
- Enables loose coupling
- Facilitates testing with mocks

**Example:** A `UserService` depending on a `UserRepository` interface rather than a concrete `MySQLUserRepository`.

---

## 🎯 SOLID at a Glance

| Principle | Acronym | Key Question | Violation Sign |
|-----------|---------|--------------|----------------|
| **Single Responsibility** | S | Does this class have only one reason to change? | Class doing too many things |
| **Open/Closed** | O | Can I add new behavior without modifying this class? | Modifying existing code for new features |
| **Liskov Substitution** | L | Can I use a subclass wherever the parent is expected? | Overridden methods breaking contracts |
| **Interface Segregation** | I | Does this interface force implementations of unused methods? | Classes implementing empty methods |
| **Dependency Inversion** | D | Does this high-level module depend on low-level details? | Direct instantiation of concrete classes |

## 🔄 How SOLID Principles Relate

```
                    ┌─────────────────────────────────────────┐
                    │           SOLID Principles               │
                    └─────────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
   ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
   │     SRP     │           │     OCP     │           │     DIP     │
   │  (Classes)  │           │ (Extension) │           │  (Modules)  │
   └─────────────┘           └─────────────┘           └─────────────┘
          │                           │                           │
          │                           ▼                           │
          │                   ┌─────────────┐                     │
          └──────────────────►│     LSP     │◄────────────────────┘
                              │(Inheritance)│
                              └─────────────┘
                                      │
                                      ▼
                              ┌─────────────┐
                              │     ISP     │
                              │(Interfaces) │
                              └─────────────┘
```

## ❓ Frequently Asked Questions

### Q1: Should I always apply all SOLID principles?
**A:** Use SOLID as guidelines, not strict rules:
- Apply where they add value
- Don't over-engineer simple code
- Balance with pragmatism
- Refactor toward SOLID as complexity grows

### Q2: Which principle is most important?
**A:** It depends on context:
| Situation | Focus On |
|-----------|----------|
| Large codebase | SRP - manageable classes |
| Frequently changing requirements | OCP - safe extensions |
| Complex inheritance | LSP - proper hierarchies |
| Multiple client types | ISP - focused interfaces |
| Testability concerns | DIP - mockable dependencies |

### Q3: How do SOLID principles relate to design patterns?
**A:** Design patterns implement SOLID:
| Pattern | Primary SOLID Principle |
|---------|------------------------|
| Strategy | OCP, DIP |
| Factory | DIP, OCP |
| Decorator | OCP, SRP |
| Adapter | ISP, DIP |
| Observer | OCP, DIP |

### Q4: Can SOLID be applied to functional programming?
**A:** Core ideas translate:
- **SRP:** Pure functions, single purpose
- **OCP:** Higher-order functions
- **LSP:** Type constraints
- **ISP:** Minimal function signatures
- **DIP:** Function composition

### Q5: What are common SOLID violations in interviews?
**A:** Watch for:
- God classes (violates SRP)
- Switch statements on types (violates OCP)
- Inheritance that doesn't make sense (violates LSP)
- Fat interfaces (violates ISP)
- Direct instantiation of dependencies (violates DIP)

### Q6: How do I explain SOLID in an interview?
**A:** Structure your answer:
1. State the principle clearly
2. Give a simple real-world analogy
3. Provide a code example (violation and fix)
4. Explain the benefits
5. Mention when it might be overkill

## 📚 Additional Resources

- [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [SOLID Principles Explained](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Refactoring Guru: SOLID](https://refactoring.guru/refactoring/smells)
