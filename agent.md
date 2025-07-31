✅ Boat Management System — AI Agent & Developer Guide

## 🧭 Project Purpose

A modern, color-coded, calendar-style booking and staff coordination system built for a boat tour operator transitioning from Excel-based operations to a scalable, user-friendly web app.

The system:

* Centralizes multi-boat bookings
* Replaces error-prone spreadsheets
* Streamlines daily operations (driver instructions, staff prep)
* Empowers the team with access-controlled, no-vendor-lock-in tools
* Uses **Google Sheets** as the backend, **Apps Script** for logic, and a **responsive frontend** via TailwindCSS + Alpine.js.

---

## 🔁 Core Functional Requirements

### 🗓 Booking System

* Tracks trips per boat:

  * `Date, Trip Type, Client, Phone, PAX, Kids, Hotel, Driver, Transfer Info, Payment, Commission, Partner, Comments`
* Easily add/edit/delete trips via a modal or form

### 🟥 Color-Coded Calendar Dashboard

* Overview of bookings by boat and date
* Trip type shown with configurable color
* Total PAX shown per day
* Fully responsive (mobile/desktop)

### 📬 Message Generator

* **Driver Instructions** grouped by driver, across all boats
* **Staff Summary** grouped by boat, showing guest details, payment, driver info
* Format mimics client's current communication templates

### 🔐 Role-Based Access Control

* **Roles:** Admin, Staff, Driver
* Admins manage users and boats
* Staff/Drivers only see boats they are assigned to (via Users sheet)
* Enforced in **both frontend UI & backend validation**

### 🧩 Configurability & Independence

* All core data lives in Google Sheets
* Colors, trip types, user roles, commission rates — fully editable from Sheets
* No 3rd-party services or subscriptions required
* Built for **easy handover or takeover by other developers**

---

## 🏗 Architecture Overview

| Layer          | Tech                                                      |
| -------------- | --------------------------------------------------------- |
| **Frontend**   | TailwindCSS + Alpine.js + Boxicons + DataTables           |
| **Backend**    | Google Apps Script (V8)                                   |
| **Database**   | Google Sheets (created by generator)                      |
| **Auth**       | Email/password (base64 or hashed) w/ localStorage session |
| **Deployment** | Google Apps Script Web App                                |

---

## 📁 Folder Structure

```bash
/Backend/
  Code.js                # Main backend (doGet, CRUD, auth, includes)
  /Client/
    Main.html            # Primary dashboard shell (loads components)
    Login.html           # Login page
    Styles/Stylesheet.html # Tailwind, Boxicons, custom CSS
    Components/          # UI components (Sidebar, Toasts, Modals)
    BookingModal.html    # Modal for adding/editing bookings
    AdminPanel.html      # Manage users & boats
    Messages.html        # Generate daily messages
    DashboardTable.html  # Optional: table-only fallback view

/Generator/
  SpreadsheetGenerator.js # Sheet builder: tabs, headers, sample data
  QuickStart.js           # Minimal sheet generator (no sample data)
  README.md               # Generator usage

appsscript.json           # GAS project config
.clasp.json               # CLASP local dev config
agent.md                  # (This file) Developer & AI project brain
README.md                 # Overview, setup guide for users/devs
```

---

## 🧠 Best Practices for Developers & AI Agents

### UI (Frontend)

* Use **Tailwind** for layout & spacing
* Use **Alpine.js** for reactivity (modals, toasts, dynamic content)
* Organize reusable UI in `Client/Components`
* Use `Main.html` as root shell, inject partials via includes

### Backend (Apps Script)

* Centralize all logic in `Code.js` (split to `.gs` files if needed)
* Avoid hardcoded spreadsheet IDs: use `PropertiesService`
* Validate user role & boat access before any action
* Return all API responses in standard format `{ status, data, message }`

### Generator

* All schema, header rows, and default rows live in `SpreadsheetGenerator.js`
* Update this whenever new columns/tabs are introduced
* Generator ensures consistent backend for testing, scaling, resetting

### Data Handling

* Booking IDs: generate unique IDs per booking (`BOOK-YYYYMMDD-xxxx`)
* Store user-to-boat access as CSV string in `Users` sheet
* Use dropdown-validations in Sheets where possible (TripType, Status)

### Auth / Session

* Use `loginUser(email, password)` function
* Store auth token in `localStorage` for 10 days
* Clear on logout or inactivity
* Use hashed passwords in production (base64 for demos/dev only)

---

## 🔍 Common Scenarios & Where to Implement

| Task                            | Location                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| Add new sheet/tab               | `SpreadsheetGenerator.js`                                   |
| Add new booking field           | `SpreadsheetGenerator.js` + `BookingModal.html` + `Code.js` |
| Add admin-only feature          | `AdminPanel.html` + backend role check                      |
| Add color to trip type          | Update `Settings` sheet + frontend mapping                  |
| Add message logic customization | `Messages.html` + backend message builder                   |
| Create a new page or route      | `Client/` folder + route in `Main.html`                     |
| Add new user role or permission | Update logic in `Code.js` and UI access points              |
| Fix bug in booking table        | `DashboardTable.html` or backend data fetch                 |
| Add toast or modal              | Reuse from `Components/` or add new                         |

---

## 📎 Handoff & Maintenance

* Designed for zero developer lock-in.
* All core data, config, and access are stored in Google Sheets.
* Frontend can be easily cloned, edited, or migrated.
* Backend code is modular and transparent.
* Generator ensures fast onboarding for new developers or assistants.

---

## 📘 Future Improvements (Optional)

* ✅ PDF export of messages
* ✅ Guest-level message template customization
* ✅ Partner commission reporting
* ✅ Enhanced analytics: occupancy trends, revenue summary
* ✅ Telegram or WhatsApp API for auto-sending messages

---

## 🧠 Project Background Summary (Client Context)

Christophe runs a boat tour company based in Zanzibar. Previously managed trips in Excel files (one per boat), with color-coded cells to indicate trip type and guest totals. Manual daily coordination was time-consuming and error-prone.

He requested:

* A centralized calendar dashboard showing all boat bookings with color badges
* Guest count per day for easy capacity checking
* Auto-generated messages for drivers and guest staff, grouped logically
* Access control by boat/team
* A clean, easy-to-maintain system based on Sheets + Apps Script

*He explicitly wanted no ongoing dependency on a developer and full control over the system.*

---

## ✅ Done Right, This System Will Be:

* 100% maintainable by non-tech users
* Fast to deploy, fast to extend
* Visual, intuitive, mobile-ready
* Client-owned, self-contained, and built to last