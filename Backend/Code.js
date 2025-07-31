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

// Add more backend logic as needed 