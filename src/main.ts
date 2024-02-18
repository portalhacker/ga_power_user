import './style.css'

import { displayOauthSignIn, saveCredentials, getAccounts, getProperties } from './google'
import { sortArrayByProperty } from './utilities'

// import gaAmdinIcon from '/icons/ga_admin.svg'

const app = document.querySelector<HTMLDivElement>('#app')

// interface GaProperty {
//   accountId: string
//   accountName: string
//   propertyId: string
//   propertyName: string
// }

function initEmptyTable() {
  let table = document.createElement('table')
  table.innerHTML = `
    <tr>
      <th>Account name</th>
      <th>Property name</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `
  for (let i = 0; i < 5; i++) {
    let row = document.createElement('tr')
    row.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    `
    table.appendChild(row)
  }
  return table
}

app!.appendChild(initEmptyTable())

if (window.location.hash!.includes('googleapis.com')) {
  saveCredentials()
}

const googleCredentials = localStorage.getItem('google_credentials');
if (!googleCredentials) displayOauthSignIn(app!);

declare global {
  interface Window {
    ga4: any;
  }
}

(async function getGA4() {
  window.ga4 = await getAccounts();
  if (!window.ga4) return;
  window.ga4 = sortArrayByProperty(window.ga4, 'displayName')


  await Promise.all(window.ga4.map(async (account: any) => {
    account.properties = await getProperties(account.name)
    if (!account.properties) return;
    account.properties = sortArrayByProperty(account.properties, 'displayName')
    for (let property of account.properties) {
      property.propertyId = property.name.split('/')[1]
    }
  }))
  displayProperties()
})();

function displayProperties() {
  let table = document.createElement('table')
  table.innerHTML = `
    <tr>
      <th>Account name</th>
      <th>Property name</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `
  for (let account of window.ga4) {
    if (!account.properties || account.properties.length === 0) continue;
    for (let property of account.properties) {
      let row = document.createElement('tr')
      row.innerHTML = `
        <td>${account.displayName}</td>
        <td>${property.displayName}</td>
        <td>
          <a href="https://analytics.google.com/analytics/web/#/p${property.propertyId}/reports" target="_blank">View</a>
        </td>
        <td></td>
      `
      table.appendChild(row)
    }
  }
  app!.replaceChild(table, app!.firstChild!)
};
