/**
 * Quick Start - Boat Management System Spreadsheet Generator
 * 
 * Instructions:
 * 1. Copy this entire file
 * 2. Create a new Google Apps Script project
 * 3. Paste this code into Code.gs
 * 4. Run the createSpreadsheet() function
 * 5. Copy the spreadsheet ID to your main project
 */

function createSpreadsheet() {
    try {
        console.log('🚀 Creating Boat Management System Spreadsheet...');

        // Create spreadsheet
        const ss = SpreadsheetApp.create('Boat Management System - ' + new Date().toISOString().split('T')[0]);
        const spreadsheetId = ss.getId();

        console.log('📊 Created spreadsheet: ' + ss.getUrl());

        // Create sheets with headers
        createSheet(ss, 'Bookings', [
            'ID', 'Date', 'Boat', 'TripType', 'Clients', 'Phone',
            'Adults', 'Children', 'TotalPAX', 'Payment', 'Paid',
            'Partner', 'Driver', 'Hotel', 'Transfer', 'Comments'
        ]);

        createSheet(ss, 'Users', [
            'ID', 'Name', 'Email', 'Password', 'Role', 'AccessBoats'
        ]);

        createSheet(ss, 'Boats', [
            'ID', 'Name', 'Color', 'MaxCapacity', 'Managers'
        ]);

        // Add sample data
        addQuickSampleData(ss);

        console.log('✅ Spreadsheet ready!');
        console.log('📋 Copy this ID to your Code.js:');
        console.log('SPREADSHEET_ID = "' + spreadsheetId + '";');

        return {
            success: true,
            id: spreadsheetId,
            url: ss.getUrl()
        };

    } catch (error) {
        console.error('❌ Error:', error);
        return { success: false, error: error.toString() };
    }
}

function createSheet(ss, name, headers) {
    const sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
    sheet.setFrozenRows(1);
    console.log('✅ Created ' + name + ' sheet');
}

function addQuickSampleData(ss) {
    const now = new Date().toISOString();

    // Sample bookings
    const bookings = [
        ['1', '2025-08-05', 'MAYA', 'Private', 'Bella Vista', '+33 6 07 40 56 40', 7, 0, 7, '480$', 'TBC', 'Valentin', 'James', 'White Sand', 'Yes', 'Option for Sharlene'],
        ['2', '2025-08-09', 'PEARL', 'Shared', 'Aurélie', '+33 6 12 34 56 78', 2, 2, 4, '170€', 'Paid', 'Nerea', 'Juma', 'Zan View', 'Yes', 'Family with children'],
        ['3', '2025-08-09', 'PEARL', 'Shared', 'Amina et kaddour', '+33 6 98 76 54 32', 2, 0, 2, '150€', 'Paid', 'Nerea', 'Juma', 'Morroko Lounge', 'Yes', 'Couple booking'],
        ['4', '2025-08-10', 'BELLA', 'Private', 'Scott Busse', '+1 555 123 4567', 2, 0, 2, '320$', 'Paid', 'White Sand', 'Momo', 'Neptune Pwani', 'No', 'Private sunset cruise']
    ];

    const bookingsSheet = ss.getSheetByName('Bookings');
    if (bookings.length > 0) {
        bookingsSheet.getRange(2, 1, bookings.length, bookings[0].length).setValues(bookings);
    }

    // Sample users
    const users = [
        ['1', 'Christophe', 'christophe@boatmanagement.com', 'YWJjMTIz', 'Admin', '*'],
        ['2', 'Diana', 'diana@boatmanagement.com', 'YWJjMTIz', 'Staff', '*'],
        ['3', 'James', 'james@boatmanagement.com', 'YWJjMTIz', 'Driver', '1,2']
    ];

    const usersSheet = ss.getSheetByName('Users');
    if (users.length > 0) {
        usersSheet.getRange(2, 1, users.length, users[0].length).setValues(users);
    }

    // Sample boats
    const boats = [
        ['BOAT-1', 'MAYA', '💛 Yellow', 12, 'James,Momo'],
        ['BOAT-2', 'PEARL', '🧡 Orange', 14, 'Juma'],
        ['BOAT-3', 'BELLA', '🩵 Blue', 8, 'Jumah,Momo']
    ];

    const boatsSheet = ss.getSheetByName('Boats');
    if (boats.length > 0) {
        boatsSheet.getRange(2, 1, boats.length, boats[0].length).setValues(boats);
    }

    console.log('✅ Added sample data');
} 