function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheetIdFromProperties() {
  var id = PropertiesService.getScriptProperties().getProperty('BOAT_MGMT_SHEET_ID');
  return id;
}

function doGet() {
  var sheetId = getSheetIdFromProperties();
  if (!sheetId) {
    // No sheet ID set, show message and log generator output
    var html = HtmlService.createHtmlOutput(
      '<div style="max-width:500px;margin:40px auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 2px 12px #0001;text-align:center">' +
      '<h2 style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem">No spreadsheet found</h2>' +
      '<p style="margin-bottom:1.5rem">Please run the generator to create the Boat Management System spreadsheet.</p>' +
      '<button id="runGenBtn" style="background:#2563eb;color:#fff;padding:0.75rem 2rem;border:none;border-radius:6px;font-size:1rem;cursor:pointer">Run Generator</button>' +
      '<pre id="genLog" style="margin-top:2rem;text-align:left;max-height:500px;min-height:220px;overflow:auto;background:#f3f4f6;padding:1rem;border-radius:6px;font-size:0.95rem"></pre>' +
      '<div id="reloadDiv" style="margin-top:1.5rem;display:none;color:#059669;font-weight:500;font-size:1.1rem">Generation complete. <b>Please reload the page</b> to continue.</div>' +
      '<script>' +
      'document.getElementById("runGenBtn").onclick = function() {' +
      '  this.disabled = true; this.innerText = "Running...";' +
      '  google.script.run.withSuccessHandler(function(res) {' +
      '    document.getElementById("runGenBtn").style.display = "none";' +
      '    document.getElementById("genLog").innerText = res && res.logs ? res.logs : "No logs.";' +
      '    document.getElementById("reloadDiv").style.display = "block";' +
      '  }).withFailureHandler(function(e){' +
      '    document.getElementById("genLog").innerText = "❌ Generator failed: " + e;' +
      '    document.getElementById("reloadDiv").style.display = "block";' +
      '  }).runGeneratorWithLogs();' +
      '};' +
      '</script>' +
      '</div>'
    );
    html.setTitle('Boat Management System');
    html.addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return html;
  }
  var html = HtmlService.createTemplateFromFile('Backend/Client/Main');
  var evaluated = html.evaluate();
  evaluated.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return evaluated.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/6733/6733991.png')
    .setTitle('Boat Management System');
}

function runGeneratorWithLogs() {
  var logs = [];
  function log(msg) { logs.push(msg); }
  try {
    log('🚀 Starting Boat Management System Spreadsheet Generator...');
    var result = runGenerator(log);
    log('✅ Generator finished.');
    return { success: true, logs: logs.join('\n'), ...result };
  } catch (err) {
    log('❌ Error: ' + err);
    return { success: false, logs: logs.join('\n'), error: err.toString() };
  }
}

// Global variables for data management
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
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      // Create new spreadsheet
      const ss = SpreadsheetApp.create('Boat Management System');
      sheetId = ss.getId();
      PropertiesService.getScriptProperties().setProperty('BOAT_MGMT_SHEET_ID', sheetId);
    }

    return SpreadsheetApp.openById(sheetId);
  } catch (e) {
    console.error('Error initializing spreadsheet:', e);
    throw e;
  }
}

// Cached sheet fetcher for efficiency
function getSheetData(sheetName) {
  const cache = CacheService.getScriptCache();
  const key = 'data_' + sheetName;
  const cached = cache.get(key);
  if (cached) return JSON.parse(cached);
  const sheetId = getSheetIdFromProperties() || initializeSpreadsheet().getId();
  const ss = SpreadsheetApp.openById(sheetId);
  const data = ss.getSheetByName(sheetName).getDataRange().getValues();
  cache.put(key, JSON.stringify(data), 60);
  return data;
}

function clearSheetCache(sheetName) {
  CacheService.getScriptCache().remove('data_' + sheetName);
}

// Check if user has specific permission
function hasPermission(user, permission) {
  if (!user || !user.Role) return false;
  if (user.Role === 'Admin') return true;
  const perms = (user.Permissions || '').split(',').map(p => p.trim().toLowerCase());
  return perms.includes('all') || perms.includes(permission.toLowerCase());
}

// Map boat names to IDs
function getBoatMap() {
  const data = getSheetData(BOATS_SHEET);
  const headers = data[0];
  const nameIdx = headers.indexOf('Name');
  const idIdx = headers.indexOf('ID');
  const map = {};
  for (let i = 1; i < data.length; i++) {
    map[data[i][nameIdx]] = String(data[i][idIdx]);
  }
  return map;
}

// Fetch bookings with permission filtering
function getBookings(user) {
  try {
    const data = getSheetData(BOOKINGS_SHEET);
    if (data.length <= 1) {
      return { success: true, data: [] };
    }
    const headers = data[0];
    let bookings = data.slice(1).map(row => {
      const booking = {};
      headers.forEach((header, index) => {
        booking[header] = row[index];
      });
      return booking;
    }).filter(booking => booking.IsArchived !== 'Yes');
    if (user && user.Role !== 'Admin') {
      if (!hasPermission(user, 'view')) {
        return { success: false, error: 'Unauthorized' };
      }
      const allowed = (user.AccessBoats || '').split(',').map(id => id.trim());
      const boatMap = getBoatMap();
      bookings = bookings.filter(b => allowed.includes(boatMap[b.Boat]));
    }
    return { success: true, data: bookings };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add new booking with enhanced structure
function addBooking(user, bookingData) {
  try {
    if (!hasPermission(user, 'edit')) {
      return { success: false, error: 'Unauthorized' };
    }
    const boatMap = getBoatMap();
    const boatId = boatMap[bookingData.boat];
    const allowed = (user.AccessBoats || '').split(',').map(id => id.trim());
    if (user.Role !== 'Admin' && !allowed.includes(boatId)) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const bookingId = 'BOOK-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
      Math.random().toString(36).substr(2, 4).toUpperCase();
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
      'Confirmed',
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
      'No',
      new Date().toISOString(),
      new Date().toISOString()
    ];
    sheet.appendRow(newRow);
    clearSheetCache(BOOKINGS_SHEET);
    return { success: true, id: bookingId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update booking with permission checks
function updateBooking(user, id, bookingData) {
  try {
    if (!hasPermission(user, 'edit')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const bookingIdIndex = headers.indexOf('BookingID');
    const boatMap = getBoatMap();
    for (let i = 1; i < data.length; i++) {
      if (data[i][bookingIdIndex] === id) {
        const boatName = bookingData.boat || data[i][2];
        const boatId = boatMap[boatName];
        const allowed = (user.AccessBoats || '').split(',').map(b => b.trim());
        if (user.Role !== 'Admin' && !allowed.includes(boatId)) {
          return { success: false, error: 'Unauthorized' };
        }
        const tripTypesSheet = ss.getSheetByName(TRIP_TYPES_SHEET);
        const tripTypesData = tripTypesSheet.getDataRange().getValues();
        const tripTypeRow = tripTypesData.find(row => row[0] === bookingData.tripType);
        const tripColorHex = tripTypeRow ? tripTypeRow[2] : '#6B7280';
        const updatedRow = [
          id,
          bookingData.date,
          boatName,
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
          'No',
          data[i][22],
          new Date().toISOString()
        ];
        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        clearSheetCache(BOOKINGS_SHEET);
        return { success: true };
      }
    }
    return { success: false, error: 'Booking not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete booking (soft delete by setting IsArchived to Yes)
function deleteBooking(user, id) {
  try {
    if (!hasPermission(user, 'edit')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const bookingIdIndex = headers.indexOf('BookingID');
    const isArchivedIndex = headers.indexOf('IsArchived');
    const boatMap = getBoatMap();
    for (let i = 1; i < data.length; i++) {
      if (data[i][bookingIdIndex] === id) {
        const boatId = boatMap[data[i][2]];
        const allowed = (user.AccessBoats || '').split(',').map(b => b.trim());
        if (user.Role !== 'Admin' && !allowed.includes(boatId)) {
          return { success: false, error: 'Unauthorized' };
        }
        sheet.getRange(i + 1, isArchivedIndex + 1).setValue('Yes');
        clearSheetCache(BOOKINGS_SHEET);
        return { success: true };
      }
    }
    return { success: false, error: 'Booking not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get users with enhanced structure
function getUsers(user) {
  try {
    if (!hasPermission(user, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    const data = getSheetData(USERS_SHEET);
    if (data.length <= 1) {
      return { success: true, data: [] };
    }
    const headers = data[0];
    const users = data.slice(1).map(row => {
      const u = {};
      headers.forEach((header, index) => {
        u[header] = row[index];
      });
      return u;
    }).filter(u => u.IsActive === 'Yes');
    return { success: true, data: users };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get boats with enhanced structure
function getBoats(user) {
  try {
    const data = getSheetData(BOATS_SHEET);
    if (data.length <= 1) {
      return { success: true, data: [] };
    }
    const headers = data[0];
    let boats = data.slice(1).map(row => {
      const boat = {};
      headers.forEach((header, index) => {
        boat[header] = row[index];
      });
      return boat;
    }).filter(boat => boat.IsActive === 'Yes');
    if (user && user.Role !== 'Admin') {
      if (!hasPermission(user, 'view')) {
        return { success: true, data: [] };
      }
      const allowed = (user.AccessBoats || '').split(',').map(id => id.trim());
      boats = boats.filter(b => allowed.includes(String(b.ID)));
    }
    return { success: true, data: boats };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get trip types
function getTripTypes() {
  try {
    const data = getSheetData(TRIP_TYPES_SHEET);

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
function addUser(requestingUser, userData) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    if (!userData.password) {
      return { success: false, error: 'Password required' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const lastId = data.length > 1 ? Number(data[data.length - 1][0]) : 0;
    const userId = lastId + 1;
    const now = new Date().toISOString();
    const newRow = [
      userId,
      userData.name,
      userData.email,
      userData.password,
      userData.role || 'Staff',
      userData.accessBoats || '',
      userData.permissions || '',
      userData.phone || '',
      'Yes',
      '',
      now
    ];
    sheet.appendRow(newRow);
    clearSheetCache(USERS_SHEET);
    return { success: true, id: userId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update user
function updateUser(requestingUser, id, userData) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
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
          userData.password || data[i][3],
          userData.role || data[i][4],
          userData.accessBoats || data[i][5],
          userData.permissions || data[i][6],
          userData.phone || data[i][7],
          data[i][8],
          data[i][9],
          data[i][10]
        ];
        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        clearSheetCache(USERS_SHEET);
        return { success: true };
      }
    }
    return { success: false, error: 'User not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete user (soft delete)
function deleteUser(requestingUser, id) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const userIdIndex = headers.indexOf('ID');
    const isActiveIndex = headers.indexOf('IsActive');
    for (let i = 1; i < data.length; i++) {
      if (data[i][userIdIndex] === id) {
        sheet.getRange(i + 1, isActiveIndex + 1).setValue('No');
        clearSheetCache(USERS_SHEET);
        return { success: true };
      }
    }
    return { success: false, error: 'User not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Add boat
function addBoat(requestingUser, boatData) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(BOATS_SHEET);
    const boatId = 'BOAT-' + new Date().getTime();
    const newRow = [
      boatId,
      boatData.name,
      boatData.color || '🛥️',
      boatData.maxCapacity || 12,
      boatData.managers || '',
      'Yes',
      new Date().toISOString()
    ];
    sheet.appendRow(newRow);
    clearSheetCache(BOATS_SHEET);
    return { success: true, id: boatId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Update boat
function updateBoat(requestingUser, id, boatData) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
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
          'Yes',
          data[i][6]
        ];
        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        clearSheetCache(BOATS_SHEET);
        return { success: true };
      }
    }
    return { success: false, error: 'Boat not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Delete boat (soft delete)
function deleteBoat(requestingUser, id) {
  try {
    if (!hasPermission(requestingUser, 'all')) {
      return { success: false, error: 'Unauthorized' };
    }
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(BOATS_SHEET);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const boatIdIndex = headers.indexOf('ID');
    const isActiveIndex = headers.indexOf('IsActive');
    for (let i = 1; i < data.length; i++) {
      if (data[i][boatIdIndex] === id) {
        sheet.getRange(i + 1, isActiveIndex + 1).setValue('No');
        clearSheetCache(BOATS_SHEET);
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
      const ss = SpreadsheetApp.openById(getSheetIdFromProperties());
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

// User login/authentication
function loginUser(email, password) {
  try {
    var sheetId = getSheetIdFromProperties();
    if (!sheetId) {
      initializeSpreadsheet();
    }
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(USERS_SHEET);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { success: false, error: 'No users found.' };
    }
    const headers = data[0];
    const emailIdx = headers.indexOf('Email');
    const passwordIdx = headers.indexOf('Password');
    const isActiveIdx = headers.indexOf('IsActive');
    const lastLoginIdx = headers.indexOf('LastLoginAt');
    let userRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailIdx] === email && data[i][isActiveIdx] === 'Yes') {
        userRowIndex = i;
        break;
      }
    }
    if (userRowIndex === -1) {
      return { success: false, error: 'Invalid email or inactive user.' };
    }
    const userRow = data[userRowIndex];
    var inputPassword = password;
    var inputPasswordBase64 = Utilities.base64Encode(password);
    if (userRow[passwordIdx] !== inputPassword && userRow[passwordIdx] !== inputPasswordBase64) {
      return { success: false, error: 'Invalid password.' };
    }
    sheet.getRange(userRowIndex + 1, lastLoginIdx + 1).setValue(new Date().toISOString());
    const user = {};
    headers.forEach((header, idx) => {
      if (header !== 'Password') user[header] = userRow[idx];
    });
    return { success: true, user: user };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}