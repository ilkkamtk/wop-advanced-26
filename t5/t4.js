'use strict';

// eslint-disable-next-line no-unused-vars
async function fetchData(url, options) {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok && json.message) {
    throw new Error('Virhe: ' + json.message);
  } else if (!response.ok) {
    throw new Error('Virhe: ' + response.statusText);
  }
  return json;
}
