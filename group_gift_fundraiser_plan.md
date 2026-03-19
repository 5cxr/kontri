# Group Gift Fundraiser — Project Plan

## 1) What this app is
A fun, slightly cartoony web app for organizing a group gift contribution. The goal is to make the awkward parts of collecting money feel simple, visual, and a bit playful.

The app should let a host create a room, share it with friends, track who has contributed, show how much of the target amount has been collected, and display a celebratory final state once the goal is reached.

---

## 2) Product vibe
The UI should feel light, friendly, and a little silly — closer to **skribbl.io** than a corporate finance app.

Design direction:
- Rounded cards, soft shadows, bright but not neon colors
- Playful icons, sticker-like illustrations, confetti, doodle-style accents
- Bouncy buttons and micro-animations
- Friendly copy instead of formal business language
- Progress visuals that feel celebratory, not sterile

Tone examples:
- “Gift mission in progress”
- “Only ₹420 left to unlock the surprise”
- “The gang is assembling funds”

---

## 3) Core pages required

### A. Landing page
Purpose: explain the app quickly and get users into login / room creation.

Include:
- App name + short tagline
- 2–3 feature highlights
- CTA buttons:
  - Create a room
  - Join a room
  - Login / Sign up
- Small demo-style preview card of the fund progress bar

### B. Authentication page
Purpose: allow secure identity for hosts and participants.

Suggested auth options:
- Email/password login
- Optional OTP magic link later if time permits

Roles:
- **Host**: creates and manages room
- **Participant**: joins room and marks contribution status

### C. Room creation page
Purpose: host creates a new fundraiser room.

Fields:
- Gift title
- Total target amount
- Due date / deadline
- Optional description/message for the group
- Optional participant invite method
- Optional cover image or theme selection

Output:
- Room code / share link
- Initial empty progress state

### D. Payment page
Purpose: show contribution details and payment instructions.

This page should include:
- Room name
- Total goal
- Amount already collected
- Remaining amount
- Participant list with contribution status
- Payment instructions / UPI QR / dummy checkout card
- A “mark as paid” flow for testing or host confirmation

### E. Final room state page
Purpose: show completion and celebration once target is reached.

Include:
- Full progress bar
- “Goal reached” message
- Celebration animation or confetti
- List of contributors
- Final summary card
- Optional message from the host to the group

---

## 4) Payment tracking approach

Automating UPI detection is overkill for a college project, so the cleanest practical solution is:

### Recommended approach: manual host confirmation
Flow:
1. Participant says they paid.
2. Host reviews and manually confirms the payment in the room dashboard.
3. The total paid amount updates automatically in the UI.

Why this is best:
- Easy to build
- Works reliably
- Avoids payment gateway complexity
- Fits a college project timeline
- Still gives a believable real-world workflow

### Better-looking version of the same idea
To make it feel more polished, you can call the action:
- “Confirm contribution”
- “Mark received”
- “Verify payment”

Instead of plain “manual update,” the UI can make it look like a host moderation step.

### Alternative if you want more realism
You can simulate payment completion by using a fake checkout status page:
- Participant clicks “I’ve paid”
- Status becomes “Pending verification”
- Host approves it from their dashboard

This gives a more realistic transaction feel without real payment integrations.

---

## 5) Progress bar idea
This should be the central interesting element.

### Behavior
- Bar fills dynamically as payments are confirmed
- Show:
  - amount collected
  - amount remaining
  - percentage completed
- Add milestone states at 25%, 50%, 75%, and 100%

### Visual style
Make it feel fun:
- Gift box, candy meter, balloon meter, or treasure chest style
- The bar can “grow” in segments
- Small celebratory effects on milestone completion

### Possible implementation options

#### Option 1: Simple percentage bar
- Store `targetAmount` and `collectedAmount`
- Compute `progress = collectedAmount / targetAmount * 100`
- Animate width changes on updates

This is the easiest and probably enough.

#### Option 2: Milestone-based bar
- Divide total into chunks
- Each confirmed payment fills a segment
- Better visual feedback than one flat bar

#### Option 3: Themed progress bar
- Gift-wrap unwraps over time
- Candy bar fills up
- Balloon string rises as the amount increases

For a college project, Option 1 + playful design is the safest path.

---

## 6) Deadline / countdown system
Deadline handling should feel urgent but still playful.

### Required behavior
- Show a reverse counter like:
  - 3 days left
  - 2 days left
  - 1 day left
  - Due today
  - Overdue

### Suggested implementation
- Store a room deadline as a timestamp
- On each page load, calculate remaining time
- Update dynamically every second or every minute

### Optional calendar upgrade
Add a compact calendar widget or timeline card:
- Highlight the deadline day
- Show contribution checkpoints
- Show “gift reveal day”

This is optional, but it can make the project feel more complete.

---

## 7) Main user flows

### Flow 1: Host creates a room
1. Login
2. Fill room creation form
3. Room is generated
4. Host shares invite link/code
5. Host monitors progress

### Flow 2: Participant joins and contributes
1. Open invite link
2. Login or sign up
3. View room details
4. See payment instructions
5. Mark contribution as sent
6. Host confirms
7. Progress bar updates

### Flow 3: Final completion
1. Target amount reached
2. Room transitions to final state page
3. Celebration animation appears
4. Contributors and status summary are displayed

---

## 8) Suggested data model

### User
- id
- name
- email
- role
- avatar/theme preference

### Room
- id
- title
- description
- targetAmount
- collectedAmount
- deadline
- status (`active`, `completed`, `expired`)
- hostId
- inviteCode

### Contribution
- id
- roomId
- userId
- amount
- status (`pending`, `confirmed`)
- timestamp
- payment note/reference

### Optional activity log
- roomId
- action type
- actor
- time
- message

This log will help make the room feel alive.

---

## 9) UI components to build
- Top navbar with room status
- Hero section on landing page
- Room summary card
- Progress bar component
- Deadline countdown widget
- Contribution list/table
- Payment confirmation modal
- Celebration banner / confetti area
- Final state summary card
- Empty states for “no contributors yet”

---

## 10) Feature priority

### Must have
- Landing page
- Authentication
- Room creation
- Payment/contribution page
- Final room page
- Dynamic progress bar
- Countdown/deadline display
- Manual contribution confirmation

### Nice to have
- Calendar view
- Confetti / animations
- Theme picker
- Activity feed
- Invite code copy button
- Participant avatars
- Mobile responsive layout

### Probably skip
- Real UPI automation
- Crypto payments
- Full payment gateway integration

---

## 11) Tech stack suggestion
A practical stack for a college project:

### Frontend
- React / Next.js
- Tailwind CSS
- Framer Motion for motion effects
- Lucide icons

### Backend
- Node.js + Express or Next.js API routes
- PostgreSQL or MongoDB
- Auth library or custom session logic

### Extras
- Socket-style live updates if you want room changes to appear instantly
- Local storage for early prototype testing

If speed matters, go with a simple full-stack web app and keep the realtime stuff lightweight.

---

## 12) Build order

### Phase 1: Skeleton
- Set up project
- Make layout and routing
- Create the required pages

### Phase 2: Core logic
- Auth
- Room creation
- Room joining
- Store target and current amount

### Phase 3: Tracking UI
- Progress bar
- Contribution list
- Manual confirmation
- Countdown timer

### Phase 4: Polish
- Cartoon styling
- Animations
- Final celebration state
- Better empty states and responsive behavior

### Phase 5: Demo readiness
- Seed sample data
- Make the flow smooth for presentation
- Add fake-but-believable user journey

---

## 13) Demo story for presentation
You can present it like this:

“Group gift fundraising is awkward when people send money in pieces and the organizer has to keep checking chats. This app gives them a single room where the host can create a goal, track contributions, visualize progress, and close the loop with a celebratory final state.”

That sounds clean and makes the project feel purposeful.

---

## 14) Best MVP recommendation
For the first version, build:
- Login
- Room creation
- Invite link / room code
- Manual payment confirmation
- Animated progress bar
- Countdown to deadline
- Final completed room page

That is enough to feel like a complete product and still be realistic for a college project.

---

## 15) Final product feeling
The app should feel like:
- simple to use
- visually playful
- socially useful
- slightly goofy in a good way
- easy to demo live

The core idea is not “payment infrastructure.” The core idea is **making group gifting coordination feel effortless and fun**.

