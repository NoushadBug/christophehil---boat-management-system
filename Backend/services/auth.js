function bm_login(identifier, password) {
  var u = bm_findUser(identifier);
  if (!u || !u.Active) throw new Error('Invalid credentials');
  if (!password || String(u.Password) !== String(password)) throw new Error('Invalid credentials');
  var token = Utilities.getUuid();
  PropertiesService.getUserProperties().setProperty('BM_TOKEN', token);
  return { token: token, user: { id: u.Id, username: u.Username, role: u.Role } };
}

function bm_logout() {
  PropertiesService.getUserProperties().deleteProperty('BM_TOKEN');
  return true;
}

function bm_require(role) {
  var token = PropertiesService.getUserProperties().getProperty('BM_TOKEN');
  if (!token) throw new Error('Not authenticated');
  // Lightweight: in real use, map token to user; here we rely on session email matching Users.
  return bm_currentUser();
}

function bm_currentUser() {
  var email = (Session.getActiveUser() && Session.getActiveUser().getEmail()) || '';
  var u = bm_findUser(email) || bm_findUser(PropertiesService.getUserProperties().getProperty('BM_USERNAME')||'');
  return u ? { id: u.Id, username: u.Username, role: u.Role } : null;
}

function bm_findUser(identifier) {
  if (!identifier) return null;
  var sh = BM.ensureHeaders(BM.SHEETS.USERS, BM.SCHEMA.USERS);
  var values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,0), BM.SCHEMA.USERS.length).getValues();
  var rows = BM.rowsToObjects(values, BM.SCHEMA.USERS);
  var found = rows.find(function(r){ return r.Username === identifier || r.Email === identifier; });
  return found || null;
}

