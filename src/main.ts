import './style.css'

import { oauthSignIn } from './google'

// import gaAmdinIcon from '/icons/ga_admin.svg'

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

document.querySelector<HTMLDivElement>('#app')!.appendChild(initEmptyTable())

const googleCredentials = localStorage.getItem('google_crentials');
if (!googleCredentials) {
  const popover = document.createElement('div')
  popover.setAttribute('class', 'popover')
  popover.innerHTML = `
    <h1>Authorize Google Analytics</h1>
    <button onclick="">Authorize</button>
  `
  document.querySelector<HTMLDivElement>('#app')!.appendChild(popover)
}
