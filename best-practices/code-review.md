# Code Review Guidelines

## Table of Contents
- [Introduction](#introduction)
- [Code Review Principles](#code-review-principles)
- [What to Look For](#what-to-look-for)
- [How to Give Feedback](#how-to-give-feedback)
- [How to Receive Feedback](#how-to-receive-feedback)
- [Code Review Checklist](#code-review-checklist)
- [Best Practices](#best-practices)

## 📚 Prerequisites & Learning Path

### Prerequisites
To effectively review code, you should understand:
- [Clean Code Guidelines](clean-code.md) - What makes code clean
- [SOLID Principles](../solid-principles/srp.md) - Design principles to look for
- [Design Patterns](../design-patterns/README.md) - Pattern recognition
- [Error Handling](error-handling.md) - Proper exception handling
- [Testing](testing.md) - Test coverage expectations

### When to Study This
Code review skills are **essential for interviews** and professional work:
- Study after understanding OOD Basics and SOLID
- Practice reviewing your own code first
- Apply during interview mock sessions

### How This Relates to Interviews
| Interview Aspect | How Code Review Helps |
|-----------------|----------------------|
| Design discussions | Articulate design trade-offs |
| Code quality | Explain clean code principles |
| Communication | Practice giving constructive feedback |
| System design | Identify patterns and anti-patterns |

### How This Fits in the Big Picture
```
Technical Skills: OOD → SOLID → Patterns → Clean Code
                                              ↓
Soft Skills:                           Code Review
                                              ↓
                              Combine both for interview success
```

## Introduction

Code reviews are a systematic examination of code changes to improve code quality, share knowledge, and ensure consistency across the codebase. This guide provides best practices for both reviewers and authors.

## Code Review Principles

### Core Values
1. **Respect** - Treat all code and comments with respect
2. **Constructive** - Focus on improvement, not criticism
3. **Educational** - Use reviews as learning opportunities
4. **Timely** - Review code promptly to maintain momentum

### Goals
- Catch bugs early
- Ensure code quality
- Share knowledge
- Maintain consistency
- Improve team collaboration

## What to Look For

### 1. Code Quality
- Clean and readable code
- Proper naming conventions
- Code organization
- Documentation quality
- Test coverage

### 2. Functionality
- Correctness
- Edge cases
- Error handling
- Performance considerations
- Security implications

### 3. Design
- SOLID principles
- Design patterns
- Architecture consistency
- Code reusability
- Maintainability

### 4. Testing
- Test coverage
- Test quality
- Edge cases covered
- Integration tests
- Performance tests

## How to Give Feedback

### Do's
```markdown
✅ Be specific and actionable
✅ Explain the reasoning
✅ Provide examples
✅ Use a friendly tone
✅ Acknowledge good practices

// Good feedback example
"Consider extracting this validation logic into a separate method to improve reusability and make the code more maintainable. Here's an example:
```java
private boolean isValidUser(User user) {
    return user != null && user.getName() != null && !user.getName().isEmpty();
}
```"
```

### Don'ts
```markdown
❌ Make personal comments
❌ Be vague
❌ Be condescending
❌ Nitpick unnecessarily
❌ Rewrite code without explanation

// Bad feedback example
"This code is messy. Fix it."
```

## How to Receive Feedback

### Best Practices
1. **Be Open-minded**
   - Consider all feedback objectively
   - Don't take criticism personally
   - View feedback as learning opportunities

2. **Ask Questions**
   - Seek clarification when needed
   - Understand the reasoning
   - Discuss alternatives

3. **Respond Promptly**
   - Acknowledge feedback
   - Address all comments
   - Update code timely

## Code Review Checklist

### General
- [ ] Code follows style guide
- [ ] No unnecessary comments
- [ ] No debug code left
- [ ] Proper error handling
- [ ] Logging is appropriate

### Security
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] Secure data handling
- [ ] No sensitive data exposure
- [ ] SQL injection prevention

### Performance
- [ ] Efficient algorithms
- [ ] Proper resource usage
- [ ] No memory leaks
- [ ] Database query optimization
- [ ] Caching strategy

### Testing
- [ ] Unit tests added
- [ ] Integration tests updated
- [ ] Edge cases covered
- [ ] Test naming is clear
- [ ] Mocks used appropriately

## Best Practices

### 1. Size and Scope
```markdown
✅ Keep PRs small and focused
✅ Review regularly in small batches
✅ Set a time limit for review sessions
✅ Take breaks between reviews
```

### 2. Communication
```markdown
✅ Use clear and professional language
✅ Provide context for changes
✅ Document decisions and trade-offs
✅ Follow up on resolved comments
```

### 3. Tools and Automation
```markdown
✅ Use automated code review tools
✅ Leverage linters and formatters
✅ Implement CI/CD checks
✅ Use code review platforms effectively
```

### Example Review Process

```mermaid
graph TD
    A[Code Submission] --> B[Automated Checks]
    B --> C{Checks Pass?}
    C -->|No| D[Fix Issues]
    D --> A
    C -->|Yes| E[Manual Review]
    E --> F{Changes Needed?}
    F -->|Yes| G[Address Feedback]
    G --> A
    F -->|No| H[Approve & Merge]
```

## ❓ Frequently Asked Questions

### Q1: How long should a code review take?
**A:** Guidelines:
| PR Size | Review Time |
|---------|-------------|
| < 200 lines | 15-30 minutes |
| 200-400 lines | 30-60 minutes |
| > 400 lines | Consider splitting |

**Tip:** Keep PRs small for faster, better reviews.

### Q2: What should I prioritize in a review?
**A:** Review in this order:
1. **Correctness** - Does it work? Edge cases?
2. **Security** - Vulnerabilities? Input validation?
3. **Design** - SOLID principles? Patterns?
4. **Performance** - Obvious issues?
5. **Style** - Should be automated (linters)

### Q3: How do I give negative feedback constructively?
**A:** Use these techniques:
- Ask questions: "Have you considered...?"
- Explain reasoning: "This might cause X because..."
- Offer alternatives: "What about...?"
- Be specific: Point to exact code
- Praise good parts first

### Q4: How do I handle disagreements in reviews?
**A:**
1. Assume good intent
2. Focus on code, not person
3. Back up with evidence (docs, examples)
4. Know when to compromise
5. Escalate only if necessary
6. "Disagree and commit" if needed

### Q5: Should I review my own code first?
**A:** Yes! Self-review checklist:
- [ ] Code compiles and passes tests
- [ ] Removed debug code and TODOs
- [ ] Added/updated tests
- [ ] Documentation updated
- [ ] No sensitive data
- [ ] Follows team conventions

### Q6: How do I review code I'm unfamiliar with?
**A:**
1. Read PR description thoroughly
2. Check linked issues/tickets
3. Focus on general principles
4. Ask questions (learning opportunity!)
5. Request context from author
6. Review tests to understand intent

### Q7: What's the difference between "Request Changes" and "Comment"?
**A:**
| Request Changes | Comment/Suggestion |
|-----------------|-------------------|
| Must be fixed before merge | Nice to have |
| Blocking issues | Minor improvements |
| Bugs, security issues | Style preferences |
| Design problems | Alternative approaches |

## Additional Resources
- [Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [Code Review Best Practices by Thoughtbot](https://github.com/thoughtbot/guides/tree/master/code-review)
- [Code Review Checklist by NASA](https://sw-assurance.gsfc.nasa.gov/disciplines/quality/guidance/code_reviews.php) 