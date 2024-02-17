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
    var params = {
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
