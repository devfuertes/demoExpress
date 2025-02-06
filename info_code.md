# Explicación del Código

![diagrama http](/public/http.png)
![diagrama http](/public/statusCode.png)

## 1. `app.ts` (Configuración de la Aplicación Express)

Este archivo define la configuración de la aplicación Express y establece los middleware y rutas principales.

### **Secciones Clave:**

### **1. Importación de módulos**
```ts
import { resolve } from 'path';
import express from 'express';
import createDebug from 'debug';
import morgan from 'morgan';
import {
    getController,
    notFoundController,
    postController,
} from './controllers.js';
import { logger } from './middleware.js';
```
- Se importa `express` para crear la aplicación.
- `morgan` se usa para registrar cada petición HTTP.
- `createDebug` permite generar logs de depuración.
- Se importan los controladores desde `controllers.ts`.
- Se importa un middleware personalizado (`logger`).

### **2. Creación de la aplicación Express**
```ts
export const app = express();
const debug = createDebug('demo:app');
```

### **3. Configuración de Middlewares**
```ts
app.use(morgan('common'));
app.use(express.json());
app.use(logger('debugger'));
```
- `morgan('common')`: Registra peticiones en la consola.
- `express.json()`: Habilita el soporte para recibir datos JSON en `POST`.
- `logger('debugger')`: Middleware personalizado para logs.

### **4. Definición de rutas**
```ts
app.get('/', getController);
app.post('*', postController);
app.use('*', notFoundController);
```

## 2. `controllers.ts` (Manejo de Peticiones HTTP)

### **1. `getController` (Maneja `GET /`)**
```ts
export const getController = (_req: Request, res: Response) => {
    const debug = createDebug('demo:getController');
    debug('Petición recibida');
    res.send('Hola Mundo!');
};
```

### **2. `postController` (Maneja `POST *`)**
```ts
export const postController = (req: Request, res: Response) => {
    const debug = createDebug('demo:postController');
    debug('Datos recibidos');
    const data = req.body;
    data.id = crypto.randomUUID();
    res.status(201).json({
        message: 'Datos recibidos',
        data,
    });
};
```
**Ejemplo de flujo de datos en `POST`**  
- Cliente envía:
```json
{
    "nombre": "Juan",
    "edad": 25
}
```
- El servidor responde:
```json
{
    "message": "Datos recibidos",
    "data": {
        "nombre": "Juan",
        "edad": 25,
        "id": "550e8400-e29b-41d4-a716-446655440000"
    }
}
```

### **3. `notFoundController` (Maneja rutas inexistentes)**
```ts
export const notFoundController = (_req: Request, res: Response) => {
    const debug = createDebug('demo:notFoundController');
    debug('Petición recibida');
    res.status(405).send('Method not allowed');
};
```

## 3. `index.ts` (Inicio del Servidor HTTP)

### **1. Importaciones**
```ts
import { createServer } from 'node:http';
import { app } from './app.js';
```

### **2. Configuración del servidor**
```ts
const PORT = process.env.PORT || 3000;
const server = createServer(app);
server.listen(PORT);
```

## 4. `middleware.ts` (Middlewares Personalizados)

### **Middleware `logger`**
```ts
export const logger = (name = 'logger') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const debug = createDebug(`demo:${name}`);
        debug(req.method, req.url);
        next();
    };
};
```

## 5. `template.ts` (Generación de HTML Dinámico)

### **Función `createHtmlString`**
```ts
export const createHtmlString = (title: string, header: string, content?: string) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
    </head>
    <body>
        <header>
            <h1>${header}</h1>
        </header>
        <main>
            ${content ? content : ''}
        </main>
    </body>
    </html>
`;
```

## Resumen General del Flujo de Datos

1. **El servidor (`index.ts`) espera peticiones en `PORT`.**
2. **Cuando llega una petición:**
   - Pasa por los middlewares (`morgan`, `logger`).
   - Se dirige al controlador correspondiente (`controllers.ts`).
   - Se procesa la petición y se genera una respuesta (`JSON`, `texto`, o `HTML`).
3. **El cliente recibe la respuesta.**

