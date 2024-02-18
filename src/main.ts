import './style.css'

import { displayOauthSignIn, saveCredentials, getAccounts, getProperties, getData } from './google'
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
      <th>Account region</th>
      <th>Property name</th>
      <th>Property currency</th>
      <th>Property timezone</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `
  for (let i = 0; i < 50; i++) {
    let row = document.createElement('tr')
    row.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
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
    await Promise.all(
      account.properties.map(async (property: any) => {
        property.propertyId = property.name.split('/')[1]
        property.sessionsYesterday = await getData(
          property.propertyId,
          'date',
          'sessions', 
          { 
            startDate: 'yesterday', 
            endDate: 'yesterday'
          }
        ).then((data: any) => data?.rows?.[0]?.metricValues?.[0]?.value)
      })
    )
  }))
  displayProperties()
})();

function displayProperties() {
  let table = document.createElement('table')
  table.innerHTML = `
    <tr>
      <th>Account name</th>
      <th>Account region</th>
      <th>Property name</th>
      <th>Property currency</th>
      <th>Property timezone</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `
  for (let account of window.ga4) {
    if (!account.properties || account.properties.length === 0) continue;
    for (let property of account.properties) {

      let property_type_icon = document.createElement('img')
      switch (property.propertyType) {
        case "PROPERTY_TYPE_ROLLUP":
          property_type_icon.src = '/icons/ga_property_rollup.svg'
          break;
        case "PROPERTY_TYPE_SUBPROPERTY":
          property_type_icon.src = '/icons/ga_property_sub.svg'
          break;
        default:
          break;
      }

      let service_level_icon = document.createElement('img')
      switch (property.serviceLevel) {
        case "GOOGLE_ANALYTICS_360":
          service_level_icon.src = '/icons/ga_property_360.svg'
          break;
        default:
          break;
      }

      if (property.sessionsYesterday) {
        property.sessionsYesterday = Number(property.sessionsYesterday).toLocaleString();
      }

      let row = document.createElement('tr')
      row.innerHTML = `
        <td>${account.displayName}</td>
        <td>${account.regionCode}</td>
        <td>${property.displayName} </td>
        <td>${property.currencyCode}</td>
        <td>${property.timeZone}</td>
        <td>
          <a href="https://analytics.google.com/analytics/web/#/p${property.propertyId}/reports" target="_blank">
            <img src="/icons/ga_home.svg" alt="Home"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/p${property.propertyId}/reports/reportinghub" target="_blank">
            <img src="/icons/ga_reports.svg" alt="Reporting"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/analysis/p${property.propertyId}" target="_blank">
            <img src="/icons/ga_explore.svg" alt="Explore"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/p${property.propertyId}/admin" target="_blank">
            <img src="/icons/ga_admin.svg" alt="Admin"/>
          </a>
        </td>
        <td>${property.sessionsYesterday || 0}</td>
      `
      row.children[2].appendChild(property_type_icon);
      row.children[2].appendChild(service_level_icon);
      table.appendChild(row)
    }
  }
  app!.replaceChild(table, app!.firstChild!)
};
