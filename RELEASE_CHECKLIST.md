# Release Checklist

## Version: RC-1 (Release Candidate 1)

## Pre-Release Checks

### Build & Test
- [x] npm run test - PASSED
- [x] npm run typecheck - PASSED
- [x] npm run lint - PASSED
- [x] npm run build - PASSED
- [x] npm run simulate - PASSED

### Playability
- [x] New game starts correctly
- [x] Cards can be played
- [x] Enemy attacks work
- [x] Victory/Defeat screens display
- [x] Reward selection works
- [x] Save/Load functions work
- [x] Stats tracking works
- [x] Sound toggle works

### Platform
- [x] Desktop browser - OK
- [x] Mobile portrait - OK
- [x] iPad - OK
- [x] Touch targets >= 48px - OK

### Code Quality
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] Error boundary in place
- [x] No console errors

## Post-Release
- [ ] Deploy to Vercel