# ADR-006: Dual-Language Localization & Accessibility Architecture

- **Status**: `ACCEPTED` (Approved by Principal Architect & UX Lead)
- **Date**: `2026-09-13`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, UX Lead, Android Lead

---

## 1. Context & Problem Statement

KaamSaathi is tailored for semi-urban and rural users across Uttar Pradesh. Many customers and service providers:
- Have limited or zero English literacy.
- Are older users with reduced visual acuity requiring large fonts.
- Use entry-level smartphones with small low-resolution screens.
- Rely on audio or visual cues alongside text.

Standard translation approaches (e.g., automated browser translation or hardcoded strings) fail because:
- Technical jargon confuses informal workers (e.g., translating "circuit breaker" into complex Sanskritized Hindi).
- Icon-only buttons (like a gear for settings or three dots for menu) are poorly understood by low-literacy users.

---

## 2. Decision

### 2.1 Shared Localization Package (`packages/localization`)
1. All user-facing strings across Android, public web, and admin portal are centralized in `packages/localization`:
   ```text
   packages/localization/
   ├── src/
   │   ├── en/
   │   │   ├── auth.json
   │   │   ├── categories.json
   │   │   ├── bookings.json
   │   │   └── errors.json
   │   ├── hi/
   │   │   ├── auth.json
   │   │   ├── categories.json
   │   │   ├── bookings.json
   │   │   └── errors.json
   │   └── index.ts
   ```
2. **Colloquial Hindi**: Language strings prioritize everyday Hindustani / colloquial terms over formal Sanskritized Hindi:
   - "Wireman / Bijli Mistri" (बिजली मिस्त्री) rather than "Vidyut Abhiyanta" (विद्युत अभियंता).
   - "Kaam Shuru Karein" (काम शुरू करें) rather than "Karya Aarambh Karein".
3. **Instant Language Switching**: Changing language updates the UI immediately without app restart, network roundtrip, or draft form loss.

### 2.2 Transliterated Search Aliases
To enable natural discovery, the catalogue indexing includes colloquial transliterated terms:
- Plumber: `paani tapak raha hai`, `nal theek karwana`, `pipe leakage`, `tanki fitting`.
- Electrician: `bijli ka kaam`, `switch kharab`, `wiring jal gayi`, `fan fitting`, `inverter repair`.
- Appliance: `fridge thanda nahi kar raha`, `washing machine awaz`, `cooler motor`.

### 2.3 Accessibility (A11y) Architecture
1. **Zero Icon-Only Critical Controls**: Every actionable button, tab, and navigation control must have a visible text label alongside an icon.
2. **Touch Targets**: Minimum **48dp x 48dp** touch target size for all interactive elements to accommodate older users and rough-handed field workers.
3. **Dynamic Text Scaling**:
   - Layouts use Jetpack Compose `sp` units and fluid constraints (`IntrinsicSize`).
   - Supports up to 200% Android system font scaling without text clipping, truncation, or breaking layout containers.
4. **Color Independence**: Color is never the sole indicator of state:
   - Status indicators pair color with a text label and an icon (e.g., Green checkmark + "स्वीकृत / Approved", Red cross + "रद्द / Cancelled").
   - Minimum 4.5:1 contrast ratio for normal text; 3:1 for large text.
5. **Screen Reader (TalkBack & NVDA)**:
   - Full semantic labeling for all composables and web elements (`contentDescription` in Compose, `aria-label` on Web).
   - Heading hierarchy and logical focus order maintained across all forms.

---

## 3. Consequences

### Positive
- High adoption and comprehension for informal workers and elderly household users across UP.
- Compliance with Android accessibility guidelines and Indian digital accessibility standards.
- Reduced customer support tickets resulting from misunderstood actions or failed navigation.

### Negative / Trade-offs
- Hindi text strings are typically 20–30% longer than English strings, requiring careful layout design and multi-line container testing.
