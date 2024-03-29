function buildHtml(reportFiles) {
  let siteUrl = "https://kkindorf-trimarkusa.github.io/lighthouse-trimarketplace/prod.trimarketplace.com/"
  var body = '<h1>Trimarketplace Lighthouse reports</h1><ul>';
  for (var i = 0; i < reportFiles.length; i++) {
    let listItemString = '<li><a href=' + siteUrl + reportFiles[i] + '>' + reportFiles[i] + '</a></li>';
    body += listItemString
    if (reportFiles.length - 1 === i) {
      body += '</ul>'
    }
  }




  // concatenate body string

  return '<!DOCTYPE html>'
    + '<html><body>' + body + '</body></html>';
};


export default buildHtml;

