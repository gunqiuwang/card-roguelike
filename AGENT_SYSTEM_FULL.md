# 🧠 CARD ROGUELIKE AI STUDIO SYSTEM — FULL VERSION (30 LAYERS)

## Overview
This is the complete production-grade Agent system including:
- 3-Agent architecture
- 30-layer roadmap
- Auto testing
- Simulation
- Balance AI
- Bootloader compatibility

---

# 🚀 CORE AGENTS

## Developer Agent
Implements features, writes code, fixes bugs.

## Reviewer Agent
Validates correctness, tests, UI, architecture.

## Balance Designer Agent
Designs gameplay, balance, cards, enemies.

---

# ⚙️ GLOBAL RULES

- Always read project files (no chat memory reliance)
- Build must always pass
- No skipping layers
- Reports go to files (not chat)
- Work in small increments

---

# 📦 PROJECT STRUCTURE

src/
  components/
  pages/
  store/
  data/
  types/
  utils/
  hooks/
  tests/
  sim/

---

# 🧠 PROJECT STATE

PROJECT_STATE.json must exist:

{
  "current_iteration": 1,
  "next_iteration": 2,
  "last_review": "APPROVED"
}

---

# 🔁 EXECUTION FLOW

Balance → Dev → Test → Review → Commit

---

# 🧪 REQUIRED COMMANDS

npm run test
npm run simulate
npm run typecheck
npm run lint
npm run build

---

# 🧪 TEST SYSTEM

Use Vitest.

Must test:
- combat
- deck logic
- card effects
- enemy behavior
- relic triggers

---

# 🤖 SIMULATION SYSTEM

Run:

npm run simulate

Simulate ≥1000 battles.

Track:
- winrate
- avg turns
- boss success
- strongest cards
- weakest cards

---

# ⚖️ BALANCE TARGETS

Early: 80% winrate  
Mid: 60%  
Late: 40-50%

---

# 🃏 CARD SYSTEM

Total cards ≥50

Rules:
- no duplicates
- must have synergy
- no infinite loops

---

# 👾 ENEMY SYSTEM

Enemies ≥20

Include:
- multi attacks
- buffs
- debuffs
- special mechanics

---

# 🧿 RELIC SYSTEM

Relics ≥30

Trigger types:
- turn start
- attack
- damage taken
- victory

---

# 📊 REPORT FILES

Must generate:

- ITERATION_REPORT.md
- AUTO_QA_REPORT.md
- BALANCE_REPORT.md
- CARD_DESIGN_REPORT.md
- BALANCE_PLAN.md
- REVIEW_REPORT.md

---

# ❌ FAILURE RULE

If reviewer rejects 3 times → BLOCKER_REPORT.md

---

# 🔒 CONTEXT PROTECTION

- Always read files
- Never rely on memory
- Keep outputs short

---

# 🧭 30 LAYER ROADMAP

## 1-10 CORE GAME

1. Project structure
2. Combat stability
3. Card expansion
4. Enemy system
5. Level progression
6. Rewards
7. Card upgrade
8. Shop
9. Events
10. Relics

---

## 11-20 SYSTEM EXPANSION

11. Map system
12. Save system
13. Balance tuning
14. UI polish
15. Sound
16. Tutorial
17. Achievements
18. Difficulty modes
19. Mobile optimization
20. Release prep

---

## 21-30 AI & ADVANCED

21. Test framework
22. Battle simulator
23. Auto balance system
24. Card expansion AI
25. Enemy expansion AI
26. Relic expansion AI
27. Strategy bots
28. Combo detection
29. Mobile QA
30. Final release validation

---

# 🚀 BOOT COMMAND

Start with:

Execute layers 1-3.

Then stop.

---

# 🎯 FINAL GOAL

A playable, balanced, mobile-friendly roguelike card game.
