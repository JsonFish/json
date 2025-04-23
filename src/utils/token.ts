export const setToken = (data: any) => {
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem('access', data.accessToken)
    localStorage.setItem('refresh', data.refreshToken)
  }
}

export const getToken = (token: string) => {
  return localStorage.getItem(token) as string
}

export const removeToken = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export const formatToken = (token: string) => {
  return 'Bearer ' + token
}
