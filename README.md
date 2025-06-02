# TV-API

API para gestionar canales de TV, desarrollada con **Node.js**, **Express** y **MongoDB**.  
Incluye documentación interactiva con **Swagger**.

## 🚀 Características principales

✅ CRUD completo para canales:  
- Listar canales habilitados  
- Crear un nuevo canal  
- Obtener un canal por ID  
- Actualizar un canal  
- Eliminar un canal

✅ Documentación interactiva en: `/api-docs`

✅ Empaquetada como contenedor **Docker** para facilitar el despliegue.

## ⚙️ Variables de entorno

Crea un archivo `.env` con estas variables:

```env
MONGO_URI=mongodb://usuario:contraseña@host:puerto/basededatos
PORT=3001
ENABLE_SWAGGER=true
