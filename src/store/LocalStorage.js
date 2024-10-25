export const setSessionId = (sessionId) => {
  console.log('setSessionId', sessionId)
  if (typeof window !== 'undefined') {
    localStorage.setItem("sessionId", sessionId);
  }
}

export const getSessionId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("sessionId");
  }
}

export const setUserData = (userData) => {
  if (typeof window!== 'undefined') {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
}

export const getUserData = () => {
  if (typeof window!== 'undefined') {
    return JSON.parse(localStorage.getItem("userData"));
  }
}

export const setBannerWebImage = (bannerData) => {
  if (typeof window!== 'undefined') {
    localStorage.setItem("bannerWebImage", JSON.stringify(bannerData));
  }
}

export const getBannerWebImage = () => {
  if (typeof window!== 'undefined') {
    return localStorage.getItem("bannerWebImage");
  }
}

export const setBannerMobileImage = (bannerData) => {
  if (typeof window!== 'undefined') {
    localStorage.setItem("bannerMobileImage", JSON.stringify(bannerData));
  }
}

export const getBannerMobileImage = () => {
  if (typeof window!== 'undefined') {
    return localStorage.getItem("bannerMobileImage");
  }
}