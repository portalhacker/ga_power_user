import './style.css';

import { GA4AdminClient, GA4PropertyType } from './apis/ga4/admin';
import { displayOauthSignIn, saveCredentials } from './google';

// import gaAmdinIcon from '/icons/ga_admin.svg'

const app = document.querySelector<HTMLDivElement>('#app');

function searchTable(pattern: string) {
  let table = app!.querySelector('table')!;
  let rows = Array.from(table.querySelectorAll('tr'));
  rows.shift();
  rows.forEach((row) => {
    let rowText = Array.from(row.querySelectorAll('td'))
      .map((td) => td.textContent)
      .join(' ');
    row.style.display = rowText.match(new RegExp(pattern, 'i')) ? '' : 'none';
  });
}

let searchField = document.createElement('input');
searchField.type = 'text';
searchField.placeholder = 'Search';
searchField.addEventListener('input', () => searchTable(searchField.value));
app!.insertBefore(searchField, app!.firstChild);

function initEmptyTable() {
  let table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Account id</th>
      <th>Account name</th>
      <th>Account region</th>
      <th>Property id</th>
      <th>Property name</th>
      <th>Property currency</th>
      <th>Property timezone</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `;
  for (let i = 0; i < 50; i++) {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    `;
    table.appendChild(row);
  }
  return table;
}

app!.appendChild(initEmptyTable());

if (window.location.hash!.includes('googleapis.com')) saveCredentials();

const googleCredentials = localStorage.getItem('google_credentials');
if (!googleCredentials) displayOauthSignIn(app!);

declare global {
  interface Window {
    ga4Client: any;
  }
}

function displayProperties(accounts: any[] = window.ga4Client) {
  let table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Account id</th>
      <th>Account name</th>
      <th>Account region</th>
      <th>Property id</th>
      <th>Property name</th>
      <th>Property currency</th>
      <th>Property timezone</th>
      <th>Links</th>
      <th>Sessions yesterday</th>
    </tr>
  `;
  for (let account of accounts) {
    if (!account.properties || account.properties.length === 0) continue;
    for (let property of account.properties) {
      let property_type_icon = document.createElement('img');
      switch (property.propertyType) {
        case 'PROPERTY_TYPE_ROLLUP':
          property_type_icon.src = '/icons/ga_property_rollup.svg';
          break;
        case 'PROPERTY_TYPE_SUBPROPERTY':
          property_type_icon.src = '/icons/ga_property_sub.svg';
          break;
        default:
          break;
      }

      let service_level_icon = document.createElement('img');
      switch (property.serviceLevel) {
        case 'GOOGLE_ANALYTICS_360':
          service_level_icon.src = '/icons/ga_property_360.svg';
          break;
        default:
          break;
      }

      if (property.sessionsYesterday) {
        property.sessionsYesterday = Number(
          property.sessionsYesterday.replace(/,/g, '')
        ).toLocaleString();
      }

      let row = document.createElement('tr');
      row.innerHTML = `
        <td>${account.id}</td>
        <td>${account.displayName}</td>
        <td>${account.regionCode}</td>
        <td>${property.id}</td>
        <td>${property.displayName} </td>
        <td>${property.currencyCode}</td>
        <td>${property.timeZone}</td>
        <td>
          <a href="https://analytics.google.com/analytics/web/#/p${
            property.id
          }/reports" target="_blank">
            <img src="/icons/ga_home.svg" alt="Home"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/p${
            property.id
          }/reports/reportinghub" target="_blank">
            <img src="/icons/ga_reports.svg" alt="Reporting"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/analysis/p${
            property.id
          }" target="_blank">
            <img src="/icons/ga_explore.svg" alt="Explore"/>
          </a>
          <a href="https://analytics.google.com/analytics/web/#/p${
            property.id
          }/admin" target="_blank">
            <img src="/icons/ga_admin.svg" alt="Admin"/>
          </a>
        </td>
        <td>${property.sessionsYesterday || 'N/A'}</td>
      `;
      row.children[2].appendChild(property_type_icon);
      row.children[2].appendChild(service_level_icon);
      table.appendChild(row);
    }
  }
  app!.replaceChild(table, app!.querySelector('table')!);
}

async function fetchAccounts() {
  const ga4AdminClient = new GA4AdminClient(
    JSON.parse(localStorage.getItem('google_credentials')!).access_token
  );
  const accounts = await ga4AdminClient.listAccounts();

  const propertiesPromises = accounts.map((account) =>
    account.listProperties()
  );
  await Promise.all(propertiesPromises).then(() => {
    window.ga4Client = ga4AdminClient;

    if (ga4AdminClient.accounts.length > 200) {
      console.warn('More than 200 accounts, not requesting sessions');
      displayProperties(window.ga4Client);
      return;
    }
    for (let account of window.ga4Client) {
      if (!account.properties || account.properties.length === 0) continue;
      const sessionsYesterdayPromises = account.properties.map(
        (property: GA4PropertyType) => {
          return property.getSessionsYesterday();
        }
      );
      Promise.all(sessionsYesterdayPromises).then(() => {
        displayProperties(window.ga4Client);
      });
    }

    console.log(ga4AdminClient);
  });
}
fetchAccounts();
