export function oauthSignIn() {
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
    var params: { [key: string]: string } = {
        'client_id': '646423554576-uoddc2r0236fngusku0pr2vehci4tcuo.apps.googleusercontent.com',
        'redirect_uri': document.location.origin,
        'response_type': 'token',
        'scope': scopes.join(' '),
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

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
export function displayOauthSignIn(element: HTMLElement) {
    const popover = document.createElement('div')
    popover.setAttribute('class', 'popover')
    popover.innerHTML = `
    <h1>Authorize Google Analytics</h1>
    <italic>* This app is currently under development and is not affiliated with Google.</italic>
    <button id=auth-button>Authorize</button>
    `
    element.appendChild(popover)
    popover.querySelector('#auth-button')!.addEventListener('click', oauthSignIn);
}

export function saveCredentials() {
    if (window.location.hash) {
        // Strip the hash sign (#) from the start of the URL
        var hash = window.location.hash.substring(1);
        // Decode the URL component
        hash = decodeURIComponent(hash);
        var params: { [key: string]: string } = {};
        hash.split('&').map(hk => {
            var temp = hk.split('=');
            params[temp[0]] = temp[1];
        });
        localStorage.setItem('google_credentials', JSON.stringify(params));
        window.location.hash = ''
        window.location.reload()
    }
}

export async function getAccounts() {
    const credentials = localStorage.getItem('google_credentials');
    if (!credentials) return;
    const params = JSON.parse(credentials);
    const accessToken = params.access_token;

    const queryParams = new URLSearchParams({
        'pageSize': '200',
    });
    const url = `/api/ga4-admin/accounts?${queryParams.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Application': 'application/json',
        },
    });
    const body = await response.json();

    if (response.ok) {
        return body.accounts;
    } else if (response.status === 401) {
        localStorage.removeItem('google_credentials');
        window.location.reload();
    } else {
        console.error('Error fetching accounts', body);
    }
}

export async function getProperties(accountName: string) {
    const credentials = localStorage.getItem('google_credentials');
    if (!credentials) return;
    const params = JSON.parse(credentials);
    const accessToken = params.access_token;

    const queryParams = new URLSearchParams({ 
        filter: `parent:${accountName}`,
        pageSize: '200',
    });

    const url = `/api/ga4-admin/properties?${queryParams.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Application': 'application/json',
        },
    });
    const body = await response.json();

    if (response.ok) {
        return body.properties;
    } else if (response.status === 401) {
        localStorage.removeItem('google_credentials');
        window.location.reload();
    } else {
        console.error('Error fetching properties', body);
    }
}

export async function getData(propertyId: string, dimension: String, metric: String, dateRanges: Object) {
    const credentials = localStorage.getItem('google_credentials');
    if (!credentials) return;
    const params = JSON.parse(credentials);
    const accessToken = params.access_token;

    const url = `/api/ga4-data/properties/${propertyId}/:runReport`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Application': 'application/json',
        },
        body: JSON.stringify({
            "dimensions": { "name": dimension },
            "metrics": { "name": metric },
            "dateRanges": dateRanges,
        }),
    });
    const body = await response.json();

    if (response.ok) {
        return body;
    } else if (response.status === 401) {
        console.error('Unauthorized. Removing credentials...');
        localStorage.removeItem('google_credentials');
        window.location.reload();
    } else if (response.status === 429) {
        return { rows: [ { metricValues: [ { 'value': 'Not available' } ] } ]}
        // console.error('Too many requests.', propertyId);
        // await new Promise(r => setTimeout(r, 1000));
        // return getData(propertyId, dimension, metric, dateRanges);
    } else {
        throw new Error('Error fetching data');
    }
}