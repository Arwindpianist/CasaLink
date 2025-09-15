# Product Requirements Document (PRD)

**Project Name:** CasaLink - Condominium Management System
**Domain:** [casalink.arwindpianist.store](https://casalink.arwindpianist.store)
**Type:** SaaS Web App + PWA

---

## 1. Purpose

CasaLink is a **multi-tenant SaaS platform** for residential condominiums, providing tools to manage **residents, visitors, amenities, community engagement, security access, and communication** in a single platform.

The app supports **progressive web app (PWA)** features, allowing mobile access with offline support, push notifications, and QR code–based access.

---

## 2. User Roles

1. **Resident**

   * Primary end user (unit owner or tenant).
   * Can invite visitors, book amenities, chat with neighbors, access community boards, and manage their own profile/unit.

2. **Visitor**

   * Temporary user accessing the condo via resident invitation.
   * Access limited by QR code authorization (time/location specific).

3. **Security / Management**

   * Security verifies visitor/amenity QR codes.
   * Management oversees resident accounts, community postings, amenity usage, and general building operations.

4. **SaaS Owner (Platform Admin)**

   * Full platform visibility across all tenant condos.
   * Can monitor usage, billing, analytics, and assist with misconfigurations.
   * Ability to intervene/edit configurations on behalf of condo management.

---

## 3. Features

### A. Authentication & Accounts

* **Clerk** for authentication (email, phone, social logins).
* **Role-based access control** (Resident, Visitor, Security, Management, SaaS Owner).
* Residents linked to a unit; Visitors linked to a resident.

---

### B. Visitor & Amenities Access (Unified QR System)

* **Pre-Generated QR Codes**: Residents generate QR codes for:

  * Visitor access (unit-specific, time-bound).
  * Amenity access (gym, swimming pool, etc.).
* **Unified Verification Flow**: Security/Management scans QR code → verifies via Supabase DB + GUN.js sync.
* **Logging**: All scans stored in Supabase for auditing.

---

### C. Amenity Booking & Usage

* Residents can book **shared facilities** (gym, pool, event hall, BBQ pits).
* QR code required for entry at booked time.
* Management can configure booking rules: time slots, capacity, fees (if applicable).

---

### D. Communication & Social Features

* **Community Board**: Internal posts for announcements, social updates, lost & found, etc.
* **Rent/Marketplace Board**: Residents can post:

  * Vacancies (looking for tenants).
  * Listings (selling furniture, services, etc.).
* **Built-in Chat System** (powered by GUN.js):

  * Resident-to-resident messaging.
  * Optional group chats by building/floor.
  * Push notifications for new messages (via service workers).

---

### E. Security & Management Tools

* **Visitor Verification Dashboard**: Quick scan + approve/deny visitors.
* **Amenity Access Logs**: Monitor who accessed facilities.
* **Resident Management**: Add, remove, or update resident data.
* **Broadcast Announcements**: Push notifications to all residents.

---

### F. SaaS Owner Tools

* **Analytics Dashboard**:

  * Number of residents, visitors, bookings, chats, QR scans, etc.
* **Multi-Tenant Management**: Each condominium is isolated, but SaaS owner can view across tenants.
* **Error/Misconfig Assistance**: Ability to temporarily impersonate Management role for troubleshooting.
* **Billing & Subscription**: Each condominium subscribes to the platform (monthly/annual).

---

## 4. Technical Architecture

* **Frontend**: Next.js (App Router) + TailwindCSS (via Vercel).
* **Auth**: Clerk.
* **Database**: Supabase (Postgres + row-level security).
* **Realtime & Decentralization**: GUN.js for chat + offline-first sync.
* **Notifications**: PWA service workers (push, vibration, sound, wake screen).
* **Hosting**: Vercel (frontend) + Supabase (backend) + optional serverless functions for QR verification.
* **Backup Strategy**: Supabase as source of truth, GUN.js for decentralized realtime sync.

---

## 5. Goals

* **Short-Term (MVP):**

  * Core auth, resident/visitor accounts.
  * Visitor QR access system (scan + verify).
  * Amenity booking + QR access.
  * Basic community board.
  * Basic chat with push notifications.

* **Long-Term:**

  * Rent/Marketplace board.
  * Advanced analytics (per condo + global SaaS).
  * Billing system for condos.
  * Role impersonation for troubleshooting.
  * AI moderation for community board + chat (optional).

---

## 6. Success Criteria

* Residents can seamlessly invite visitors & book amenities.
* Security can quickly verify QR codes with low friction.
* Chat and community boards foster internal communication.
* SaaS owner can monitor and monetize multiple condominiums.
* System works offline-first with GUN.js and syncs back to Supabase when online.

---