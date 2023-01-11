
const run = (siteurl)=> {
  const url =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${siteurl}/&key=AIzaSyCgeRubpcxw8fb1EeJulHtwlfMgr_HcQHw`;// setUpQuery(siteurl);
  console.log(url);
  fetch(url)
    .then(response => response.json())
    .then(json => {
        console.log("insights from google")
        console.log(json);
        return json;
    });
}

function setUpQuery(siteurl) {
    const urli = encodeURIComponent(`${siteurl}`) +"/&key=AIzaSyCgeRubpcxw8fb1EeJulHtwlfMgr_HcQHw";
    console.log(urli);
    
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const parameters = {
    url:urli
  };
  let query = `${api}?`;
  for (key in parameters) {
    query += `${key}=${parameters[key]}`;
  }
  return query;
}

function showInitialContent(id) {
  document.body.innerHTML = '';
  const title = document.createElement('h1');
  title.textContent = 'PageSpeed Insights API Demo';
  document.body.appendChild(title);
  const page = document.createElement('p');
  page.textContent = `Page tested: ${id}`;
  document.body.appendChild(page);
}

function showCruxContent(cruxMetrics) {
  const cruxHeader = document.createElement('h2');
  cruxHeader.textContent = "Chrome User Experience Report Results";
  document.body.appendChild(cruxHeader);
  for (key in cruxMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${cruxMetrics[key]}`;
    document.body.appendChild(p);
  }
}

function showLighthouseContent(lighthouseMetrics) {
  const lighthouseHeader = document.createElement('h2');
  lighthouseHeader.textContent = "Lighthouse Results";
  document.body.appendChild(lighthouseHeader);
  for (key in lighthouseMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${lighthouseMetrics[key]}`;
    document.body.appendChild(p);
  }
}

module.exports = {run};
