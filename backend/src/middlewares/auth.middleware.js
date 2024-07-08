/**
 * Middleware para verificar si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función de middleware
 */
async function isAdmin(req, res, next) {
  try {
    // Verifica si hay un usuario autenticado en la sesión
    if (!req.session.user) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }
    
    // Obtiene el rol del usuario de la sesión
    const userRole = req.session.user.rolName;

    // Verifica si el usuario tiene el rol de administrador
    if (userRole === 'administrador') {
      // El usuario tiene el rol adecuado, continua con la siguiente función de middleware
      next();
      return;
    } else {
      // El usuario no tiene el rol adecuado, devuelve un error de acceso denegado
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }
  } catch (error) {
    console.log("Error en auth.middleware.js -> isAdmin(): ", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
// Funcion para validar el rol de user
async function isUser(req, res, next) {
  try {
    // Verifica si hay un usuario autenticado en la sesión
    if (!req.session.user) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }
    
    // Obtiene el rol del usuario de la sesión
    const userRole = req.session.user.rolName;

    // Verifica si el usuario tiene el rol de usuario
    if (userRole === 'usuario') {
      // El usuario tiene el rol adecuado, continua con la siguiente función de middleware
      next();
      return;
    } else {
      // El usuario no tiene el rol adecuado, devuelve un error de acceso denegado
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }
  } catch (error) {
    console.log("Error en auth.middleware.js -> isUser(): ", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// Funcion para validar el rol de emprendedor
async function isEmprendedor(req, res, next) {
  try {
    // Verifica si hay un usuario autenticado en la sesión
    if (!req.session.emprendedor) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }
    
    // Obtiene el rol del usuario de la sesión
    const userRole = req.session.emprendedor.rolName;

    // Verifica si el usuario tiene el rol de emprendedor
    if (userRole === 'emprendedor') {
      // Configura req.user con la informacion del usuario
      req.user = req.session.emprendedor;
      // El usuario tiene el rol adecuado, continua con la siguiente función de middleware
      next();
      return;
    } else {
      // El usuario no tiene el rol adecuado, devuelve un error de acceso denegado
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }
  } catch (error) {
    console.log("Error en auth.middleware.js -> isEmprendedor(): ", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
export { isAdmin , isUser, isEmprendedor};
