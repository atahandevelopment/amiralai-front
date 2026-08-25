// Kept as a synchronous inline script so the theme is applied before the first paint.
export const themeScript = `(function(){var t;try{t=localStorage.getItem('amiral-theme')}catch(e){}if(t!=='light'&&t!=='dark'){try{t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){t='light'}}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()`;
