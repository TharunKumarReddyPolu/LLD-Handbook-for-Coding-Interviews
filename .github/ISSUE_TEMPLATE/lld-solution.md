---
name: 🧩 New LLD solution
about: Claim or contribute one of the planned machine-coding problems
title: "[LLD Solution] "
labels: ["good first issue", "enhancement"]
assignees: ""
---

Thanks for contributing to the LLD Handbook! 🎉

## Which problem are you taking on?

Check the [solutions index](../blob/main/solutions/README.md) for the planned problems (marked 🚧). Comment below to claim one — e.g.:

> I'd like to work on **Design Chess**.

## What a complete solution looks like

Every solution follows the same 7-part template (see [solutions/parking-lot.md](../blob/main/solutions/parking-lot.md) as the reference):

1. Requirements & clarifying questions
2. Core entities
3. Design-approach table (patterns **and why**)
4. Mermaid class diagram
5. Full runnable Java — one ```java block, ending in a public `Main` with a demo
6. Edge cases & pitfalls table
7. Follow-up questions

> ⚠️ CI extracts every ```java block and compiles + runs it, so the code must compile as-is and `Main` must finish quickly.

## Checklist

- [ ] I've commented below to claim this problem (no duplicate work)
- [ ] My solution follows the 7-part template
- [ ] The Java compiles standalone and includes a runnable `Main`
- [ ] I've added the solution to the index tables in `solutions/README.md` and the main `README.md`
