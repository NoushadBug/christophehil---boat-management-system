# Boat Management System - Spreadsheet Generator

This directory contains the script to automatically generate a complete Google Sheets spreadsheet with all required tabs, columns, and sample data for the Boat Management System.

## 📋 What the Generator Creates

### 🗂️ **Sheets Created:**

1. **Bookings** - Main booking data with all client and trip details
2. **Users** - User accounts and access control
3. **Boats** - Boat configurations and colors
4. **Settings** - System configuration and preferences
5. **Drivers** - Driver information and rates
6. **Partners** - Partner agencies and commission rates

### 📊 **Sample Data Included:**

- **8 Sample Bookings** with realistic data matching Christophe's examples
- **5 Sample Users** (Admin, Staff, Drivers)
- **4 Sample Boats** (MAYA, PEARL, BELLA, SUNSET)
- **4 Sample Drivers** with contact info and rates
- **5 Sample Partners** with commission structures
- **System Settings** for colors, rates, and configuration

## 🚀 How to Use

### Step 1: Copy the Generator Script
1. Copy the contents of `SpreadsheetGenerator.js`
2. Create a new Google Apps Script project
3. Paste the code into `Code.gs`
4. Save the project

### Step 2: Run the Generator
1. In the Apps Script editor, select the `runGenerator` function
2. Click the "Run" button
3. Grant necessary permissions when prompted
4. Check the execution log for the spreadsheet ID and URL

### Step 3: Use the Generated Spreadsheet
1. Copy the spreadsheet ID from the console output
2. Update your main `Code.js` file with:
   ```javascript
   const SPREADSHEET_ID = "YOUR_GENERATED_SPREADSHEET_ID";
   ```

## 📈 Data Structure

### Bookings Sheet Columns:
- `ID` - Unique booking identifier
- `Date` - Trip date (YYYY-MM-DD)
- `Boat` - Boat name (MAYA, PEARL, BELLA, etc.)
- `TripType` - Private, Shared, Sunset, Day Off
- `Clients` - Client name
- `Phone` - Contact phone number
- `Adults` - Number of adult passengers
- `Children` - Number of child passengers
- `ChildAges` - Ages of children (semicolon separated)
- `TotalPAX` - Total passengers
- `Payment` - Payment amount and currency
- `Paid` - Payment status
- `Commission` - Commission amount
- `Partner` - Referring partner/agency
- `Driver` - Assigned driver
- `Hotel` - Pickup location
- `Transfer` - Whether transfer is included
- `TransferTime` - Transfer pickup time
- `Comments` - Special notes and requirements
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Last update timestamp

### Users Sheet Columns:
- `ID` - User identifier
- `Name` - User's full name
- `Email` - Login email
- `Password` - Hashed password (for demo)
- `Role` - Admin, Staff, Driver
- `AccessBoats` - Comma-separated boat access
- `IsActive` - Account status
- `CreatedAt` - Account creation date

### Boats Sheet Columns:
- `ID` - Boat identifier
- `Name` - Boat name
- `Color` - Emoji and color description
- `MaxCapacity` - Maximum passengers
- `Managers` - Assigned managers/drivers
- `IsActive` - Boat status
- `CreatedAt` - Boat registration date

## 🎨 Color Coding System

The generator sets up a color coding system that matches Christophe's requirements:

- **Private Trips**: Purple theme
- **Shared Trips**: Blue theme  
- **Sunset Cruises**: Orange theme
- **Day Off**: Red theme

## 🔧 Customization

### Adding More Sample Data
Edit the `addSampleBookings()`, `addSampleUsers()`, etc. functions to add more realistic data.

### Modifying Sheet Structure
Update the header arrays in the `create*Sheet()` functions to add/remove columns.

### Changing Colors
Modify the `formatAllSheets()` function to change the color scheme.

## 📝 Sample Data Examples

### Sample Booking:
```
Date: 2025-08-05
Boat: MAYA
TripType: Private
Clients: Bella Vista
Phone: +33 6 07 40 56 40
Adults: 7
Children: 0
TotalPAX: 7
Payment: 480$
Paid: TBC
Commission: 40€
Partner: Valentin
Driver: James
Hotel: White Sand
Transfer: Yes
TransferTime: 8:30
Comments: Option for Sharlene until 31/07 morning 5 guests + 2 bodyguard
```

### Sample Driver Message Output:
```
Hello,

Boat of KENDWA (James)

Car 1 
Name : Bella Vista
Number of pax : 7 pax
Pick-up : 8.30
Location : White Sand
Driver : 120k by James
```

### Sample Staff Message Output:
```
Hello Diana,

Tomorrow 2025-08-05 – 1 boats going out.

MAYA 💛
Private – 7 adults
Meeting at 8:30 AM

➡️ Bella Vista
7 adults – Valentin's clients
Paying 480$
Coming with James => 120k
```

## 🔐 Security Notes

- Sample passwords are set to "password123" for each user
- In production, implement proper password hashing
- Consider using Google OAuth for authentication

## 📞 Support

If you need to modify the generator or add new features:
1. Edit the `SpreadsheetGenerator.js` file
2. Test with a small dataset first
3. Run the generator again to create a fresh spreadsheet

The generated spreadsheet is ready to use with the Boat Management System web app! 