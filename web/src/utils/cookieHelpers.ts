const cookieName = "qid"

export function getCookie() {
  let name = cookieName + "=";
  let decodedCookie: string
  let ca: string[] = []
  if (typeof (document.cookie) === 'string') {
    decodedCookie = decodeURIComponent(document.cookie);
    ca = decodedCookie.split(';');
  }

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

export function setCookie(cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cvalue + ";" + expires + ";path=/";
}

export function deleteCookie() {
  const d = new Date();
  d.setTime(d.getTime() + (0));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + "" + ";" + expires + ";path=/;domain=localhost";
}