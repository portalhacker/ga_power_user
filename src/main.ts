import './style.css'

import { displayOauthSignIn, saveCredentials } from './google'

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
if (!googleCredentials) displayOauthSignIn(app!)
