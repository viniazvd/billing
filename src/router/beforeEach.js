export default (to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (isAuthenticated && !to.meta.requiresAuth) {
    next('/')

    return false
  }

  if (!isAuthenticated && to.meta.requiresAuth) {
    next('/login')

    return false
  }

  next()
}
