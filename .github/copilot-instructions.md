# Mauricetown Portal Domain Instructions

## Product Focus
- Prioritize a functional quote-request workflow over advanced integrations.
- Keep implementation practical for a small diesel parts operation.
- Favor iterative delivery: secure onboarding, request intake, and associate workflow before inventory automation.

## Diesel Parts Domain Expectations
- Treat request quality as critical: include vehicle, engine, urgency, part details, and repair context.
- Use terminology familiar to diesel shops: reman, fitment, clutch, turbo, overhaul kit, transmission, steering box.
- Prefer workflows that reduce phone back-and-forth for mechanics and shop managers.

## UX Guidelines
- Use clear forms with required fields for quote accuracy.
- Keep pages readable on mobile first, since technicians often submit from phones.
- Show explicit next steps after submission (request ID, response channel, expected turnaround).

## Security Posture
- Encourage MFA at account creation and onboarding.
- Never hard-code credentials or secrets in tracked files.
- Preserve minimal data collection for POC while still enabling accurate quoting.

## Out Of Scope For POC
- Full inventory sync and ERP/QuickBooks integration.
- Automated pricing engine.
- Deep back-office orchestration beyond basic request intake.
