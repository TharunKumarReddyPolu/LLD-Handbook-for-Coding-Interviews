# 🤝 Association, Aggregation & Composition in Object-Oriented Programming

## 📝 Definition
Object relationships define how objects interact with each other in an object-oriented system. The three main types of relationships are:
1. Association - Objects are related but independent
2. Aggregation - "Has-a" relationship with loose coupling
3. Composition - "Part-of" relationship with strong coupling

## 📚 Prerequisites & Learning Path

### Prerequisites
Before studying Relationships, you should understand:
- [Classes & Objects](classes-and-objects.md) - Object creation and lifecycle
- [Encapsulation](encapsulation.md) - Access control between objects
- [Inheritance](inheritance.md) - "Is-a" relationships
- [Interfaces](interfaces.md) - Contracts between objects

### Learning Path
After mastering Relationships, continue with:
1. **Next:** [SOLID Principles](../solid-principles/srp.md) - Design guidelines
2. **Then:** [Dependency Inversion](../solid-principles/dip.md) - Composition over inheritance
3. **Patterns:** [Composite Pattern](../design-patterns/structural/README.md) - Composition in practice
4. **Patterns:** [Decorator Pattern](../design-patterns/structural/README.md) - Dynamic composition

### How This Fits in the Big Picture
```
All OOD Basics → Relationships → SOLID Principles → Design Patterns
                      ↓
        Understanding relationships is crucial for:
        - Choosing composition over inheritance
        - Designing loosely coupled systems
        - Implementing structural patterns
```

## 🎯 Key Concepts

### 1. Association
- Represents a relationship where objects are connected but independent
- Can be one-to-one, one-to-many, or many-to-many

**Java:**
```java
public class Student {
    private List<Course> courses;  // Student takes courses
    
    public void enrollCourse(Course course) {
        courses.add(course);
    }
}

public class Course {
    private List<Student> students;  // Course has students
    
    public void addStudent(Student student) {
        students.add(student);
    }
}
```

**Python:**
```python
from typing import List

class Course:
    def __init__(self):
        self._students: List['Student'] = []  # Course has students
    
    def add_student(self, student: 'Student'):
        self._students.append(student)

class Student:
    def __init__(self):
        self._courses: List[Course] = []  # Student takes courses
    
    def enroll_course(self, course: Course):
        self._courses.append(course)
```

**C++:**
```cpp
#include <vector>

class Course;  // Forward declaration

class Student {
private:
    std::vector<Course*> courses;  // Student takes courses

public:
    void enrollCourse(Course* course) {
        courses.push_back(course);
    }
};

class Course {
private:
    std::vector<Student*> students;  // Course has students

public:
    void addStudent(Student* student) {
        students.push_back(student);
    }
};
```

### 2. Aggregation
- "Has-a" relationship
- Child can exist independently of parent

**Java:**
```java
public class University {
    private List<Department> departments;  // University has departments
    
    public void addDepartment(Department department) {
        departments.add(department);
    }
}

public class Department {
    private String name;
    // Department can exist without University
}
```

**Python:**
```python
from typing import List

class Department:
    def __init__(self, name: str):
        self._name = name
    # Department can exist without University

class University:
    def __init__(self):
        self._departments: List[Department] = []  # University has departments
    
    def add_department(self, department: Department):
        self._departments.append(department)
```

**C++:**
```cpp
#include <vector>
#include <string>

class Department {
private:
    std::string name;
    // Department can exist without University

public:
    Department(const std::string& name) : name(name) {}
};

class University {
private:
    std::vector<Department*> departments;  // University has departments (aggregation - raw pointer)

public:
    void addDepartment(Department* department) {
        departments.push_back(department);
    }
};
```

### 3. Composition
- "Part-of" relationship
- Child cannot exist without parent

**Java:**
```java
public class Car {
    private final Engine engine;  // Car owns Engine
    
    public Car() {
        engine = new Engine();  // Engine created with Car
    }
}

public class Engine {
    // Engine cannot exist without Car
}
```

**Python:**
```python
class Engine:
    # Engine cannot exist without Car
    pass

class Car:
    def __init__(self):
        self._engine = Engine()  # Car owns Engine - created with Car
```

**C++:**
```cpp
class Engine {
    // Engine cannot exist without Car
};

class Car {
private:
    Engine engine;  // Composition - Engine is part of Car (value, not pointer)
    
public:
    Car() : engine() {}  // Engine created with Car
};

// Alternative with unique_ptr for explicit ownership
class CarWithPointer {
private:
    std::unique_ptr<Engine> engine;  // Composition with smart pointer

public:
    CarWithPointer() : engine(std::make_unique<Engine>()) {}
};
```

## 💡 Best Practices

1. **Choose the Right Relationship**

   **Java:**
   ```java
   // Association - Teacher teaches Student
   class Teacher {
       private List<Student> students;
   }
   
   // Aggregation - Library has Books
   class Library {
       private List<Book> books;  // Books can exist without Library
   }
   
   // Composition - House has Rooms
   class House {
       private final List<Room> rooms;  // Rooms cannot exist without House
       
       public House() {
           rooms = new ArrayList<>();
           rooms.add(new Room("Living Room"));
           rooms.add(new Room("Bedroom"));
       }
   }
   ```

   **Python:**
   ```python
   # Association - Teacher teaches Student
   class Teacher:
       def __init__(self):
           self._students: List[Student] = []
   
   # Aggregation - Library has Books
   class Library:
       def __init__(self):
           self._books: List[Book] = []  # Books can exist without Library
   
   # Composition - House has Rooms
   class House:
       def __init__(self):
           self._rooms: List[Room] = [  # Rooms cannot exist without House
               Room("Living Room"),
               Room("Bedroom")
           ]
   ```

   **C++:**
   ```cpp
   // Association - Teacher teaches Student
   class Teacher {
   private:
       std::vector<Student*> students;
   };
   
   // Aggregation - Library has Books (raw pointers - no ownership)
   class Library {
   private:
       std::vector<Book*> books;  // Books can exist without Library
   };
   
   // Composition - House has Rooms (unique_ptr - full ownership)
   class House {
   private:
       std::vector<std::unique_ptr<Room>> rooms;  // Rooms cannot exist without House
       
   public:
       House() {
           rooms.push_back(std::make_unique<Room>("Living Room"));
           rooms.push_back(std::make_unique<Room>("Bedroom"));
       }
   };
   ```

2. **Use Interfaces for Loose Coupling**

   **Java:**
   ```java
   // Interface for payment methods
   interface PaymentMethod {
       void processPayment(double amount);
   }
   
   // Different implementations
   class CreditCard implements PaymentMethod {
       @Override
       public void processPayment(double amount) { }
   }
   
   class PayPal implements PaymentMethod {
       @Override
       public void processPayment(double amount) { }
   }
   
   // Order uses payment method through interface
   class Order {
       private PaymentMethod paymentMethod;  // Loose coupling
   }
   ```

   **Python:**
   ```python
   from abc import ABC, abstractmethod

   # Interface for payment methods
   class PaymentMethod(ABC):
       @abstractmethod
       def process_payment(self, amount: float):
           pass
   
   # Different implementations
   class CreditCard(PaymentMethod):
       def process_payment(self, amount: float):
           pass
   
   class PayPal(PaymentMethod):
       def process_payment(self, amount: float):
           pass
   
   # Order uses payment method through interface
   class Order:
       def __init__(self, payment_method: PaymentMethod):
           self._payment_method = payment_method  # Loose coupling
   ```

   **C++:**
   ```cpp
   // Interface for payment methods
   class PaymentMethod {
   public:
       virtual void processPayment(double amount) = 0;
       virtual ~PaymentMethod() = default;
   };
   
   // Different implementations
   class CreditCard : public PaymentMethod {
   public:
       void processPayment(double amount) override { }
   };
   
   class PayPal : public PaymentMethod {
   public:
       void processPayment(double amount) override { }
   };
   
   // Order uses payment method through interface
   class Order {
   private:
       std::unique_ptr<PaymentMethod> paymentMethod;  // Loose coupling
   };
   ```

3. **Clear Ownership and Lifecycle Management**

   **Java:**
   ```java
   // Clear ownership with composition
   public class Document {
       private final List<Page> pages;
       
       public Document() {
           pages = new ArrayList<>();
       }
       
       public void addPage(String content) {
           pages.add(new Page(content));
       }
       
       // Pages are managed by Document
       private class Page {
           private String content;
           
           Page(String content) {
               this.content = content;
           }
       }
   }
   ```

   **Python:**
   ```python
   # Clear ownership with composition
   class Document:
       class Page:
           def __init__(self, content: str):
               self._content = content
       
       def __init__(self):
           self._pages: List[Document.Page] = []
       
       def add_page(self, content: str):
           self._pages.append(Document.Page(content))
       # Pages are managed by Document
   ```

   **C++:**
   ```cpp
   // Clear ownership with composition
   class Document {
   private:
       class Page {
       private:
           std::string content;
       public:
           Page(const std::string& content) : content(content) {}
       };
       
       std::vector<std::unique_ptr<Page>> pages;  // Pages are managed by Document
       
   public:
       Document() = default;
       
       void addPage(const std::string& content) {
           pages.push_back(std::make_unique<Page>(content));
       }
   };
   ```

## ⚠️ Common Pitfalls

1. **Circular Dependencies**

   **Java:**
   ```java
   // Bad - circular dependency
   class A {
       private B b;
   }
   
   class B {
       private A a;  // Creates circular dependency
   }
   
   // Better - use interfaces or restructure
   interface AInterface {
       void doSomething();
   }
   
   class A implements AInterface {
       private B b;
   }
   
   class B {
       private AInterface a;  // Depends on interface
   }
   ```

   **Python:**
   ```python
   # Bad - circular dependency
   class A:
       def __init__(self, b: 'B'):
           self.b = b
   
   class B:
       def __init__(self, a: A):
           self.a = a  # Creates circular dependency
   
   # Better - use interfaces or restructure
   class AInterface(ABC):
       @abstractmethod
       def do_something(self): pass
   
   class A(AInterface):
       def __init__(self, b: 'B'):
           self.b = b
       def do_something(self): pass
   
   class B:
       def __init__(self, a: AInterface):
           self.a = a  # Depends on interface
   ```

   **C++:**
   ```cpp
   // Bad - circular dependency
   class B;  // Forward declaration needed
   class A {
       B* b;
   };
   
   class B {
       A* a;  // Creates circular dependency
   };
   
   // Better - use interfaces or restructure
   class AInterface {
   public:
       virtual void doSomething() = 0;
       virtual ~AInterface() = default;
   };
   
   class B;
   class A : public AInterface {
       B* b;
   public:
       void doSomething() override {}
   };
   
   class B {
       AInterface* a;  // Depends on interface
   };
   ```

2. **Strong Coupling**

   **Java:**
   ```java
   // Bad - strongly coupled
   class ShoppingCart {
       private CreditCardPayment payment;  // Specific implementation
   }
   
   // Better - loosely coupled
   class ShoppingCart {
       private PaymentMethod payment;  // Interface
   }
   ```

   **Python:**
   ```python
   # Bad - strongly coupled
   class ShoppingCart:
       def __init__(self):
           self._payment = CreditCardPayment()  # Specific implementation
   
   # Better - loosely coupled
   class ShoppingCart:
       def __init__(self, payment: PaymentMethod):
           self._payment = payment  # Interface
   ```

   **C++:**
   ```cpp
   // Bad - strongly coupled
   class ShoppingCart {
   private:
       CreditCardPayment payment;  // Specific implementation
   };
   
   // Better - loosely coupled
   class ShoppingCart {
   private:
       std::unique_ptr<PaymentMethod> payment;  // Interface
   };
   ```

3. **Memory Leaks in Bidirectional Relationships**

   **Java:**
   ```java
   // Potential memory leak
   class Parent {
       private List<Child> children = new ArrayList<>();
       
       public void addChild(Child child) {
           children.add(child);
           child.setParent(this);  // Bidirectional reference
       }
   }
   
   class Child {
       private Parent parent;
       
       public void setParent(Parent parent) {
           this.parent = parent;
       }
   }
   ```

   **Python:**
   ```python
   import weakref

   # Potential memory leak with circular references
   class Parent:
       def __init__(self):
           self._children: List[Child] = []
       
       def add_child(self, child: 'Child'):
           self._children.append(child)
           child.set_parent(self)  # Bidirectional reference
   
   class Child:
       def __init__(self):
           self._parent = None
       
       def set_parent(self, parent: Parent):
           self._parent = parent
   
   # Better - use weakref to break cycle
   class ChildWithWeakRef:
       def __init__(self):
           self._parent_ref = None
       
       def set_parent(self, parent: Parent):
           self._parent_ref = weakref.ref(parent)
   ```

   **C++:**
   ```cpp
   #include <memory>
   #include <vector>

   // Potential memory leak with shared_ptr cycles
   class Child;
   class Parent {
   public:
       std::vector<std::shared_ptr<Child>> children;
       
       void addChild(std::shared_ptr<Child> child);
   };
   
   class Child {
   public:
       std::shared_ptr<Parent> parent;  // Creates cycle!
       
       void setParent(std::shared_ptr<Parent> p) {
           parent = p;
       }
   };
   
   // Better - use weak_ptr to break cycle
   class ChildFixed {
   public:
       std::weak_ptr<Parent> parent;  // Breaks cycle
       
       void setParent(std::shared_ptr<Parent> p) {
           parent = p;
       }
   };
   ```

## 🎯 Interview Questions

1. **What's the difference between aggregation and composition?**

   **Java:**
   ```java
   // Aggregation - car has a driver
   class Car {
       private Driver driver;  // Driver can exist without car
   }
   
   // Composition - car has an engine
   class Car {
       private final Engine engine;  // Engine cannot exist without car
   }
   ```

   **Python:**
   ```python
   # Aggregation - car has a driver
   class Car:
       def __init__(self, driver: Driver):
           self._driver = driver  # Driver can exist without car
   
   # Composition - car has an engine
   class Car:
       def __init__(self):
           self._engine = Engine()  # Engine created with car, cannot exist without
   ```

   **C++:**
   ```cpp
   // Aggregation - car has a driver (raw pointer or shared_ptr)
   class Car {
       Driver* driver;  // Driver can exist without car
   };
   
   // Composition - car has an engine (value or unique_ptr)
   class Car {
       Engine engine;  // Engine cannot exist without car
       // or: std::unique_ptr<Engine> engine;
   };
   ```

2. **How do you implement a many-to-many relationship?**

   **Java:**
   ```java
   class Student {
       private List<Course> courses;
       
       public void enrollCourse(Course course) {
           courses.add(course);
           course.addStudent(this);
       }
   }
   
   class Course {
       private List<Student> students;
       
       public void addStudent(Student student) {
           students.add(student);
       }
   }
   ```

   **Python:**
   ```python
   class Student:
       def __init__(self):
           self._courses: List['Course'] = []
       
       def enroll_course(self, course: 'Course'):
           self._courses.append(course)
           course.add_student(self)
   
   class Course:
       def __init__(self):
           self._students: List[Student] = []
       
       def add_student(self, student: Student):
           self._students.append(student)
   ```

   **C++:**
   ```cpp
   class Course;

   class Student {
   private:
       std::vector<Course*> courses;
   
   public:
       void enrollCourse(Course* course);
   };
   
   class Course {
   private:
       std::vector<Student*> students;
   
   public:
       void addStudent(Student* student) {
           students.push_back(student);
       }
   };
   
   void Student::enrollCourse(Course* course) {
       courses.push_back(course);
       course->addStudent(this);
   }
   ```

3. **When should you use composition over inheritance?**

   **Java:**
   ```java
   // Inheritance - might be problematic
   class Stack extends ArrayList<String> { }
   
   // Composition - better approach
   class Stack {
       private List<String> elements = new ArrayList<>();
       
       public void push(String item) {
           elements.add(item);
       }
   }
   ```

   **Python:**
   ```python
   # Inheritance - might be problematic
   class Stack(list):
       pass
   
   # Composition - better approach
   class Stack:
       def __init__(self):
           self._elements: List[str] = []
       
       def push(self, item: str):
           self._elements.append(item)
       
       def pop(self) -> str:
           return self._elements.pop()
   ```

   **C++:**
   ```cpp
   // Inheritance - might be problematic
   class Stack : public std::vector<std::string> { };
   
   // Composition - better approach
   class Stack {
   private:
       std::vector<std::string> elements;
       
   public:
       void push(const std::string& item) {
           elements.push_back(item);
       }
       
       std::string pop() {
           std::string item = elements.back();
           elements.pop_back();
           return item;
       }
   };
   ```

## 💻 Practice Exercise

Create a school management system demonstrating different relationships:

**Java:**
```java
// School system with different relationships
public class School {
    private final List<Department> departments;  // Composition
    private List<Student> students;             // Association
    private Address address;                    // Aggregation
    
    public School(String name, Address address) {
        this.departments = new ArrayList<>();
        this.students = new ArrayList<>();
        this.address = address;
    }
    
    public void addDepartment(String name) {
        departments.add(new Department(name));
    }
    
    public void enrollStudent(Student student) {
        students.add(student);
    }
}

public class Department {
    private final String name;
    private List<Teacher> teachers;
    private List<Course> courses;
    
    public Department(String name) {
        this.name = name;
        this.teachers = new ArrayList<>();
        this.courses = new ArrayList<>();
    }
    
    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
    }
    
    public void addCourse(Course course) {
        courses.add(course);
    }
}

public class Course {
    private String name;
    private Teacher teacher;
    private List<Student> enrolledStudents;
    
    public Course(String name, Teacher teacher) {
        this.name = name;
        this.teacher = teacher;
        this.enrolledStudents = new ArrayList<>();
    }
    
    public void enrollStudent(Student student) {
        enrolledStudents.add(student);
        student.addCourse(this);
    }
}

public class Student {
    private String name;
    private List<Course> courses;
    
    public Student(String name) {
        this.name = name;
        this.courses = new ArrayList<>();
    }
    
    public void addCourse(Course course) {
        courses.add(course);
    }
}

public class Teacher {
    private String name;
    private List<Course> coursesTeaching;
    
    public Teacher(String name) {
        this.name = name;
        this.coursesTeaching = new ArrayList<>();
    }
    
    public void assignCourse(Course course) {
        coursesTeaching.add(course);
    }
}

public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    
    public Address(String street, String city, String state, String zipCode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }
}

// Usage example
public class SchoolManagementSystem {
    public static void main(String[] args) {
        Address schoolAddress = new Address("123 Education St", "Learning City", "ED", "12345");
        School school = new School("Tech High", schoolAddress);
        
        // Create departments
        school.addDepartment("Computer Science");
        school.addDepartment("Mathematics");
        
        // Create and enroll students
        Student student1 = new Student("John Doe");
        Student student2 = new Student("Jane Smith");
        school.enrollStudent(student1);
        school.enrollStudent(student2);
        
        // Create teachers and courses
        Teacher teacher = new Teacher("Prof. Anderson");
        Course javaCourse = new Course("Java Programming", teacher);
        
        // Enroll students in course
        javaCourse.enrollStudent(student1);
        javaCourse.enrollStudent(student2);
    }
}
```

**Python:**
```python
from typing import List

class Address:
    def __init__(self, street: str, city: str, state: str, zip_code: str):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code

class Student:
    def __init__(self, name: str):
        self._name = name
        self._courses: List['Course'] = []
    
    def add_course(self, course: 'Course'):
        self._courses.append(course)

class Teacher:
    def __init__(self, name: str):
        self._name = name
        self._courses_teaching: List['Course'] = []
    
    def assign_course(self, course: 'Course'):
        self._courses_teaching.append(course)

class Course:
    def __init__(self, name: str, teacher: Teacher):
        self._name = name
        self._teacher = teacher
        self._enrolled_students: List[Student] = []
    
    def enroll_student(self, student: Student):
        self._enrolled_students.append(student)
        student.add_course(self)

class Department:
    def __init__(self, name: str):
        self._name = name
        self._teachers: List[Teacher] = []
        self._courses: List[Course] = []
    
    def add_teacher(self, teacher: Teacher):
        self._teachers.append(teacher)
    
    def add_course(self, course: Course):
        self._courses.append(course)

class School:
    def __init__(self, name: str, address: Address):
        self._name = name
        self._departments: List[Department] = []  # Composition
        self._students: List[Student] = []         # Association
        self._address = address                    # Aggregation
    
    def add_department(self, name: str):
        self._departments.append(Department(name))
    
    def enroll_student(self, student: Student):
        self._students.append(student)

# Usage example
if __name__ == "__main__":
    school_address = Address("123 Education St", "Learning City", "ED", "12345")
    school = School("Tech High", school_address)
    
    # Create departments
    school.add_department("Computer Science")
    school.add_department("Mathematics")
    
    # Create and enroll students
    student1 = Student("John Doe")
    student2 = Student("Jane Smith")
    school.enroll_student(student1)
    school.enroll_student(student2)
    
    # Create teachers and courses
    teacher = Teacher("Prof. Anderson")
    java_course = Course("Java Programming", teacher)
    
    # Enroll students in course
    java_course.enroll_student(student1)
    java_course.enroll_student(student2)
```

**C++:**
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Address {
private:
    std::string street, city, state, zipCode;

public:
    Address(const std::string& street, const std::string& city, 
            const std::string& state, const std::string& zipCode)
        : street(street), city(city), state(state), zipCode(zipCode) {}
};

class Course;

class Student {
private:
    std::string name;
    std::vector<Course*> courses;

public:
    Student(const std::string& name) : name(name) {}
    void addCourse(Course* course) { courses.push_back(course); }
    const std::string& getName() const { return name; }
};

class Teacher {
private:
    std::string name;
    std::vector<Course*> coursesTeaching;

public:
    Teacher(const std::string& name) : name(name) {}
    void assignCourse(Course* course) { coursesTeaching.push_back(course); }
};

class Course {
private:
    std::string name;
    Teacher* teacher;
    std::vector<Student*> enrolledStudents;

public:
    Course(const std::string& name, Teacher* teacher) : name(name), teacher(teacher) {}
    
    void enrollStudent(Student* student) {
        enrolledStudents.push_back(student);
        student->addCourse(this);
    }
};

class Department {
private:
    std::string name;
    std::vector<Teacher*> teachers;
    std::vector<Course*> courses;

public:
    Department(const std::string& name) : name(name) {}
    void addTeacher(Teacher* teacher) { teachers.push_back(teacher); }
    void addCourse(Course* course) { courses.push_back(course); }
};

class School {
private:
    std::string name;
    std::vector<std::unique_ptr<Department>> departments;  // Composition
    std::vector<Student*> students;                        // Association
    Address* address;                                      // Aggregation

public:
    School(const std::string& name, Address* address) 
        : name(name), address(address) {}
    
    void addDepartment(const std::string& deptName) {
        departments.push_back(std::make_unique<Department>(deptName));
    }
    
    void enrollStudent(Student* student) {
        students.push_back(student);
    }
};

// Usage example
int main() {
    Address schoolAddress("123 Education St", "Learning City", "ED", "12345");
    School school("Tech High", &schoolAddress);
    
    // Create departments
    school.addDepartment("Computer Science");
    school.addDepartment("Mathematics");
    
    // Create and enroll students
    Student student1("John Doe");
    Student student2("Jane Smith");
    school.enrollStudent(&student1);
    school.enrollStudent(&student2);
    
    // Create teachers and courses
    Teacher teacher("Prof. Anderson");
    Course javaCourse("Java Programming", &teacher);
    
    // Enroll students in course
    javaCourse.enrollStudent(&student1);
    javaCourse.enrollStudent(&student2);
    
    return 0;
}
```

## ❓ Frequently Asked Questions

### Q1: What's the difference between Association, Aggregation, and Composition?
**A:**
| Relationship | Ownership | Lifecycle | Example |
|-------------|-----------|-----------|---------|
| Association | None | Independent | Student ↔ Teacher |
| Aggregation | Weak | Independent | Team → Players |
| Composition | Strong | Dependent | House → Rooms |

### Q2: How do I decide between aggregation and composition?
**A:** Ask: "Can the part exist without the whole?"
- **Yes → Aggregation:** `Car` has `Driver` (driver exists without car)
- **No → Composition:** `Car` has `Engine` (engine doesn't exist independently)
- **Rule:** If deleting container should delete parts, use composition

### Q3: What's "favor composition over inheritance"?
**A:** Design principle suggesting:
- Use "has-a" relationships more than "is-a"
- More flexible - can change behavior at runtime
- Avoids fragile base class problem
- Easier to understand and test
- Example: Instead of `Bird extends FlyingThing`, use `Bird` has `FlyingBehavior`

### Q4: What is dependency?
**A:** The weakest relationship - one class uses another:
```java
class OrderService {
    void process(PaymentGateway gateway) { // Dependency
        gateway.charge();
    }
}
```
- Temporary relationship (method parameter, local variable)
- No ownership or lifecycle connection
- Often shown as dashed arrow in UML

### Q5: What are bidirectional vs unidirectional relationships?
**A:**
| Unidirectional | Bidirectional |
|----------------|---------------|
| A knows B, B doesn't know A | A knows B, B knows A |
| Simpler to implement | More complex |
| Easier to maintain | Requires careful sync |
| Preferred when possible | Use when both sides need navigation |

### Q6: How do I implement a many-to-many relationship?
**A:** Options:
1. **Direct:** Each side has collection of other
2. **Association class:** Create intermediate class with extra data
3. **Join entity:** For databases, mirrors join table

```java
// Direct approach
class Student { List<Course> courses; }
class Course { List<Student> students; }

// Association class (when relationship has attributes)
class Enrollment {
    Student student;
    Course course;
    Date enrollmentDate;
    String grade;
}
```

### Q7: What's the relationship between composition and encapsulation?
**A:** They work together:
- Composition creates "has-a" relationships
- Encapsulation hides internal components
- Parts are typically private
- Access through container's methods
- Together they create modular, maintainable code

## 📚 Additional Resources

1. [UML Class Diagram Relationships](https://www.uml-diagrams.org/association.html)
2. [Design Patterns - Structural Patterns](https://refactoring.guru/design-patterns/structural-patterns)
3. [Clean Code - Chapter 10: Classes](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) 