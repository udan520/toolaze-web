import { ALL_LOCALE_CODES, PREFERRED_LOCALE_STORAGE_KEY } from './site-language-switch'
import { ENGLISH_ONLY_ROOT_ROUTES } from './localized-route-fallbacks'

const LOCALE_REDIRECT_STORAGE_KEY = 'toolaze.localeRedirectedPath'

function getBrowserLocaleRedirectScript() {
  return `(function(){try{
var supported=${JSON.stringify([...ALL_LOCALE_CODES])};
var preferredKey=${JSON.stringify(PREFERRED_LOCALE_STORAGE_KEY)};
var redirectedKey=${JSON.stringify(LOCALE_REDIRECT_STORAGE_KEY)};
var englishOnlyRoots=${JSON.stringify([...ENGLISH_ONLY_ROOT_ROUTES])};
var path=location.pathname||'/';
var parts=path.split('/').filter(Boolean);
var first=parts[0]||'';
if(supported.indexOf(first)>=0)return;
if(sessionStorage.getItem(redirectedKey)===path)return;
var raw=null;
try{raw=localStorage.getItem(preferredKey);}catch(e1){}
if(!raw){
  var langs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);
  for(var i=0;i<langs.length;i++){
    var normalized=String(langs[i]||'').toLowerCase();
    if(!normalized)continue;
    if(normalized.indexOf('zh')===0){raw='zh-TW';break;}
    var primary=normalized.split('-')[0];
    if(primary==='en'){raw='en';break;}
    if(supported.indexOf(primary)>=0){raw=primary;break;}
  }
}
if(!raw||raw==='en'||supported.indexOf(raw)<0)return;
var root=parts[0]||'';
if(englishOnlyRoots.indexOf(root)>=0)return;
if(root==='prompts')return;
if(root==='model'&&(parts[1]==='gpt-image-2'||parts[1]==='seedream-4-5'||parts[1]==='wan-2-7-image'))return;
sessionStorage.setItem(redirectedKey,path);
var next='/' + raw + (path==='/'?'':path);
location.replace(next+location.search+location.hash);
}catch(e2){}})();`
}

export const BROWSER_LOCALE_REDIRECT_SCRIPT = getBrowserLocaleRedirectScript()
