# Release Checklist - RC-2

## Version: RC-2 (Release Candidate 2)

## Pre-Release Checks

### Build & Test
- [x] npm run test - PASSED
- [x] npm run typecheck - PASSED
- [x] npm run lint - PASSED
- [x] npm run build - PASSED
- [x] npm run simulate - PASSED

### Playability (Verified 2026-04-30)
- [x] New game starts correctly
- [x] Cards can be played (tap to use)
- [x] Enemy attacks work (after End Turn)
- [x] Victory/Defeat screens display
- [x] Reward selection works
- [x] Save/Load functions work
- [x] Stats tracking works
- [x] Sound toggle works

### Platform Layout
- [x] Desktop browser - OK
- [x] Mobile portrait - OK (fixed in RC-2)
- [x] iPad - OK (fixed in RC-2)
- [x] Touch targets >= 48px - OK
- [x] Hand fixed at bottom - OK
- [x] Enemy centered - OK

### Code Quality
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] Error boundary in place
- [x] No console errors

### Balance Fixes (RC-2)
- [x] Strike damage: 6 → 8 (fixes early game too weak)

## Known Issues
- Simulation is placeholder (no full battle simulation)
- Audio playback requires user interaction first