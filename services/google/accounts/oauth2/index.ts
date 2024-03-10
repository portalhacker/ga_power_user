

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