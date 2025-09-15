function bm_listBoats() {
  bm_require();
  var sh = BM.ensureHeaders(BM.SHEETS.BOATS, BM.SCHEMA.BOATS);
  var values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), BM.SCHEMA.BOATS.length).getValues();
  var rows = BM.rowsToObjects(values, BM.SCHEMA.BOATS);
  return rows.filter(function(r){ return String(r.Active).toLowerCase() !== 'false'; });
}

