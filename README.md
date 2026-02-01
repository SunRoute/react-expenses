# FIREBASE

## Configuración

- Crear cuenta en firebase
- Crear proyecto
- Elegir nombre y desactivar IA > Continuar
- Desactivar analytics > Crear proyecto > Continuar
- +Agregar app y Clicar icono WEB </>
- Nombrar app y agregar el SDK (usar npm)

## base de datos

- En Categorías de producto > Compilación > Firestore Database
- Crear Base de datos
- Edición Standar > ID por defecto > Ubicación cercana > Producción > Crear
- Modificar reglas de seguridad

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

- Publicar

## Autenticación

- En Categorías de producto > Compilación > Authentication
- Comenzar
- Método de acceso > Correo electrónico/contraseña > Habilitar
- Agregar proveedor nuevo > Google > Habilitar
- Nombre público por defecto y email de asistencia del instituto > Guardar

# APP

- Crear archivo .env con las variables de firebase (ver archivo .env.example). Incluir el archivo en .gitignore
