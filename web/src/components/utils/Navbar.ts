const isActive = (routeToMatch: string) => {
  if (window.location.pathname === `${routeToMatch}`) {
    return true;
  } else {
    return false;
  }
};


export { isActive }