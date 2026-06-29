# Platform-Mediated Host Chat — Implementation Plan

> Status: **PLAN ONLY — not implemented.** The current "Send message" button on
> the Host Detail page opens a placeholder ("Messaging is coming soon"). This
> document proposes the architecture to build after the Host Dashboard is done.

## 1. Goals & non-goals

**Goals**
- Travellers and hosts can converse about a trip entirely on-platform.
- **No direct contact details** (phone, email, social handles, external links)
  can be exchanged — enforced server-side, not just in the UI.
- Hosts manage conversations from the Host Dashboard; travellers from the Host
  Detail page / their account.
- Auditable: every message is stored, moderation decisions are logged.

**Non-goals (v1)**
- Real-time voice/video, file/image sharing, group chats.
- Read receipts / typing indicators (can be a fast-follow).

## 2. Why platform-mediated

Letting users swap phone/email moves the relationship (and future bookings) off
the platform, removes our ability to mediate disputes, and exposes both sides to
fraud. So contact exchange must be **blocked and logged**, and messaging must be
**authenticated** (no anonymous spam).

## 3. Data model (MongoDB / Mongoose)

```
Conversation {
  _id,
  hostId: ObjectId(Host),          // indexed
  travellerId: ObjectId(User),     // indexed
  tripId: ObjectId(Trips) | null,  // optional context
  lastMessageAt: Date,             // for sorting inbox
  lastMessagePreview: String,      // redacted preview
  unread: { host: Number, traveller: Number },
  status: 'open' | 'archived' | 'blocked',
  createdAt, updatedAt,
}
// unique compound index: { hostId, travellerId, tripId }

Message {
  _id,
  conversationId: ObjectId(Conversation), // indexed
  senderId: ObjectId,
  senderRole: 'host' | 'traveller',
  body: String,                    // stored AFTER redaction
  rawFlagged: Boolean,             // original contained contact info
  moderation: {
    action: 'allowed' | 'redacted' | 'blocked',
    reasons: [String],             // ['email','phone','url','handle']
  },
  createdAt,
}

ModerationEvent {                  // audit trail for trust & safety
  _id, conversationId, messageId, userId, reasons: [String],
  originalExcerpt: String,         // for review; access-restricted
  createdAt,
}
```

## 4. Contact-detail prevention (defence in depth)

Client-side checks are UX hints only; **the server is the source of truth.**

1. **Authoritative server-side filter** runs on every inbound message:
   - Email regex, URL/domain regex (incl. `dot`/`(at)` obfuscation),
     phone-number detection (≥7–8 digits incl. spaced/`zero` spelled-out forms),
     social-handle keywords (whatsapp, insta, telegram, `dm me`, `@handle`).
   - Normalise first: lowercase, strip zero-width chars, de-leet (`zero→0`,
     `at→@`, `dot→.`), collapse whitespace.
2. **Policy** (configurable):
   - `redact` — replace matches with `[hidden for your safety]`, deliver the
     rest, flag the message. (Recommended default.)
   - `block` — reject the message, return a warning, store a ModerationEvent.
3. **Escalation:** N violations in a conversation → soft-warn, then temporary
   send-restriction, then flag for human review (`status: 'blocked'`).
4. **Logging:** every redaction/block writes a `ModerationEvent` with the
   original excerpt (access-restricted to admins) for appeals/abuse analysis.
5. **Future hardening:** optional LLM/classifier pass for obfuscation the regex
   misses; rate-limit + spam heuristics; image OCR if/when images are allowed.

Keep the regex/normaliser in **one shared module** the server owns; the client
imports a lightweight mirror only for instant inline hints.

## 5. API surface (REST first; realtime later)

```
POST   /conversations                 { hostId, tripId? }  -> finds or creates
GET    /conversations                 (role-scoped inbox, paginated)
GET    /conversations/:id/messages    (cursor paginated)
POST   /conversations/:id/messages    { body } -> runs moderation, returns saved msg
POST   /conversations/:id/read        marks read for caller's role
PATCH  /conversations/:id             { status } (archive/block; admin/host)
```

- All endpoints **auth-required** (JWT, same as the rest of the app). Authorise
  that the caller is a participant (host or traveller) of the conversation.
- Reuse the existing Express controller/route/model structure in
  `nomadic-server-v2` (`models/`, `controllers/`, `routes/`), mirroring the
  `hosts`/`reviews` patterns.

## 6. Realtime delivery

- **v1:** short polling of `GET messages` while a conversation is open (3–5s),
  plus optimistic append on send. Simple, no infra.
- **v2:** Socket.IO (or SSE) room per `conversationId`; emit on new message;
  fall back to polling. Add unread badges via a lightweight `inbox` socket.

## 7. Frontend

**Client (traveller)** — `nomadic-client-v2`
- Replace the placeholder drawer in `Component/Host/HostPage.jsx` with a real
  thread bound to a `conversationId` (create-or-get on first open).
- Add RTK Query endpoints in `services/` (`getConversations`, `getMessages`,
  `sendMessage`, `markRead`) with tag-based cache invalidation (mirrors the
  existing `host.js` service style).
- Require login to send (prompt sign-in if guest); keep the existing safety
  banner and inline contact-hint as it types.
- A `/messages` inbox page for the traveller's conversations.

**Admin / Host Dashboard** — `nomadic-admin-v2`
- Host inbox: conversation list + thread view, reply box, archive/block.
- Trust & Safety view: flagged messages / ModerationEvents (admin-only).

## 8. Notifications
- Email/push "you have a new message" (debounced) when the recipient is offline.
- Never include the message body in external notifications if it contained
  flagged content; link back to the on-platform thread instead.

## 9. Rollout
1. Models + moderation module + unit tests for the filter (the critical piece).
2. REST endpoints + auth/authorisation.
3. Client thread UI (polling) replacing the placeholder.
4. Host Dashboard inbox.
5. Notifications.
6. Realtime (Socket.IO) upgrade.
7. Optional ML moderation + rate limiting.

## 10. Testing focus
- Moderation filter: large fixture set of obfuscated emails/phones/handles/URLs
  (positive) and legitimate trip talk with numbers like dates/prices/altitudes
  (negative — avoid false positives on "12 days", "₹42,000", "4200m").
- Authorisation: non-participants cannot read/post.
- Idempotent conversation create (unique index on host+traveller+trip).
