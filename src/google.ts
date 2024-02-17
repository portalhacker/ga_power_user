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
        'redirect_uri': 'https://improved-usefully-mackerel.ngrok-free.app',
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
    const div = document.createElement('div')

    const script = document.createElement('script')
    script.innerHTML = `${oauthSignIn}`
    div.appendChild(script)

    const popover = document.createElement('div')
    popover.setAttribute('class', 'popover')
    popover.innerHTML = `
    <h1>Authorize Google Analytics</h1>
    <button onclick="oauthSignIn()">Authorize</button>
    `
    div.appendChild(popover);

    element.appendChild(div)
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
