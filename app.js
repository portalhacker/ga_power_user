"use strict";

function sortArrayByProperty(array, property) {
    return array.sort((a, b) => {
        if (a[property] < b[property]) {
            return -1;
        }
        if (a[property] > b[property]) {
            return 1;
        }
        return 0;
    });
}


/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    const scopes = [
        "https://www.googleapis.com/auth/analytics",          // View and manage your Google Analytics data
        "https://www.googleapis.com/auth/analytics.readonly", // View your Google Analytics data
        "https://www.googleapis.com/auth/analytics.edit",     // Edit Google Analytics management entities
    ];


    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': '646423554576-uoddc2r0236fngusku0pr2vehci4tcuo.apps.googleusercontent.com',
                'redirect_uri': 'https://improved-usefully-mackerel.ngrok-free.app',
                'response_type': 'token',
                'scope': scopes.join(' '),
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

function saveCredentials() {
    if (window.location.hash) {
        // Strip the hash sign (#) from the start of the URL
        var hash = window.location.hash.substring(1);
        // Decode the URL component
        hash = decodeURIComponent(hash);
        var params = {};
        hash.split('&').map(hk => {
            var temp = hk.split('=');
            params[temp[0]] = temp[1];
        });
        localStorage.setItem('google_access_token', JSON.stringify(params));
    }
}

async function getAccountSummaries() {
    var url = 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('google_access_token')).access_token
        }
    })
    const body = await response.json();
    if (response.ok) {
        // console.log(body);
        return body.accountSummaries;
    } else if (response.status === 401) {
        oauthSignIn();
    } else {
        throw new Error("Error fetching account summaries", body);
    }
}

async function getMetrics(propertyId, startDate, endDate, metrics) {
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('google_access_token')).access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dateRanges: [
                { startDate, endDate }
            ],
            dimensions: [
                { name: 'date' }
            ],
            metrics
        })
    });
    const body = await response.json();
    if (response.ok) {
        console.log(body);
        return body;
    } else if (response.status === 401) {
        oauthSignIn();
    } else {
        throw new Error("Error fetching metrics", body);
    }
}


async function insertAccountSummariesIntoPage(accountSummaries) {
    var accountSummariesTable = document.createElement('table');
    accountSummariesTable.style.width = '100%';
    const headerRow = document.createElement('tr');
    const headerAccountName = document.createElement('th');
    headerAccountName.appendChild(document.createTextNode('Account Name'));
    headerRow.appendChild(headerAccountName);
    const headerPropertyId = document.createElement('th');
    headerPropertyId.appendChild(document.createTextNode('Property ID'));
    headerPropertyId.style.display = 'none';
    headerRow.appendChild(headerPropertyId);
    const headerPropertyName = document.createElement('th');
    headerPropertyName.appendChild(document.createTextNode('Property Name'));
    headerRow.appendChild(headerPropertyName);
    const headerPropertyHomePage = document.createElement('th');
    headerPropertyHomePage.appendChild(document.createTextNode(''));
    headerRow.appendChild(headerPropertyHomePage);
    const headerPropertyReportsPage = document.createElement('th');
    headerRow.appendChild(headerPropertyReportsPage);
    const headerPropertyExplorePage = document.createElement('th');
    headerRow.appendChild(headerPropertyExplorePage);
    const headerPropertyAdminPage = document.createElement('th');
    headerRow.appendChild(headerPropertyAdminPage);
    // const headerCreateEventsPage = document.createElement('th');
    // headerCreateEventsPage.appendChild(document.createTextNode('Create Events'));
    // headerRow.appendChild(headerCreateEventsPage);
    const headerPropertySessionsYesterday = document.createElement('th');
    headerPropertySessionsYesterday.appendChild(document.createTextNode('Sessions Yesterday'));
    headerRow.appendChild(headerPropertySessionsYesterday);
    accountSummariesTable.appendChild(headerRow);
    
    // console.log('accountSummariesTable');
    console.log(accountSummaries);
    accountSummaries = sortArrayByProperty(accountSummaries, 'displayName');
    for (let account of accountSummaries) {
        if (!account.propertySummaries) {
            continue;
        }
        account.propertySummaries = sortArrayByProperty(account.propertySummaries, 'displayName');
        for (let property of account.propertySummaries) {
            var propertyId = property.property.split('/')[1];

            var row = document.createElement('tr');

            var accountName = document.createElement('td');
            accountName.appendChild(document.createTextNode(account.displayName));

            var propertyIdNode = document.createElement('td');
            propertyIdNode.appendChild(document.createTextNode(propertyId));
            propertyIdNode.style.display = 'none';

            var propertyName = document.createElement('td');
            propertyName.appendChild(document.createTextNode(property.displayName));

            var propertyHomePage = document.createElement('td');
            var homePageLink = document.createElement('a');
            homePageLink.setAttribute('href', `https://analytics.google.com/analytics/web/#/p${propertyId}`);
            homePageLink.setAttribute('target', '_blank');
            homePageLink.innerHTML = '<img src="images/icons/home.svg" alt="Home Page">'
            propertyHomePage.appendChild(homePageLink);

            var propertyReportsPage = document.createElement('td');
            var reportsLink = document.createElement('a');
            reportsLink.setAttribute('href', `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/reportinghub`);
            homePageLink.setAttribute('target', '_blank');
            reportsLink.innerHTML = '<img src="images/icons/reports.svg" alt="Reports Page">'
            propertyReportsPage.appendChild(reportsLink);

            var propertyExplorePage = document.createElement('td');
            var exploreLink = document.createElement('a');
            exploreLink.setAttribute('href', `https://analytics.google.com/analytics/web/#/analysis/p${propertyId}`);
            homePageLink.setAttribute('target', '_blank');
            exploreLink.innerHTML = '<img src="images/icons/explore.svg" alt="Explore Page">'
            propertyExplorePage.appendChild(exploreLink);

            var propertyAdminPage = document.createElement('td');
            var adminLink = document.createElement('a');
            adminLink.setAttribute('href', `https://analytics.google.com/analytics/web/#/p${propertyId}/admin`);
            homePageLink.setAttribute('target', '_blank');
            adminLink.innerHTML = '<img src="images/icons/admin.svg" alt="Admin Page">'
            propertyAdminPage.appendChild(adminLink);

            // var createEventsPage = document.createElement('td');
            // var createEventsLink = document.createElement('a');
            // createEventsLink.appendChild(document.createTextNode('Create Events'));
            // createEventsLink.setAttribute('href', `https://analytics.google.com/analytics/web/#/p${propertyId}/admin/events/overview`);
            // createEventsPage.appendChild(createEventsLink);

            var propertySessionsYesterday = document.createElement('td');
            // let metrics = await getMetrics(propertyId, 'yesterday', 'yesterday', [{ name: 'sessions' }])
            propertySessionsYesterday.appendChild(document.createTextNode("Loading..."));


            row.appendChild(accountName);
            row.appendChild(propertyIdNode);
            row.appendChild(propertyName);
            row.appendChild(propertyHomePage);
            row.appendChild(propertyReportsPage);
            row.appendChild(propertyExplorePage);
            row.appendChild(propertyAdminPage);
            // row.appendChild(createEventsPage);
            row.appendChild(propertySessionsYesterday);
            accountSummariesTable.appendChild(row);
        }
    }
    document.body.appendChild(accountSummariesTable);
}


console.log('Hello World');

if (window.location.hash) {
    saveCredentials()
}

if (!localStorage.getItem('google_access_token')) {
    oauthSignIn();
}


getAccountSummaries().then(insertAccountSummariesIntoPage);

setTimeout(() => {
    const table = document.querySelector('table');
    for (let row of table.rows) {
        const propertyId = row.cells[1].innerText;
        // console.log(row.cells);
        getMetrics(propertyId, 'yesterday', 'yesterday', [{ name: 'sessions' }])
            .then(metrics => {
                if (!metrics.rows) {
                    row.cells[7].innerText = '0';
                }
                // console.log(row.cells[7]);
                // console.log(typeof metrics.rows[0].metricValues[0].value);
                row.cells[7].innerText = Number(metrics.rows[0].metricValues[0].value).toLocaleString('en-US');
            });
    }
}, 1000);


