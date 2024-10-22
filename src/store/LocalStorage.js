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