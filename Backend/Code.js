function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet() {
  var html = HtmlService.createTemplateFromFile('Backend/Client/Main');
  var evaluated = html.evaluate();
  evaluated.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return evaluated.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/6733/6733991.png')
    .setTitle('Boat Management System');
}

// Global variables for data management
let SPREADSHEET_ID = '1s-kNRbVr-VUk8Otke0QCS-v8zPk491wCf9ICIuU8lek';
const BOOKINGS_SHEET = 'Bookings';
const USERS_SHEET = 'Users';
const BOATS_SHEET = 'Boats';

// Initialize spreadsheet if not exists
function initializeSpreadsheet() {
  try {
    if (!SPREADSHEET_ID) {
      // Create new spreadsheet
      const ss = SpreadsheetApp.create('Boat Management System');
      SPREADSHEET_ID = ss.getId();

      // Create sheets
      const bookingsSheet = ss.insertSheet(BOOKINGS_SHEET);
      const usersSheet = ss.insertSheet(USERS_SHEET);
      const boatsSheet = ss.insertSheet(BOATS_SHEET);

      // Set up headers
      bookingsSheet.getRange(1, 1, 1, 8).setValues([['ID', 'Date', 'Boat', 'TripType', 'Clients', 'TotalPAX', 'Comments', 'CreatedAt']]);
      usersSheet.getRange(1, 1, 1, 5).setValues([['ID', 'Name', 'Email', 'Role', 'Boats']]);
      boatsSheet.getRange(1, 1, 1, 4).setValues([['ID', 'Name', 'MaxCapacity', 'Managers']]);

      // Add some sample data
      const sampleBookings = [
        ['1', '2025-08-05', 'MAYA', 'Private', 'Bella Vista', 7, 'Option for Sharlene', new Date().toISOString()],
        ['2', '2025-08-09', 'PEARL', 'Shared', 'Amina et kaddour', 8, 'Shared boat trip', new Date().toISOString()]
      ];

      if (sampleBookings.length > 0) {
        bookingsSheet.getRange(2, 1, sampleBookings.length, sampleBookings[0].length).setValues(sampleBookings);
      }
    }

    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    console.error('Error initializing spreadsheet:', e);
    throw e;
  }
}

// Get all bookings
function getBookings() {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return { success: true, data: [] };
    }

    const headers = data[0];
    const bookings = data.slice(1).map(row => {
      const booking = {};
      headers.forEach((header, index) => {
        booking[header] = row[index];
      });
      return booking;
    });
    return { success: true, data: bookings };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add new booking
function addBooking(bookingData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const id = new Date().getTime().toString();
    const newRow = [
      id,
      bookingData.date,
      bookingData.boat || 'Default',
      bookingData.tripType,
      bookingData.clients,
      bookingData.totalPax,
      bookingData.comments,
      new Date().toISOString()
    ];
    sheet.appendRow(newRow);
    return { success: true, id: id };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update booking
function updateBooking(id, bookingData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === id) {
        const updatedRow = [
          id,
          bookingData.date,
          bookingData.boat || 'Default',
          bookingData.tripType,
          bookingData.clients,
          bookingData.totalPax,
          bookingData.comments,
          data[i][7] // Keep original createdAt
        ];
        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        return { success: true };
      }
    }
    return { success: false, error: 'Booking not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete booking
function deleteBooking(id) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Booking not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get users
function getUsers() {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return { success: true, data: [] };
    }

    const headers = data[0];
    const users = data.slice(1).map(row => {
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      return user;
    });
    return { success: true, data: users };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get boats
function getBoats() {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOATS_SHEET);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return { success: true, data: [] };
    }

    const headers = data[0];
    const boats = data.slice(1).map(row => {
      const boat = {};
      headers.forEach((header, index) => {
        boat[header] = row[index];
      });
      return boat;
    });
    return { success: true, data: boats };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Generate driver message
function generateDriverMessage(date) {
  try {
    const bookings = getBookings();
    if (!bookings.success) return { success: false, error: bookings.error };

    const dayBookings = bookings.data.filter(booking => booking.Date === date);
    let message = `Hello,\n\nBoat of KENDWA (James)\n\n`;

    dayBookings.forEach((booking, index) => {
      message += `Car ${index + 1}\n`;
      message += `Name : ${booking.Clients}\n`;
      message += `Number of pax : ${booking.TotalPAX} pax\n`;
      message += `Pick-up : 8.30\n`;
      message += `Location : Neptune pwani\n`;
      message += `Driver : 120k by James\n\n`;
    });

    return { success: true, message: message };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Generate staff message
function generateStaffMessage(date) {
  try {
    const bookings = getBookings();
    if (!bookings.success) return { success: false, error: bookings.error };

    const dayBookings = bookings.data.filter(booking => booking.Date === date);
    let message = `Hello Diana,\n\nTomorrow ${date} – ${dayBookings.length} boats going out.\n\n`;

    dayBookings.forEach((booking, index) => {
      const boatNames = ['MAYA 💛', 'PEARL 🧡', 'BELLA 🩵'];
      const boatName = boatNames[index] || `BOAT ${index + 1}`;
      message += `${boatName}\n`;
      message += `${booking.TripType} – ${booking.TotalPAX} adults\n`;
      message += `Meeting at 8:30 AM\n\n`;
      message += `➡️ ${booking.Clients}\n`;
      message += `${booking.TotalPAX} adults\n`;
      message += `Coming with Momo => 80k\n\n`;
    });

    return { success: true, message: message };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
} 