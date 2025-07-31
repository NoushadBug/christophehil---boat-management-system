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
const TRIP_TYPES_SHEET = 'TripTypes';
const SETTINGS_SHEET = 'Settings';
const DRIVERS_SHEET = 'Drivers';
const PARTNERS_SHEET = 'Partners';

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

// Get all bookings with enhanced structure
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
    }).filter(booking => booking.IsArchived !== 'Yes'); // Filter out archived bookings

    return { success: true, data: bookings };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add new booking with enhanced structure
function addBooking(bookingData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);

    // Generate unique booking ID
    const bookingId = 'BOOK-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
      Math.random().toString(36).substr(2, 4).toUpperCase();

    // Get trip color from TripTypes sheet
    const tripTypesSheet = ss.getSheetByName(TRIP_TYPES_SHEET);
    const tripTypesData = tripTypesSheet.getDataRange().getValues();
    const tripTypeRow = tripTypesData.find(row => row[0] === bookingData.tripType);
    const tripColorHex = tripTypeRow ? tripTypeRow[2] : '#6B7280';

    const newRow = [
      bookingId,
      bookingData.date,
      bookingData.boat || 'MAYA',
      bookingData.tripType,
      tripColorHex,
      'Confirmed', // Default status
      bookingData.clients,
      bookingData.phone || '',
      bookingData.adults || 0,
      bookingData.children || 0,
      bookingData.childAges || '',
      bookingData.totalPax,
      bookingData.payment || '',
      bookingData.paid || 'TBC',
      bookingData.commission || '',
      bookingData.partner || '',
      bookingData.driver || '',
      bookingData.hotel || '',
      bookingData.transfer || 'No',
      bookingData.transferTime || '',
      bookingData.comments || '',
      'No', // IsArchived
      new Date().toISOString(),
      new Date().toISOString()
    ];

    sheet.appendRow(newRow);
    return { success: true, id: bookingId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update booking with enhanced structure
function updateBooking(id, bookingData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const bookingIdIndex = headers.indexOf('BookingID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][bookingIdIndex] === id) {
        // Get trip color from TripTypes sheet
        const tripTypesSheet = ss.getSheetByName(TRIP_TYPES_SHEET);
        const tripTypesData = tripTypesSheet.getDataRange().getValues();
        const tripTypeRow = tripTypesData.find(row => row[0] === bookingData.tripType);
        const tripColorHex = tripTypeRow ? tripTypeRow[2] : '#6B7280';

        const updatedRow = [
          id,
          bookingData.date,
          bookingData.boat || 'MAYA',
          bookingData.tripType,
          tripColorHex,
          bookingData.status || 'Confirmed',
          bookingData.clients,
          bookingData.phone || '',
          bookingData.adults || 0,
          bookingData.children || 0,
          bookingData.childAges || '',
          bookingData.totalPax,
          bookingData.payment || '',
          bookingData.paid || 'TBC',
          bookingData.commission || '',
          bookingData.partner || '',
          bookingData.driver || '',
          bookingData.hotel || '',
          bookingData.transfer || 'No',
          bookingData.transferTime || '',
          bookingData.comments || '',
          'No', // IsArchived
          data[i][22], // Keep original createdAt
          new Date().toISOString() // UpdatedAt
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

// Delete booking (soft delete by setting IsArchived to Yes)
function deleteBooking(id) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const bookingIdIndex = headers.indexOf('BookingID');
    const isArchivedIndex = headers.indexOf('IsArchived');

    for (let i = 1; i < data.length; i++) {
      if (data[i][bookingIdIndex] === id) {
        // Soft delete by setting IsArchived to Yes
        sheet.getRange(i + 1, isArchivedIndex + 1).setValue('Yes');
        return { success: true };
      }
    }
    return { success: false, error: 'Booking not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get users with enhanced structure
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
    }).filter(user => user.IsActive === 'Yes'); // Only active users

    return { success: true, data: users };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get boats with enhanced structure
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
    }).filter(boat => boat.IsActive === 'Yes'); // Only active boats

    return { success: true, data: boats };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get trip types
function getTripTypes() {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(TRIP_TYPES_SHEET);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return { success: true, data: [] };
    }

    const headers = data[0];
    const tripTypes = data.slice(1).map(row => {
      const tripType = {};
      headers.forEach((header, index) => {
        tripType[header] = row[index];
      });
      return tripType;
    }).filter(tripType => tripType.IsActive === 'Yes'); // Only active trip types

    return { success: true, data: tripTypes };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add user
function addUser(userData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);

    const userId = 'USER-' + new Date().getTime();
    const newRow = [
      userId,
      userData.name,
      userData.email,
      userData.password || 'password123',
      userData.role || 'Staff',
      userData.accessBoats || '',
      'Yes', // IsActive
      new Date().toISOString()
    ];

    sheet.appendRow(newRow);
    return { success: true, id: userId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update user
function updateUser(id, userData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const userIdIndex = headers.indexOf('ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][userIdIndex] === id) {
        const updatedRow = [
          id,
          userData.name,
          userData.email,
          userData.password || data[i][3], // Keep existing password if not provided
          userData.role || 'Staff',
          userData.accessBoats || '',
          'Yes', // IsActive
          data[i][7] // Keep original createdAt
        ];

        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        return { success: true };
      }
    }
    return { success: false, error: 'User not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete user (soft delete)
function deleteUser(id) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const userIdIndex = headers.indexOf('ID');
    const isActiveIndex = headers.indexOf('IsActive');

    for (let i = 1; i < data.length; i++) {
      if (data[i][userIdIndex] === id) {
        sheet.getRange(i + 1, isActiveIndex + 1).setValue('No');
        return { success: true };
      }
    }
    return { success: false, error: 'User not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add boat
function addBoat(boatData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOATS_SHEET);

    const boatId = 'BOAT-' + new Date().getTime();
    const newRow = [
      boatId,
      boatData.name,
      boatData.color || '🛥️',
      boatData.maxCapacity || 12,
      boatData.managers || '',
      'Yes', // IsActive
      new Date().toISOString()
    ];

    sheet.appendRow(newRow);
    return { success: true, id: boatId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update boat
function updateBoat(id, boatData) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOATS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const boatIdIndex = headers.indexOf('ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][boatIdIndex] === id) {
        const updatedRow = [
          id,
          boatData.name,
          boatData.color || '🛥️',
          boatData.maxCapacity || 12,
          boatData.managers || '',
          'Yes', // IsActive
          data[i][6] // Keep original createdAt
        ];

        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        return { success: true };
      }
    }
    return { success: false, error: 'Boat not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete boat (soft delete)
function deleteBoat(id) {
  try {
    if (!SPREADSHEET_ID) {
      initializeSpreadsheet();
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(BOATS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const boatIdIndex = headers.indexOf('ID');
    const isActiveIndex = headers.indexOf('IsActive');

    for (let i = 1; i < data.length; i++) {
      if (data[i][boatIdIndex] === id) {
        sheet.getRange(i + 1, isActiveIndex + 1).setValue('No');
        return { success: true };
      }
    }
    return { success: false, error: 'Boat not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Generate driver message with enhanced structure
function generateDriverMessage(date) {
  try {
    const bookings = getBookings();
    if (!bookings.success) return { success: false, error: bookings.error };

    const dayBookings = bookings.data.filter(booking => booking.Date === date && booking.Status !== 'Cancelled');

    if (dayBookings.length === 0) {
      return { success: true, message: 'No bookings found for this date.' };
    }

    let message = `Hello,\n\nBoat of KENDWA (James)\n\n`;

    dayBookings.forEach((booking, index) => {
      message += `Car ${index + 1}\n`;
      message += `Name : ${booking.Clients}\n`;
      message += `Number of pax : ${booking.TotalPAX} pax\n`;
      message += `Pick-up : ${booking.TransferTime || '8.30'}\n`;
      message += `Location : ${booking.Hotel || 'Neptune pwani'}\n`;
      message += `Driver : 120k by ${booking.Driver || 'James'}\n\n`;
    });

    return { success: true, message: message };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Generate staff message with enhanced structure
function generateStaffMessage(date) {
  try {
    const bookings = getBookings();
    if (!bookings.success) return { success: false, error: bookings.error };

    const dayBookings = bookings.data.filter(booking => booking.Date === date && booking.Status !== 'Cancelled');

    if (dayBookings.length === 0) {
      return { success: true, message: 'No bookings found for this date.' };
    }

    // Group bookings by boat
    const bookingsByBoat = {};
    dayBookings.forEach(booking => {
      if (!bookingsByBoat[booking.Boat]) {
        bookingsByBoat[booking.Boat] = [];
      }
      bookingsByBoat[booking.Boat].push(booking);
    });

    let message = `Hello Diana,\n\nTomorrow ${date} – ${Object.keys(bookingsByBoat).length} boats going out.\n\n`;

    Object.keys(bookingsByBoat).forEach((boatName, boatIndex) => {
      const boatBookings = bookingsByBoat[boatName];
      const totalPax = boatBookings.reduce((sum, booking) => sum + (parseInt(booking.TotalPAX) || 0), 0);

      // Get boat color from Boats sheet
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const boatsSheet = ss.getSheetByName(BOATS_SHEET);
      const boatsData = boatsSheet.getDataRange().getValues();
      const boatRow = boatsData.find(row => row[1] === boatName);
      const boatColor = boatRow ? boatRow[2] : '🛥️';

      message += `${boatName} ${boatColor}\n`;
      message += `${boatBookings[0].TripType} – ${totalPax} adults\n`;
      message += `Meeting at 8:30 AM\n\n`;

      boatBookings.forEach(booking => {
        message += `➡️ ${booking.Clients}\n`;
        message += `${booking.TotalPAX} adults`;
        if (booking.Partner) {
          message += ` – ${booking.Partner}'s clients`;
        }
        message += `\n`;
        if (booking.Payment && booking.Payment !== '0€') {
          message += `Paying ${booking.Payment}\n`;
        }
        message += `Coming with ${booking.Driver || 'Momo'} => 80k\n\n`;
      });
    });

    return { success: true, message: message };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
} 