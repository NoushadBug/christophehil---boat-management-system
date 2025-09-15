function bm_listBookings(query) {
  bm_require();
  var sh = BM.ensureHeaders(BM.SHEETS.BOOKINGS, BM.SCHEMA.BOOKINGS);
  var rng = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), BM.SCHEMA.BOOKINGS.length);
  var rows = BM.rowsToObjects(rng.getValues(), BM.SCHEMA.BOOKINGS);
  if (query) {
    if (query.dateFrom) {
      var from = BM.DATE.toIsoDate(query.dateFrom);
      rows = rows.filter(function(r){ return String(r.Date) >= from; });
    }
    if (query.dateTo) {
      var to = BM.DATE.toIsoDate(query.dateTo);
      rows = rows.filter(function(r){ return String(r.Date) <= to; });
    }
    if (query.boat) rows = rows.filter(function(r){ return r.Boat === query.boat; });
  }
  return rows;
}

function bm_getBooking(id) {
  bm_require();
  var sh = BM.ensureHeaders(BM.SHEETS.BOOKINGS, BM.SCHEMA.BOOKINGS);
  var values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), BM.SCHEMA.BOOKINGS.length).getValues();
  var rows = BM.rowsToObjects(values, BM.SCHEMA.BOOKINGS);
  var b = rows.find(function(r){ return String(r.Id) === String(id); });
  if (!b) throw new Error('Not found');
  return b;
}

function bm_saveBooking(data) {
  bm_require();
  var sh = BM.ensureHeaders(BM.SHEETS.BOOKINGS, BM.SCHEMA.BOOKINGS);
  var headers = BM.SCHEMA.BOOKINGS;
  var id = data.Id || Utilities.getUuid();
  var isoDate = data.Date ? BM.DATE.toIsoDate(data.Date) : '';
  var now = BM.nowIso();
  var user = bm_currentUser();
  // Commission defaulting
  var commission = data.Commission;
  if (!commission || commission === '') {
    if (data.TripType === 'private') {
      var amt = parseFloat(data.PaymentAmount || 0);
      commission = Math.round(amt * 0.15 * 100) / 100;
    } else if (data.TripType === 'shared') {
      commission = bm_getSharedFixedCommission();
    }
  }
  var record = {
    Id: id,
    Date: isoDate,
    Time: data.Time || '',
    Boat: data.Boat || '',
    TripType: data.TripType || '',
    Status: data.Status || '',
    Client: data.Client || '',
    Phone: data.Phone || '',
    Adults: Number(data.Adults||0),
    Children: Number(data.Children||0),
    ChildAges: data.ChildAges || '',
    PaymentAmount: data.PaymentAmount || '',
    Currency: data.Currency || 'EUR',
    PaymentStatus: data.PaymentStatus || '',
    Commission: commission || '',
    Partner: data.Partner || '',
    Driver: data.Driver || '',
    Hotel: data.Hotel || '',
    Transfer: data.Transfer || '',
    Comments: data.Comments || '',
    CreatedAt: data.Id ? (data.CreatedAt||'') : now,
    UpdatedAt: now,
    CreatedBy: data.Id ? (data.CreatedBy||'') : (user && user.username || ''),
    UpdatedBy: (user && user.username || '')
  };
  var values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), headers.length).getValues();
  var rows = BM.rowsToObjects(values, headers);
  var idx = rows.findIndex(function(r){ return String(r.Id) === String(id); });
  if (idx === -1) {
    sh.appendRow(BM.objectToRow(record, headers));
    BM.log('booking.create', { id: id });
  } else {
    sh.getRange(idx+2,1,1,headers.length).setValues([BM.objectToRow(record, headers)]);
    BM.log('booking.update', { id: id });
  }
  return { ok: true, id: id };
}

function bm_deleteBooking(id) {
  bm_require('Admin');
  var sh = BM.ensureHeaders(BM.SHEETS.BOOKINGS, BM.SCHEMA.BOOKINGS);
  var headers = BM.SCHEMA.BOOKINGS;
  var values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), headers.length).getValues();
  var rows = BM.rowsToObjects(values, headers);
  var idx = rows.findIndex(function(r){ return String(r.Id) === String(id); });
  if (idx === -1) throw new Error('Not found');
  sh.deleteRow(idx+2);
  BM.log('booking.delete', { id: id });
  return { ok: true };
}

function bm_getSharedFixedCommission() {
  var map = BM.settingsMap();
  return Number(map['shared_commission_fixed_amount'] || map['SharedCommissionFixedAmount'] || 0);
}

function bm_boatSummary(dateIso, boat) {
  bm_require();
  var rows = bm_listBookings({ dateFrom: dateIso, dateTo: dateIso, boat: boat });
  var adults = 0, children = 0;
  rows.forEach(function(r){ adults += Number(r.Adults||0); children += Number(r.Children||0); });
  return {
    date: dateIso,
    boat: boat,
    totalGuests: adults + children,
    adults: adults,
    children: children,
    trips: rows.map(function(r){ return { id: r.Id, type: r.TripType, status: r.Status, time: r.Time }; })
  };
}
