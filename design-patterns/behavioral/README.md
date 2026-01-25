# Behavioral Design Patterns

Behavioral design patterns are concerned with communication between objects, how objects interact and distribute responsibility.

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Behavioral Patterns, you should understand:
- [Creational Patterns](../creational/README.md) - Object creation
- [Structural Patterns](../structural/README.md) - Object composition
- [Polymorphism](../../ood-basics/polymorphism.md) - Runtime behavior changes
- [SOLID Principles](../../solid-principles/README.md) - Especially OCP and DIP

### Recommended Study Order
```
1. Strategy (Most fundamental - swappable algorithms)
         ↓
2. Observer (Event handling)
         ↓
3. Command (Request as object)
         ↓
4. Template Method (Algorithm skeleton)
         ↓
5. State (State machine behavior)
         ↓
6. Chain of Responsibility, Iterator, Mediator (Advanced)
         ↓
7. Memento, Visitor (Specialized use cases)
```

### Learning Path
After Behavioral Patterns, you're ready for:
1. **Practice:** [Easy Interview Questions](../../interview-questions/easy/README.md)
2. **Challenge:** [Medium Interview Questions](../../interview-questions/medium/README.md)
3. **Master:** [Hard Interview Questions](../../interview-questions/hard/README.md)

### Pattern Selection Guide
| Problem | Pattern | Why |
|---------|---------|-----|
| Swappable algorithms | Strategy | Encapsulates algorithm |
| React to state changes | Observer | Publish-subscribe model |
| Encapsulate requests | Command | Decouple sender/receiver |
| Common algorithm steps | Template Method | Define skeleton |
| Object behavior varies by state | State | Clean state transitions |
| Multiple handlers | Chain of Responsibility | Decoupled handling |
| Traverse collection | Iterator | Uniform access |
| Complex object interactions | Mediator | Centralized control |
| Undo/redo functionality | Memento | Capture state |
| Add operations to classes | Visitor | Double dispatch |

## Overview

```mermaid
graph TD
    A[Behavioral Patterns] --> B[Chain of Responsibility]
    A --> C[Command]
    A --> D[Iterator]
    A --> E[Mediator]
    A --> F[Memento]
    A --> G[Observer]
    A --> H[State]
    A --> I[Strategy]
    A --> J[Template Method]
    A --> K[Visitor]
    
    B --> L[Passes request along chain]
    C --> M[Encapsulates request as object]
    D --> N[Accesses elements sequentially]
    E --> O[Reduces direct object coupling]
    F --> P[Captures object state]
    G --> Q[Notifies dependents of changes]
    H --> R[Alters object behavior]
    I --> S[Encapsulates algorithms]
    J --> T[Defines algorithm skeleton]
    K --> U[Adds operations to class]
```

## Patterns

### Chain of Responsibility
- **Purpose**: Passes requests along a chain of handlers until one handles it
- **Use When**: Multiple objects may handle a request and the handler isn't known beforehand
- **Example**: Logging frameworks, event handling systems

### Command
- **Purpose**: Encapsulates a request as an object
- **Use When**: You want to parameterize objects with operations
- **Example**: GUI buttons, undo functionality

### Iterator
- **Purpose**: Provides a way to access elements of a collection sequentially
- **Use When**: You want to traverse a collection without exposing its internal structure
- **Example**: Collection traversal, custom iteration patterns

### Mediator
- **Purpose**: Defines an object that encapsulates how a set of objects interact
- **Use When**: A set of objects communicate in well-defined but complex ways
- **Example**: Air traffic control, chat rooms

### Memento
- **Purpose**: Captures and externalizes an object's internal state
- **Use When**: You need to save and restore an object's state
- **Example**: Undo mechanisms, checkpoints

### Observer
- **Purpose**: Defines a one-to-many dependency between objects
- **Use When**: A change to one object requires changing others
- **Example**: Event handling, GUI components

### State
- **Purpose**: Allows an object to alter its behavior when its internal state changes
- **Use When**: An object's behavior depends on its state
- **Example**: Vending machines, workflow systems

### Strategy
- **Purpose**: Defines a family of algorithms and makes them interchangeable
- **Use When**: You want to use different variants of an algorithm within an object
- **Example**: Sorting algorithms, payment methods

### Template Method
- **Purpose**: Defines the skeleton of an algorithm in a method
- **Use When**: You want to define the skeleton of an algorithm and let subclasses override specific steps
- **Example**: Data mining operations, build processes

### Visitor
- **Purpose**: Represents an operation to be performed on elements of an object structure
- **Use When**: You want to define operations on a composite structure
- **Example**: Document processing, AST traversal

## Implementation Guidelines

### Chain of Responsibility
```java
public abstract class Handler {
    protected Handler successor;
    
    public void setSuccessor(Handler successor) {
        this.successor = successor;
    }
    
    public abstract void handleRequest(Request request);
}

public class ConcreteHandler extends Handler {
    @Override
    public void handleRequest(Request request) {
        if (canHandle(request)) {
            // Handle the request
        } else if (successor != null) {
            successor.handleRequest(request);
        }
    }
}
```

### Command
```java
public interface Command {
    void execute();
    void undo();
}

public class ConcreteCommand implements Command {
    private Receiver receiver;
    
    public ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }
    
    @Override
    public void execute() {
        receiver.action();
    }
    
    @Override
    public void undo() {
        receiver.undoAction();
    }
}

public class Invoker {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void executeCommand() {
        command.execute();
    }
}
```

### Iterator
```java
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

public class ConcreteCollection<T> {
    private List<T> items = new ArrayList<>();
    
    public Iterator<T> getIterator() {
        return new ConcreteIterator();
    }
    
    private class ConcreteIterator implements Iterator<T> {
        private int index = 0;
        
        @Override
        public boolean hasNext() {
            return index < items.size();
        }
        
        @Override
        public T next() {
            if (hasNext()) {
                return items.get(index++);
            }
            throw new NoSuchElementException();
        }
    }
}
```

### Mediator
```java
public interface Mediator {
    void sendMessage(String message, Colleague colleague);
}

public abstract class Colleague {
    protected Mediator mediator;
    
    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }
    
    public abstract void receive(String message);
}

public class ConcreteMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();
    
    public void addColleague(Colleague colleague) {
        colleagues.add(colleague);
    }
    
    @Override
    public void sendMessage(String message, Colleague originator) {
        for(Colleague colleague : colleagues) {
            if (colleague != originator) {
                colleague.receive(message);
            }
        }
    }
}
```

### Memento
```java
public class Memento {
    private final String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

public class Originator {
    private String state;
    
    public void setState(String state) {
        this.state = state;
    }
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void restoreStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

public class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();
    
    public void add(Memento state) {
        mementoList.add(state);
    }
    
    public Memento get(int index) {
        return mementoList.get(index);
    }
}
```

### Observer

#### Java
```java
public interface Observer {
    void update(String message);
}

public class Subject {
    private List<Observer> observers = new ArrayList<>();
    private String state;
    
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void setState(String state) {
        this.state = state;
        notifyObservers();
    }
    
    private void notifyObservers() {
        for(Observer observer : observers) {
            observer.update(state);
        }
    }
}
```

#### Python
```python
from abc import ABC, abstractmethod
from typing import List

class Observer(ABC):
    @abstractmethod
    def update(self, message: str) -> None:
        pass

class Subject:
    def __init__(self):
        self._observers: List[Observer] = []
        self._state: str = ""
    
    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)
    
    def set_state(self, state: str) -> None:
        self._state = state
        self._notify_observers()
    
    def _notify_observers(self) -> None:
        for observer in self._observers:
            observer.update(self._state)
```

#### C++
```cpp
class Observer {
public:
    virtual ~Observer() = default;
    virtual void update(const std::string& message) = 0;
};

class Subject {
private:
    std::vector<Observer*> observers;
    std::string state;
public:
    void attach(Observer* observer) {
        observers.push_back(observer);
    }
    
    void setState(const std::string& newState) {
        state = newState;
        notifyObservers();
    }
    
private:
    void notifyObservers() {
        for (auto* observer : observers) {
            observer->update(state);
        }
    }
};
```

### State
```java
public interface State {
    void handle(Context context);
}

public class Context {
    private State state;
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void request() {
        state.handle(this);
    }
}

public class ConcreteStateA implements State {
    @Override
    public void handle(Context context) {
        // Handle the state
        context.setState(new ConcreteStateB());
    }
}
```

### Strategy

#### Java
```java
public interface Strategy {
    int execute(int a, int b);
}

public class Context {
    private Strategy strategy;
    
    public Context(Strategy strategy) {
        this.strategy = strategy;
    }
    
    public int executeStrategy(int a, int b) {
        return strategy.execute(a, b);
    }
}

public class AddStrategy implements Strategy {
    @Override
    public int execute(int a, int b) {
        return a + b;
    }
}
```

#### Python
```python
from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def execute(self, a: int, b: int) -> int:
        pass

class Context:
    def __init__(self, strategy: Strategy):
        self._strategy = strategy
    
    def execute_strategy(self, a: int, b: int) -> int:
        return self._strategy.execute(a, b)

class AddStrategy(Strategy):
    def execute(self, a: int, b: int) -> int:
        return a + b
```

#### C++
```cpp
class Strategy {
public:
    virtual ~Strategy() = default;
    virtual int execute(int a, int b) const = 0;
};

class Context {
private:
    std::unique_ptr<Strategy> strategy;
public:
    Context(std::unique_ptr<Strategy> s) : strategy(std::move(s)) {}
    
    int executeStrategy(int a, int b) const {
        return strategy->execute(a, b);
    }
};

class AddStrategy : public Strategy {
public:
    int execute(int a, int b) const override {
        return a + b;
    }
};
```

### Template Method
```java
public abstract class AbstractClass {
    public final void templateMethod() {
        step1();
        step2();
        hook();
    }
    
    protected abstract void step1();
    protected abstract void step2();
    
    protected void hook() {} // Optional hook
}

public class ConcreteClass extends AbstractClass {
    @Override
    protected void step1() {
        // Implementation
    }
    
    @Override
    protected void step2() {
        // Implementation
    }
}
```

### Visitor
```java
public interface Visitor {
    void visit(ConcreteElementA element);
    void visit(ConcreteElementB element);
}

public interface Element {
    void accept(Visitor visitor);
}

public class ConcreteElementA implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

public class ConcreteVisitor implements Visitor {
    @Override
    public void visit(ConcreteElementA element) {
        // Do something with element A
    }
    
    @Override
    public void visit(ConcreteElementB element) {
        // Do something with element B
    }
}
```

## Best Practices

### Do's
1. **Use Chain of Responsibility** when:
   - Multiple objects can handle a request
   - You want to issue a request to one of several objects without specifying the receiver explicitly

2. **Use Command** when:
   - You want to parameterize objects with operations
   - You want to queue operations, schedule their execution, or execute them remotely
   - You need undo/redo capabilities

3. **Use Iterator** when:
   - You want to access a collection's elements without exposing its internal structure
   - You want to support multiple traversal methods for a collection

4. **Use Mediator** when:
   - A set of objects communicate in well-defined but complex ways
   - You want to reduce coupling between objects

5. **Use Memento** when:
   - You need to save and restore an object's state
   - A direct interface to obtaining the state would expose implementation details

6. **Use Observer** when:
   - A change to one object requires changing others
   - You want to establish one-to-many relationships between objects

7. **Use State** when:
   - An object's behavior depends on its state
   - You want to avoid large conditional statements

8. **Use Strategy** when:
   - You want to define a family of algorithms
   - You need to vary an algorithm dynamically

9. **Use Template Method** when:
   - You want to define the skeleton of an algorithm and let subclasses override specific steps
   - You want to avoid code duplication in similar algorithms

10. **Use Visitor** when:
    - You want to define operations on a composite structure
    - You want to add operations without changing the classes of the elements

### Don'ts
1. Don't create overly long chains in Chain of Responsibility
2. Don't make Command objects too complex
3. Don't expose internal collection structure in Iterator
4. Don't create Mediator objects that know too much
5. Don't store unnecessary state in Memento
6. Don't create tight coupling in Observer
7. Don't overuse State for simple state changes
8. Don't create too many Strategy classes
9. Don't make Template Method too rigid
10. Don't use Visitor when structure changes frequently

## Anti-Patterns to Avoid

1. **Broken Chain**
   - Not handling end of chain properly
   - Solution: Always provide default handler

2. **Command Bloat**
   - Too many command classes
   - Solution: Use composite commands

3. **Iterator Pollution**
   - Exposing too much in iterator interface
   - Solution: Keep iterator interface minimal

4. **Mediator Bloat**
   - Mediator knows too much
   - Solution: Split into multiple mediators

5. **Memory Leak in Observer**
   - Not removing observers
   - Solution: Implement proper cleanup

6. **State Explosion**
   - Too many state classes
   - Solution: Combine similar states

7. **Strategy Overkill**
   - Creating strategies for simple variations
   - Solution: Use simpler conditional logic

8. **Rigid Template**
   - Not providing hooks
   - Solution: Add optional hooks

9. **Visitor Violation**
   - Modifying element structure
   - Solution: Keep element structure stable

## ❓ Frequently Asked Questions

### Q1: What's the difference between Strategy and State?
**A:**
| Strategy | State |
|----------|-------|
| Client chooses algorithm | Object changes its own state |
| Stateless (usually) | Maintains current state |
| External selection | Internal transitions |
| Algorithms are interchangeable | States have transition rules |

### Q2: When should I use Observer vs Pub/Sub?
**A:**
| Observer | Publish/Subscribe |
|----------|-------------------|
| Direct reference to observers | Message broker in between |
| Tightly coupled | Loosely coupled |
| Synchronous | Can be async |
| Same process | Can span processes |

### Q3: What's Command pattern good for?
**A:** Key use cases:
- **Undo/Redo:** Store commands in history
- **Queuing:** Commands as work items
- **Logging:** Record commands for replay
- **Transactions:** Group commands
- **Remote execution:** Serialize and send

### Q4: How is Chain of Responsibility different from Strategy?
**A:**
| Chain of Responsibility | Strategy |
|------------------------|----------|
| Request passed along chain | Single algorithm selected |
| Multiple handlers possible | One strategy handles |
| Order matters | Order doesn't matter |
| Can pass to next | No passing |

### Q5: When should I use Template Method vs Strategy?
**A:**
| Template Method | Strategy |
|----------------|----------|
| Uses inheritance | Uses composition |
| Algorithm skeleton fixed | Entire algorithm varies |
| Subclass overrides steps | Strategy object injected |
| Compile-time binding | Runtime binding |

### Q6: What's the difference between Mediator and Observer?
**A:**
| Mediator | Observer |
|----------|----------|
| Centralized control | Distributed notification |
| Components don't know each other | Subject knows observers exist |
| Two-way communication | One-way notification |
| Complex interactions | Simple notifications |

### Q7: When is Visitor pattern appropriate?
**A:** Use when:
- Structure is stable but operations change
- Need many unrelated operations on structure
- Want to avoid polluting element classes
- Double dispatch is needed
- **Don't use when:** Structure changes frequently

### Q8: How do I implement undo/redo?
**A:** Use Command + Memento:
```
1. Command stores operation
2. Execute → Push to undo stack
3. Undo → Pop from undo, push to redo
4. Redo → Pop from redo, push to undo
5. Memento stores state for complex undo
```

## Additional Resources
- [Chain of Responsibility Pattern](https://refactoring.guru/design-patterns/chain-of-responsibility)
- [Command Pattern](https://refactoring.guru/design-patterns/command)
- [Iterator Pattern](https://refactoring.guru/design-patterns/iterator)
- [Mediator Pattern](https://refactoring.guru/design-patterns/mediator)
- [Memento Pattern](https://refactoring.guru/design-patterns/memento)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [State Pattern](https://refactoring.guru/design-patterns/state)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Template Method Pattern](https://refactoring.guru/design-patterns/template-method)
- [Visitor Pattern](https://refactoring.guru/design-patterns/visitor)