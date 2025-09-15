// Utilities and constants for the Boat Management System
var BM = (function() {
  var TIMEZONE = Session.getScriptTimeZone() || 'UTC';
  var SHEETS = {
    BOOKINGS: 'Bookings',
    USERS: 'Users',
    BOATS: 'Boats',
    SETTINGS: 'Settings',
    DRIVERS: 'Drivers',
    PARTNERS: 'Partners',
    LOGS: 'Activity Logs'
  };

  var DATE = {
    toIsoDate: function(d) {
      if (typeof d === 'string') return d.split('T')[0];
      return Utilities.formatDate(new Date(d), TIMEZONE, 'yyyy-MM-dd');
    },
    toDisplay: function(d) {
      var date = (d instanceof Date) ? d : new Date(d);
      return Utilities.formatDate(date, TIMEZONE, 'dd/MM/yyyy');
    },
    parseDisplay: function(s) {
      // expects DD/MM/YYYY
      var parts = (s || '').split('/');
      if (parts.length !== 3) throw new Error('Invalid date: ' + s);
      var dd = parseInt(parts[0], 10), mm = parseInt(parts[1], 10) - 1, yyyy = parseInt(parts[2], 10);
      return new Date(yyyy, mm, dd);
    }
  };

  var SCHEMA = {
    BOOKINGS: ['Id','Date','Time','Boat','TripType','Status','Client','Phone','Adults','Children','ChildAges','PaymentAmount','Currency','PaymentStatus','Commission','Partner','Driver','Hotel','Transfer','Comments','CreatedAt','UpdatedAt','CreatedBy','UpdatedBy'],
    USERS: ['Id','Username','Email','Password','Role','Active','CreatedAt'],
    BOATS: ['Id','Name','Color','MaxCapacity','Manager','Active'],
    DRIVERS: ['Id','Name','Phone','Active'],
    PARTNERS: ['Id','Name','Phone','CommissionFixed','Active'],
    SETTINGS: ['Key','Value']
  };

  function getSheet(name) {
    var sid = PropertiesService.getScriptProperties().getProperty('BOAT_MGMT_SHEET_ID') || PropertiesService.getScriptProperties().getProperty('BM_SHEET_ID');
    var ss = sid ? SpreadsheetApp.openById(sid) : SpreadsheetApp.getActive();
    var sh = ss.getSheetByName(name);
    if (!sh) throw new Error('Missing sheet: ' + name);
    return sh;
  }

  function ensureHeaders(name, headers) {
    var sh = getSheet(name);
    var first = sh.getRange(1,1,1,Math.max(headers.length, sh.getLastColumn())).getValues()[0];
    var needs = false;
    headers.forEach(function(h, i){ if (first[i] !== h) needs = true; });
    if (needs) sh.getRange(1,1,1,headers.length).setValues([headers]);
    return sh;
  }

  function rowsToObjects(rows, headers) {
    return rows.map(function(r){
      var o = {}; headers.forEach(function(h,i){ o[h]=r[i]; }); return o;
    });
  }
  function objectToRow(obj, headers) {
    return headers.map(function(h){ return obj[h] === undefined ? '' : obj[h]; });
  }

  function nowIso() { return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"); }

  function log(action, meta) {
    try {
      var sh = ensureHeaders(SHEETS.LOGS, ['Timestamp','Action','User','Meta']);
      sh.appendRow([nowIso(), action, Session.getActiveUser().getEmail() || '', JSON.stringify(meta || {})]);
    } catch (e) {}
  }

  function settingsMap() {
    var sh = ensureHeaders(SHEETS.SETTINGS, ['Key','Value','Description','Category','UpdatedAt']);
    var last = sh.getLastRow();
    if (last < 2) return {};
    var values = sh.getRange(2,1,last-1,2).getValues();
    var map = {};
    values.forEach(function(r){ if (r[0]) map[String(r[0])] = r[1]; });
    return map;
  }

  return { SHEETS: SHEETS, DATE: DATE, SCHEMA: SCHEMA, getSheet: getSheet, ensureHeaders: ensureHeaders, rowsToObjects: rowsToObjects, objectToRow: objectToRow, nowIso: nowIso, log: log, settingsMap: settingsMap };
})();
