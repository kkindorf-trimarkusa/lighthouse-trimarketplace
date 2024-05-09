import buildNewDate from './build-new-date.js';

function buildHtml(reportFiles) {
  let siteUrl = "https://kkindorf-trimarkusa.github.io/lighthouse-trimarketplace/shop.trimarketplace.com/"
  //use 2 so we target 2024 ...etc

  let fileObjects = [];
  for (var i = 0; i < reportFiles.length; i++) {
    let obj = {
      number: reportFiles[i].substring(reportFiles[i].indexOf('2'), reportFiles[i].indexOf('.html')).replace(/-/g, ''),
      fileName: reportFiles[i],
      fileDate: reportFiles[i].substring(reportFiles[i].indexOf('2'), reportFiles[i].indexOf('.html'))
    }
    fileObjects.push(obj)
  }

  var sortedFileObjects = fileObjects.sort((a, b) => b.number - a.number);
  console.log(sortedFileObjects);

  let currentFileDate = sortedFileObjects[0].fileDate;
  let currentDateNumber = sortedFileObjects[0].number;

  let firstHeading = '<h2>Trimarketplace Lighthouse reports for ' + `${currentFileDate}` + '</h2><ul>'
  let body = firstHeading;

  for (var i = 0; i < sortedFileObjects.length; i++) {

    if (currentDateNumber !== sortedFileObjects[i].number) {
      currentDateNumber = sortedFileObjects[i].number
      currentFileDate = sortedFileObjects[i].fileDate
      body += '</ul><h2>Trimarketplace Lighthouse reports for ' + `${currentFileDate}` + '</h2><ul>'
    }

    let listItemString = '<li><a href=' + siteUrl + sortedFileObjects[i].fileName + ' target="_blank">' + sortedFileObjects[i].fileName.substring(0, sortedFileObjects[i].fileName.indexOf('-2')) + '.html' + '</a></li>';
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

