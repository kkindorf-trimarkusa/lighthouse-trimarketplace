import buildNewDate from './build-new-date.js';

function buildHtml(reportFiles) {
  let siteUrl = "https://kkindorf-trimarkusa.github.io/lighthouse-trimarketplace/shop.trimarketplace.com/"
  //use 2 so we target 2024 ...etc
  let currentFileDate = reportFiles[0].substring(reportFiles[0].indexOf('2'), reportFiles[0].indexOf('.html'));

  let firstHeading = '<h2>Trimarketplace Lighthouse reports for ' + `${currentFileDate}` + '</h2><ul>'
  let body = firstHeading;
  for (var i = 0; i < reportFiles.length; i++) {
    if (currentFileData !== reportFiles[i].substring(reportFiles[i].indexOf('2'), reportFiles[i].indexOf('.html'))) {
      currentFileDate = reportFiles[i].substring(reportFiles[i].indexOf('2'), reportFiles[i].indexOf('.html'))
      body += '</ul><h2>Trimarketplace Lighthouse reports for ' + `${currentFileDate}` + '</h2><ul>'
    }

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

