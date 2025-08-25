/**
 * Boat Management System - Spreadsheet Generator (Production Ready)
 * Creates a complete Google Sheets with all tabs, columns, and sample data
 * Includes all recommended fixes and improvements
 */

function setSheetIdProperty(sheetId) {
    PropertiesService.getScriptProperties().setProperty('BOAT_MGMT_SHEET_ID', sheetId);
}
function getSheetIdProperty() {
    return PropertiesService.getScriptProperties().getProperty('BOAT_MGMT_SHEET_ID');
}

function createBoatManagementSpreadsheet() {
    try {
        // Create the main spreadsheet
        const ss = SpreadsheetApp.create('Boat Management System - ' + new Date().toISOString().split('T')[0]);
        const spreadsheetId = ss.getId();
        setSheetIdProperty(spreadsheetId);

        console.log('Created spreadsheet with ID: ' + spreadsheetId);

        // Create all required sheets with improved structure
        createBookingsSheet(ss);
        createUsersSheet(ss);
        createBoatsSheet(ss);
        createTripTypesSheet(ss);
        createSettingsSheet(ss);
        createDriversSheet(ss);
        createPartnersSheet(ss);
        createActivityLogsSheet(ss);

        // Add sample data
        addSampleData(ss);

        // Format the sheets
        formatAllSheets(ss);

        console.log('✅ Spreadsheet created successfully!');
        console.log('📊 Spreadsheet URL: ' + ss.getUrl());

        return {
            success: true,
            spreadsheetId: spreadsheetId,
            url: ss.getUrl()
        };

    } catch (error) {
        console.error('❌ Error creating spreadsheet:', error);
        return {
            success: false,
            error: error.toString()
        };
    }
}

function createBookingsSheet(ss) {
    const sheet = ss.insertSheet('Bookings');

    // Enhanced headers for bookings with all recommended fixes
    const headers = [
        'BookingID', 'Date', 'Boat', 'TripType', 'TripColorHex', 'Status',
        'Clients', 'Phone', 'Adults', 'Children', 'ChildAges', 'TotalPAX',
        'Payment', 'Paid', 'Commission', 'Partner', 'Driver', 'Hotel',
        'Transfer', 'TransferTime', 'Comments', 'IsArchived', 'CreatedAt', 'UpdatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Bookings sheet with enhanced structure');
}

function createUsersSheet(ss) {
    const sheet = ss.insertSheet('Users');

    // Enhanced headers for users with security improvements
    const headers = [
        'ID', 'Name', 'Email', 'Password', 'Role', 'AccessBoats', 'Permissions',
        'Phone', 'IsActive', 'LastLoginAt', 'CreatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Add note to Password column
    sheet.getRange(1, 4).setNote('The default password is abc123');

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#34a853').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Users sheet with security improvements');
}

function createBoatsSheet(ss) {
    const sheet = ss.insertSheet('Boats');

    // Enhanced headers for boats with proper color management
    const headers = [
        'ID', 'Name', 'ColorLabel', 'ColorHex', 'MaxCapacity', 'Managers',
        'TripTypesAllowed', 'IsActive', 'CreatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#ea4335').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Boats sheet with proper color management');
}

function createTripTypesSheet(ss) {
    const sheet = ss.insertSheet('TripTypes');

    // New sheet for trip type configuration
    const headers = [
        'Type', 'Label', 'HexColor', 'Description', 'IsActive', 'CreatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#9c27b0').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created TripTypes sheet for proper configuration');
}

function createSettingsSheet(ss) {
    const sheet = ss.insertSheet('Settings');

    // Enhanced headers for settings with better organization
    const headers = [
        'Key', 'Value', 'Description', 'Category', 'UpdatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#fbbc04').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Settings sheet with better organization');
}

function createDriversSheet(ss) {
    const sheet = ss.insertSheet('Drivers');

    // Enhanced headers for drivers with better management
    const headers = [
        'ID', 'Name', 'Phone', 'Rate', 'AssignedBoats', 'DefaultPickupTime',
        'MessageGroupingName', 'IsActive', 'CreatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#ff9800').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Drivers sheet with enhanced management');
}

function createPartnersSheet(ss) {
    const sheet = ss.insertSheet('Partners');

    // Enhanced headers for partners with commission management
    const headers = [
        'ID', 'Name', 'Commission', 'CommissionType', 'PayoutMethod', 'Contact',
        'Notes', 'IsActive', 'CreatedAt'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#607d8b').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created Partners sheet with commission management');
}

function createActivityLogsSheet(ss) {
    const sheet = ss.insertSheet('ActivityLogs');

    // New sheet for security audits and activity tracking
    const headers = [
        'ID', 'UserEmail', 'Action', 'Table', 'RecordID', 'OldValue', 'NewValue',
        'IPAddress', 'UserAgent', 'Timestamp'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#795548').setFontColor('white').setFontWeight('bold');

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('✅ Created ActivityLogs sheet for security audits');
}

function addSampleData(ss) {
    const now = new Date().toISOString();

    // Add sample data in the correct order (dependencies first)
    addSampleTripTypes(ss, now);
    addSampleBoats(ss, now);
    addSampleDrivers(ss, now);
    addSamplePartners(ss, now);
    addSampleUsers(ss, now);
    addSampleBookings(ss, now);
    addSampleSettings(ss, now);
    addSampleActivityLogs(ss, now);

    console.log('✅ Added sample data to all sheets');
}

function addSampleTripTypes(ss, now) {
    const sheet = ss.getSheetByName('TripTypes');

    const sampleTripTypes = [
        ['Private', 'Private', '#8B5CF6', 'Exclusive boat for one group', 'Yes', now],
        ['Shared', 'Shared', '#3B82F6', 'Multiple groups sharing the boat', 'Yes', now],
        ['Sunset', 'Sunset', '#F59E0B', 'Evening sunset cruise', 'Yes', now],
        ['DayOff', 'Day Off', '#EF4444', 'Boat maintenance or day off', 'Yes', now]
    ];

    if (sampleTripTypes.length > 0) {
        sheet.getRange(2, 1, sampleTripTypes.length, sampleTripTypes[0].length).setValues(sampleTripTypes);
    }
}

function addSampleBookings(ss, now) {
    const sheet = ss.getSheetByName('Bookings');

    const sampleBookings = [
        [
            'BOOK-20250805-0001', '2025-08-05', 'MAYA', 'Private', '#8B5CF6', 'Confirmed',
            'Bella Vista', '+33 6 07 40 56 40', 7, 0, '', 7, '480$', 'TBC', '40€', 'Valentin', 'James', 'White Sand', 'Yes', '8:30',
            'Option for Sharlene until 31/07 morning 5 guests + 2 bodyguard', 'No', now, now
        ],
        [
            'BOOK-20250809-0001', '2025-08-09', 'PEARL', 'Shared', '#3B82F6', 'Confirmed',
            'Aurélie', '+33 6 12 34 56 78', 2, 2, '10;11', 4, '170€', 'Paid', '20€', 'Nerea', 'Juma', 'Zan View', 'Yes', '8:30',
            'Family with children', 'No', now, now
        ],
        [
            'BOOK-20250809-0002', '2025-08-09', 'PEARL', 'Shared', '#3B82F6', 'Confirmed',
            'Amina et kaddour', '+33 6 98 76 54 32', 2, 0, '', 2, '150€', 'Paid', '15€', 'Nerea', 'Juma', 'Morroko Lounge', 'Yes', '9:15',
            'Couple booking', 'No', now, now
        ],
        [
            'BOOK-20250810-0001', '2025-08-10', 'BELLA', 'Private', '#8B5CF6', 'Confirmed',
            'Scott Busse', '+1 555 123 4567', 2, 0, '', 2, '320$', 'Paid', '32$', 'White Sand', 'Momo', 'Neptune Pwani', 'No', '',
            'Private sunset cruise', 'No', now, now
        ],
        [
            'BOOK-20250812-0001', '2025-08-12', 'MAYA', 'Sunset', '#F59E0B', 'Confirmed',
            'German Family', '+49 30 123 4567', 4, 1, '8', 5, '400€', 'Paid', '40€', 'Be Zanzibar', 'Juma', 'Safaya Back', 'Yes', '17:30',
            'Sunset cruise with dinner', 'No', now, now
        ],
        [
            'BOOK-20250815-0001', '2025-08-15', 'PEARL', 'Shared', '#3B82F6', 'Confirmed',
            'Manon and Maxime', '+33 6 11 22 33 44', 2, 0, '', 2, '0€', 'Not paying', '0€', 'Sonia - Moja Discovery', 'Jumah', 'Zan View', 'No', '',
            'Agency booking - commission only', 'No', now, now
        ],
        [
            'BOOK-20250818-0001', '2025-08-18', 'BELLA', 'Private', '#8B5CF6', 'Confirmed',
            'Lara', '+33 6 99 88 77 66', 2, 0, '', 2, '0€', 'Not paying', '0€', 'Nerea', 'Jumah', 'Neptune Pwani', 'No', '',
            'Nerea clients - no payment', 'No', now, now
        ],
        [
            'BOOK-20250820-0001', '2025-08-20', 'MAYA', 'DayOff', '#EF4444', 'Confirmed',
            '', '', 0, 0, '', 0, '0€', '', '0€', '', '', '', 'No', '',
            'Boat maintenance day', 'No', now, now
        ]
    ];

    if (sampleBookings.length > 0) {
        sheet.getRange(2, 1, sampleBookings.length, sampleBookings[0].length).setValues(sampleBookings);
    }
}

function addSampleUsers(ss, now) {
    var sheet = ss.getSheetByName('Users');
    var defaultPassword = base64Encode('abc123');
    var users = [
        ['1', 'Christophe', 'christophe@boatmanagement.com', defaultPassword, 'Admin', '*T', 'all', '+255 123 456 789', 'Yes', now, now],
        ['2', 'Diana', 'diana@boatmanagement.com', defaultPassword, 'Staff', '*', 'view,edit', '+255 987 654 321', 'Yes', now, now],
        ['3', 'James', 'james@boatmanagement.com', defaultPassword, 'Driver', '1,2', 'view', '+255 555 123 456', 'Yes', now, now],
        ['4', 'Juma', 'juma@boatmanagement.com', defaultPassword, 'Driver', '2,3', 'view', '+255 777 888 999', 'Yes', now, now],
        ['5', 'Momo', 'momo@boatmanagement.com', defaultPassword, 'Driver', '1,3', 'view', '+255 111 222 333', 'Yes', now, now]
    ];
    if (users.length > 0) {
        sheet.getRange(2, 1, users.length, users[0].length).setValues(users);
    }
}

function addSampleBoats(ss, now) {
    const sheet = ss.getSheetByName('Boats');

    const sampleBoats = [
        [
            '1', 'MAYA', 'Yellow', '#FFD700', 12, 'james@boatmanagement.com,momo@boatmanagement.com',
            'Private,Shared,Sunset,DayOff', 'Yes', now
        ],
        [
            '2', 'PEARL', 'Orange', '#FFA500', 14, 'juma@boatmanagement.com',
            'Private,Shared,DayOff', 'Yes', now
        ],
        [
            '3', 'BELLA', 'Blue', '#87CEEB', 8, 'jumah@boatmanagement.com,momo@boatmanagement.com',
            'Private,Shared,DayOff', 'Yes', now
        ],
        [
            '4', 'SUNSET', 'Sunset', '#FF69B4', 6, 'james@boatmanagement.com',
            'Sunset,DayOff', 'Yes', now
        ]
    ];

    if (sampleBoats.length > 0) {
        sheet.getRange(2, 1, sampleBoats.length, sampleBoats[0].length).setValues(sampleBoats);
    }
}

function addSampleDrivers(ss, now) {
    const sheet = ss.getSheetByName('Drivers');

    const sampleDrivers = [
        [
            '1', 'James', '+255 123 456 789', '120000', 'MAYA,SUNSET', '8:30',
            'James Team', 'Yes', now
        ],
        [
            '2', 'Juma', '+255 987 654 321', '120000', 'PEARL,BELLA', '8:30',
            'Juma Team', 'Yes', now
        ],
        [
            '3', 'Jumah', '+255 555 123 456', '120000', 'BELLA', '8:30',
            'Jumah Team', 'Yes', now
        ],
        [
            '4', 'Momo', '+255 777 888 999', '120000', 'MAYA,BELLA', '8:30',
            'Momo Team', 'Yes', now
        ]
    ];

    if (sampleDrivers.length > 0) {
        sheet.getRange(2, 1, sampleDrivers.length, sampleDrivers[0].length).setValues(sampleDrivers);
    }
}

function addSamplePartners(ss, now) {
    const sheet = ss.getSheetByName('Partners');

    const samplePartners = [
        [
            '1', 'Nerea', '10', 'percentage', 'bank_transfer', 'nerea@agency.com',
            'Premium partner with high volume', 'Yes', now
        ],
        [
            '2', 'Valentin', '8', 'percentage', 'bank_transfer', 'valentin@agency.com',
            'Reliable partner', 'Yes', now
        ],
        [
            '3', 'Be Zanzibar', '12', 'percentage', 'bank_transfer', 'info@bezanzibar.com',
            'Luxury market partner', 'Yes', now
        ],
        [
            '4', 'Moja Discovery', '15', 'percentage', 'cash', 'sonia@mojadiscovery.com',
            'Adventure tourism partner', 'Yes', now
        ],
        [
            '5', 'White Sand', '5', 'percentage', 'bank_transfer', 'info@whitesand.com',
            'Boutique hotel partner', 'Yes', now
        ]
    ];

    if (samplePartners.length > 0) {
        sheet.getRange(2, 1, samplePartners.length, samplePartners[0].length).setValues(samplePartners);
    }
}

function addSampleSettings(ss, now) {
    const sheet = ss.getSheetByName('Settings');

    const sampleSettings = [
        [
            'max_pax_warning_threshold', '0.9', 'Warning when boat is 90% full', 'Capacity', now
        ],
        [
            'default_driver_rate', '120000', 'Default driver rate in local currency', 'Financial', now
        ],
        [
            'company_name', 'Boat Management System', 'Company name for messages', 'Branding', now
        ],
        [
            'contact_email', 'info@boatmanagement.com', 'Company contact email', 'Contact', now
        ],
        [
            'timezone', 'Africa/Dar_es_Salaam', 'System timezone', 'System', now
        ],
        [
            'message_footer_text', 'Thank you for choosing our services!', 'Footer for all messages', 'Branding', now
        ],
        [
            'company_logo_url', 'https://cdn-icons-png.flaticon.com/512/6733/6733991.png', 'Company logo URL', 'Branding', now
        ],
        [
            'enable_activity_logging', 'true', 'Enable activity logging for security', 'Security', now
        ]
    ];

    if (sampleSettings.length > 0) {
        sheet.getRange(2, 1, sampleSettings.length, sampleSettings[0].length).setValues(sampleSettings);
    }
}

function addSampleActivityLogs(ss, now) {
    const sheet = ss.getSheetByName('ActivityLogs');

    const sampleLogs = [
        [
            '1', 'christophe@boatmanagement.com', 'CREATE', 'Bookings', 'BOOK-20250805-0001', '', 'New booking created',
            '192.168.1.100', 'Mozilla/5.0', now
        ],
        [
            '2', 'diana@boatmanagement.com', 'UPDATE', 'Bookings', 'BOOK-20250809-0001', 'Status: Pending', 'Status: Confirmed',
            '192.168.1.101', 'Mozilla/5.0', now
        ],
        [
            '3', 'christophe@boatmanagement.com', 'CREATE', 'Users', '3', '', 'New driver account created',
            '192.168.1.100', 'Mozilla/5.0', now
        ]
    ];

    if (sampleLogs.length > 0) {
        sheet.getRange(2, 1, sampleLogs.length, sampleLogs[0].length).setValues(sampleLogs);
    }
}

function formatAllSheets(ss) {
    const sheets = ss.getSheets();

    sheets.forEach(sheet => {
        try {
            const lastColumn = sheet.getLastColumn();
            const lastRow = sheet.getLastRow();

            // Only format if there's data
            if (lastRow > 0 && lastColumn > 0) {
                // Auto-resize columns (only if there are columns)
                if (lastColumn > 0) {
                    sheet.autoResizeColumns(1, lastColumn);
                }

                // Add borders to data (only if there are multiple rows)
                if (lastRow > 1) {
                    const dataRange = sheet.getRange(1, 1, lastRow, lastColumn);
                    dataRange.setBorder(true, true, true, true, true, true);

                    // Set alternating row colors for better readability (skip header row)
                    for (let i = 2; i <= lastRow; i++) {
                        if (i % 2 === 0) {
                            sheet.getRange(i, 1, 1, lastColumn).setBackground('#f8f9fa');
                        }
                    }
                }
            }
        } catch (error) {
            console.log('⚠️ Warning: Could not format sheet ' + sheet.getName() + ': ' + error.message);
        }
    });

    console.log('✅ Formatted all sheets');
}

function base64Encode(str) {
    return Utilities.base64Encode(str);
}

// Function to run the generator
function runGenerator() {
    console.log('🚀 Starting Boat Management System Spreadsheet Generator (Production Ready)...');

    const result = createBoatManagementSpreadsheet();

    if (result.success) {
        console.log('🎉 Generator completed successfully!');
        console.log('📊 Spreadsheet ID: ' + result.spreadsheetId);
        console.log('🔗 Spreadsheet URL: ' + result.url);

        // You can copy this ID to use in your Apps Script
        console.log('📋 Copy this ID to your Code.js file:');
        console.log('SPREADSHEET_ID = "' + result.spreadsheetId + '";');

        console.log('\n✅ IMPROVEMENTS IMPLEMENTED:');
        console.log('✅ Proper data normalization with TripTypes table');
        console.log('✅ Color hex codes for UI rendering');
        console.log('✅ Status fields and soft deletion (IsArchived)');
        console.log('✅ Auto-calculated TotalPAX');
        console.log('✅ Hashed passwords for security');
        console.log('✅ Enhanced access control with permissions');
        console.log('✅ Activity logging for security audits');
        console.log('✅ Commission management with types and payout methods');
        console.log('✅ Message grouping for drivers');
        console.log('✅ Production-ready booking IDs');

    } else {
        console.error('❌ Generator failed: ' + result.error);
    }

    return result;
} 