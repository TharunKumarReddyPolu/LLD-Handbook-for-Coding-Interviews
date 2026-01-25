# LLD Interview Questions 💻

This section contains a curated collection of Low Level Design interview questions, organized by difficulty level to help you progressively build your skills.

## 📚 Prerequisites & Learning Path

### Before Starting Interview Practice
Ensure you have a solid foundation in:
- [OOD Basics](../ood-basics/README.md) - All four pillars of OOP
- [SOLID Principles](../solid-principles/README.md) - Design guidelines
- [Design Patterns](../design-patterns/README.md) - At least core patterns

### Recommended Progression
```
1. Easy Questions (1-2 weeks)
   - Basic OOP application
   - Simple patterns: Singleton, Factory, Strategy
         ↓
2. Medium Questions (2-3 weeks)
   - Complex patterns
   - Concurrency basics
   - Multiple components
         ↓
3. Hard Questions (3-4 weeks)
   - Distributed systems concepts
   - Advanced patterns
   - System architecture
```

## 📋 Question Categories

### [Easy Questions](easy/README.md)
Entry-level problems focusing on basic OOP and simple design patterns.

**Examples:**
- Design a Logger
- Design a Calculator
- Design a File System
- Design a Parking Lot
- Design a Vending Machine

**Focus Areas:**
- Clean class design
- Basic SOLID application
- Simple pattern usage
- Core OOP concepts

---

### [Medium Questions](medium/README.md)
Intermediate problems involving complex patterns and system interactions.

**Examples:**
- Design a Task Scheduler
- Design a Cache System
- Design a Rate Limiter
- Design a Message Queue
- Design a Connection Pool

**Focus Areas:**
- Multiple design patterns
- Concurrency considerations
- Error handling
- Extensibility

---

### [Hard Questions](hard/README.md)
Advanced problems involving distributed systems and complex architecture.

**Examples:**
- Design a Distributed Job Scheduler
- Design a Distributed Lock Service
- Design a Distributed Cache
- Design a Notification Service
- Design a Configuration Management System

**Focus Areas:**
- Distributed coordination
- Fault tolerance
- Scalability
- Leader election
- Consensus mechanisms

---

## 🎯 Difficulty Comparison

| Aspect | Easy | Medium | Hard |
|--------|------|--------|------|
| **Components** | 3-5 classes | 5-10 classes | 10+ classes |
| **Patterns** | 1-2 patterns | 3-5 patterns | 5+ patterns |
| **Concurrency** | Basic/None | Thread safety | Distributed |
| **Time in Interview** | 20-30 min | 30-45 min | 45-60 min |
| **Typical Level** | Junior | Mid-level | Senior |

## 🚀 Interview Approach

### General Framework
```
1. Clarify Requirements (5-10% of time)
   - Ask questions
   - State assumptions
   - Define scope
         ↓
2. High-Level Design (15-20% of time)
   - Identify main components
   - Define relationships
   - Sketch class diagram
         ↓
3. Detailed Design (50-60% of time)
   - Define interfaces
   - Implement core classes
   - Apply patterns
         ↓
4. Review & Extend (15-20% of time)
   - Discuss trade-offs
   - Handle edge cases
   - Suggest improvements
```

### Tips by Difficulty

#### Easy Questions
- Focus on clean, simple solutions
- Don't over-engineer
- Apply basic patterns naturally
- Show understanding of OOP

#### Medium Questions
- Think about thread safety early
- Use patterns appropriately
- Consider error handling
- Discuss extensibility

#### Hard Questions
- Clarify distributed requirements
- Address failure scenarios
- Show awareness of CAP theorem
- Discuss monitoring/observability

## ❓ Frequently Asked Questions

### Q1: How many questions should I practice?
**A:** Quality over quantity:
- Easy: 5-10 problems (understand patterns)
- Medium: 10-15 problems (build confidence)
- Hard: 5-10 problems (if targeting senior roles)

### Q2: Should I memorize solutions?
**A:** No, focus on:
- Understanding the approach
- Recognizing patterns
- Building problem-solving skills
- Being able to adapt to variations

### Q3: How do I handle a problem I've never seen?
**A:** Use your framework:
1. Start with requirements
2. Identify nouns (classes) and verbs (methods)
3. Apply familiar patterns
4. Iterate and improve

### Q4: What if I get stuck?
**A:** 
- Talk through your thinking
- Ask clarifying questions
- Start with what you know
- The interviewer may give hints

### Q5: How important is working code vs design?
**A:** Both matter, but:
- Design shows thinking process
- Code shows implementation skills
- Clean structure > complete code
- Explain what you'd add if more time

### Q6: Should I use a specific language?
**A:** Use what you're comfortable with:
- Most interviewers accept any mainstream language
- Be fluent in your chosen language
- Know language-specific patterns/idioms
- Ask if there's a preference

## 📚 Additional Resources

- [LLD Cheatsheet](../cheatsheet.md) - Quick reference
- [Design Patterns](../design-patterns/README.md) - Pattern catalog
- [Best Practices](../best-practices/README.md) - Code quality guidelines
