# 🧩 LLD Solutions — Machine Coding Problems

> Complete, interview-ready designs for the classic Low-Level Design problems asked at Google, Microsoft, Uber, Flipkart, Swiggy, and Amazon.

Most LLD resources stop at class diagrams. **Every solution here goes all the way: requirements → design → full runnable Java implementation → edge cases → follow-up questions** — the exact arc of a 45-minute machine coding round.

---

## 📖 How Each Solution Is Structured

Every solution follows the same template, so you can practice systematically:

| Section | What It Teaches |
|---------|----------------|
| 📋 Requirements & Clarifications | The questions you MUST ask before designing |
| 🎯 Core Entities | Nouns → classes, verbs → methods |
| 🧩 Design Approach | Which patterns/principles apply and *why* |
| 📊 Class Diagram | Mermaid diagram — visual mental model |
| 💻 Complete Implementation | Runnable Java, not pseudocode |
| ⚠️ Edge Cases & Pitfalls | Where candidates lose points |
| ❓ Follow-up Questions | The "what if" round, answered |

---

## 📚 Problem Index

| # | Problem | Difficulty | Key Concepts | Status |
|---|---------|------------|--------------|--------|
| 1 | [🚗 Parking Lot](parking-lot.md) | 🟢 Easy | Singleton, Strategy, Enums, concurrency basics | ✅ Done |
| 2 | [🎲 Snake and Ladder](snake-and-ladder.md) | 🟢 Easy | Board modeling, rules engine, simulation | ✅ Done |
| 3 | [💰 Splitwise](splitwise.md) | 🟡 Medium | Strategy, Builder, ledger design, debt simplification | ✅ Done |
| 4 | [🛗 Elevator System](elevator-system.md) | 🟡 Medium | State machines, scheduling (SCAN), Mediator | ✅ Done |
| 5 | [🎟️ BookMyShow](bookmyshow.md) | 🔴 Hard | Seat locking, TTL, double-booking prevention, concurrency | ✅ Done |
| 6 | [🥤 Vending Machine](vending-machine.md) | 🟢 Easy | State pattern, change making, guard rails | ✅ Done |
| 7 | [⭕ Tic-Tac-Toe](tic-tac-toe.md) | 🟢 Easy | O(1) win detection, pluggable move strategies | ✅ Done |
| 8 | [🗃️ LRU Cache](lru-cache.md) | 🟢 Easy | HashMap + doubly linked list, O(1) get/put | ✅ Done |
| 9 | [☕ Coffee Vending Machine](coffee-vending-machine.md) | 🟡 Medium | Recipe-as-data, atomic inventory, Observer alerts | ✅ Done |
| 10 | Chess | 🟡 Medium | Piece hierarchy, move validation | 🚧 Planned |
| 11 | Cricinfo / Cricket Scorecard | 🟡 Medium | Observer, event streaming | 🚧 Planned |
| 12 | Car Rental System | 🟡 Medium | Reservation, pricing | 🚧 Planned |
| 13 | Stack Overflow | 🟡 Medium | Social graph, badges, search | 🚧 Planned |
| 14 | LinkedIn / Social Network | 🟡 Medium | Feed, connections, notifications | 🚧 Planned |
| 15 | Airbnb / Hotel Booking | 🟡 Medium | Search filters, booking, payments | 🚧 Planned |
| 16 | Amazon / Online Shopping | 🔴 Hard | Cart, orders, inventory, payments | 🚧 Planned |
| 17 | Uber / Cab Booking | 🔴 Hard | Matching, location, pricing surge | 🚧 Planned |
| 18 | Rate Limiter | 🔴 Hard | Token bucket, sliding window | 🚧 Planned |

> 🤝 Want to claim a 🚧 problem? Read the [Contribution Guidelines](../CONTRIBUTING.md) and open a PR — follow the template above exactly.

---

## 🗺️ Recommended Practice Order

```
Week 1:  Parking Lot  →  Snake and Ladder      (build confidence, 25-min solves)
Week 2:  Vending Machine  →  LRU Cache  →  Tic-Tac-Toe
Week 3:  Splitwise  →  Elevator System          (strategy-heavy, 35-min solves)
Week 4:  Chess  →  Car Rental
Week 5+: BookMyShow  →  Uber  →  Amazon        (full 45-min interview simulations)
```

---

## ⏱️ How to Use This in a Real Interview

1. **Minutes 0–5:** Restate requirements, ask the clarification questions listed in each solution. Skipping this is the #1 rejection reason.
2. **Minutes 5–12:** Identify entities and relationships. Sketch the class diagram *on paper first*.
3. **Minutes 12–35:** Code. Use the patterns only where they earn their keep — interviewers penalize over-engineering.
4. **Minutes 35–45:** Walk through edge cases and trade-offs *out loud* while finishing code.

**Golden rule:** a working simple design beats a broken clever one. Add extensibility via follow-up answers, not speculative code.

---

## 🔗 Related Handbook Sections

- [OOD Basics](../ood-basics/README.md) — the vocabulary used in every solution
- [SOLID Principles](../solid-principles/README.md) — *why* the designs are shaped this way
- [Design Patterns](../design-patterns/README.md) — pattern-by-pattern deep dives
- [Best Practices](../best-practices/README.md) — clean code and error handling standards
- [LLD Cheatsheet](../cheatsheet.md) — one-page revision before the interview
