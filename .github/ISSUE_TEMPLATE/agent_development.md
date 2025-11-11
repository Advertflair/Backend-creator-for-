---
name: Agent Development Proposal
about: Propose a new agent or improve an existing one
title: "[AGENT] Proposal for..."
labels: documentation, enhancement
assignees: ''

---

## 🤖 Agent Name

What is the agent called? (e.g., "Database Migration Agent")

## 🎯 Purpose

What is the primary responsibility of this agent? What specific task does it solve within the orchestration pipeline?

## 📊 Type

- [ ] New Macro Agent (high-level coordinator)
- [ ] New Micro Agent (specialized worker for an existing Macro Agent)
- [ ] Improvement to an existing agent (please specify which one)

## 🏗️ Architecture (if applicable)

If this is a new Macro Agent, describe the Micro Agents it would coordinate.
```
Parent Macro Agent
├─ New Micro Agent 1
├─ New Micro Agent 2
└─ New Micro Agent 3
```

## 📥 Input

What data does this agent need to perform its task?
```typescript
interface AgentInput {
  // Define the input data structure
  // Example: designOutput: ArchitectureOutput
}
```

## 📤 Output

What data does this agent produce upon successful completion?
```typescript
interface AgentOutput {
  // Define the output data structure
  // Example: migrationFiles: { '001_initial.sql': string }
}
```

## ✅ Validation

How do we programmatically verify that the agent has succeeded?
- [ ] Validation rule 1 (e.g., "Output file is valid SQL syntax")
- [ ] Validation rule 2 (e.g., "Output object contains required keys")

## 🔄 Retry Logic

Under what conditions should this agent retry its task? (e.g., "Retry on JSON parsing error", "Retry if validation fails")

## 📈 Confidence Calculation

How should the agent's confidence score be calculated? (e.g., "Base confidence of 0.8, +0.1 if validation passes")

## 🧪 Test Cases

Describe a few scenarios to test this agent's functionality.
1. **Success Case:** ...
2. **Failure Case:** ...
3. **Edge Case:** ...
