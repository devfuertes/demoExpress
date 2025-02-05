---
title: Course Node.js / Express.js
description: 'Información sobre Node.js/Express.js para el certificado de profesionalidad de Desarrollo de Aplicaciones con Tecnologías Web'
dates: 01/2025
---

- [Express. Servidores Web con Node.js y Express.js](#express-servidores-web-con-nodejs-y-expressjs)
  - [Instalación de Express](#instalación-de-express)
  - [Primera aplicación con Express](#primera-aplicación-con-express)
    - [Patrón de separación de responsabilidades: server y app](#patrón-de-separación-de-responsabilidades-server-y-app)
    - [Refactorización del servidor](#refactorización-del-servidor)
    - [Refactorización de la aplicación express. Middleware](#refactorización-de-la-aplicación-express-middleware)
    - [Utilidades](#utilidades)
  - [Creación de un servidor con Express](#creación-de-un-servidor-con-express)
  - [Rutas y middleware](#rutas-y-middleware)
  - [Parámetros de ruta](#parámetros-de-ruta)
  - [Middleware de aplicación](#middleware-de-aplicación)
- [API Rest con Express](#api-rest-con-express)
  - [Endpoints de una API Rest con Express](#endpoints-de-una-api-rest-con-express)
  - [Cors](#cors)
  - [Arquitectura de una API Rest: MVC](#arquitectura-de-una-api-rest-mvc)
- [Bases de datos](#bases-de-datos)
  - [Bases de datos relacionales](#bases-de-datos-relacionales)
    - [MySQL](#mysql)
    - [PostgreSQL](#postgresql)
    - [SQLite](#sqlite)
  - [Bases de datos no relacionales](#bases-de-datos-no-relacionales)
    - [MongoDB](#mongodb)
- [Autenticación y autorización](#autenticación-y-autorización)
  - [Autenticación](#autenticación)
  - [Autorización](#autorización)
- [Aplicación Realtime con Socket IO](#aplicación-realtime-con-socket-io)
  - [Socket.IO y Express](#socketio-y-express)
- [Despliegue y publicación en npm](#despliegue-y-publicación-en-npm)
  - [Despliegue en Render](#despliegue-en-render)
  - [Cache](#cache)

## Express. Servidores Web con Node.js y Express.js

### Instalación de Express

```bash
npm install express
npm install -D @types/express
```

### Primera aplicación con Express

```ts
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### Patrón de separación de responsabilidades: server y app

```ts
// server.ts

import http from 'http';
import app from './app';

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// app.ts

import express from 'express';

export const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
```

#### Refactorización del servidor

- recuperamos elementos ya definidos al crear un servidor http con node.js

- la definición del **puerto** comprobando si existe una variable de entorno PORT
- la creación de un **logger** con debug
- un listener para el **evento listening** que muestre la información del servidor arrancado
- un listener para el **evento error** que muestre la información del error

```ts
import http from 'http';
import { resolve } from 'path';
import createDebug from 'debug';
import 'dotenv/config';
import app from './app';

const debug = createDebug('project:server');
const __dirname = resolve();
const port = process.env.PORT || 3300;
debug('Iniciando el servidor');
debug(__dirname);

const listenManager = () => {
  const addr = server.address();
  if (addr === null) return;
  let bind;
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr;
  } else {
    bind =
      addr.address === '::'
        ? `http://localhost:${addr?.port}`
        : `${addr.address}:${addr?.port}`;
  }
  console.log(`Server listening on ${bind}`);
  debug(`Servidor escuchando en ${bind}`);
};
const errorManager = (error, response) => {
  if (!('statusCode' in error)) {
    error = {
      ...new Error('Internal Server Error'),
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    };
  }
  const errorInfo = `Error ${error.statusCode}: ${error.statusMessage}`;
  response.statusCode = error.statusCode;
  response.statusMessage = error.statusMessage;
  debug(errorInfo, error.message);
  response.end(errorInfo);
};

const server = createServer(app);
server.on('listening', listenManager);
server.on('error', errorManager);
server.listen(port);
```

#### Refactorización de la aplicación express. Middleware

- separamos la creación de la aplicación express en un archivo app.ts
- exportamos la aplicación express para poder ser utilizada en otros archivos
- eliminamos la cabecera de express (x-powered-by)
- añadimos un middleware para el logger de las peticiones
- añadimos las páginas no encontradas (404)
- añadimos los métodos no permitidos
- añadimos un middleware para gestionar errores

```ts
import express, { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';
import { HttpError } from './error';

const debug = createDebug('project:app');

export const app = express();
app.disable('x-powered-by');

app.use((req: Request, res: Response, next: NextFunction) => {
  debug(`Request ${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('*', (req: Request, res: Response) => {
  res.status(404);
  res.send('Not Found');
  debug(`Not Found ${req.method} ${req.url}`);
});

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = {
    ...new Error('Not supported method'),
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  };
  next(error);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (!('statusCode' in error)) {
    error = {
      ...new Error('Internal Server Error'),
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    };
  }

  const errorInfo = `Error ${error.statusCode}: ${error.statusMessage}`;
  res.status(error.statusCode);
  res.statusMessage = error.statusMessage;
  debug(errorInfo, error.message);
  res.send(errorInfo);
  next();
});
```

#### Utilidades

- [Morgan](https://www.npmjs.com/package/morgan). Logger de solicitudes HTTP para Express/Node.js.
- [Helmet](https://helmetjs.github.io/). Seguridad para aplicaciones Express.

### Creación de un servidor con Express

### Rutas y middleware

### Parámetros de ruta

### Middleware de aplicación

## API Rest con Express

REST es un estilo de arquitectura de software que define un conjunto de restricciones para el diseño de servicios web. REST es un acrónimo de Representational State Transfer.

Fue presentado por Roy Fielding en su tesis doctoral en 2000.

RESTful es un término que se utiliza para describir servicios web que cumplen con los principios de REST. REST API es una API que sigue los principios de REST.

En REST se consideran como **recursos** a los objetos que se manipulan a través de la API. Los recursos se **identifican** mediante **URIs**. URI es un identificador uniforme de recursos, que es una cadena de caracteres que identifica un recurso en la red. URL es un localizador de recursos uniforme, que es un tipo de URI que identifica un recurso en la red y proporciona la ubicación del recurso.

Las **representaciones** de los recursos son los datos que se envían al cliente. Las representaciones de los recursos se pueden enviar en diferentes formatos, como JSON, XML, HTML, etc.

El **estado** de una aplicación es la información que se necesita para procesar una solicitud. El estado de una aplicación se puede enviar al cliente en la respuesta pero no se almacena en el servidor.

En REST, las operaciones que se pueden realizar sobre los recursos se definen mediante **verbos** (métodos HTTP). Los verbos más comunes son GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD.

La arquitectura REST se basa en los siguientes principios:

- **Cliente-servidor**: El cliente y el servidor son independientes entre sí: **"separación de conceptos"** (separation of concerns). El cliente no necesita saber cómo se implementa el servidor y el servidor no necesita saber cómo se implementa el cliente. Esto permite que el cliente y el servidor se puedan desarrollar de forma independiente.
- **Sin estado** (**stateless**): Cada solicitud del cliente al servidor debe contener toda la información necesaria para procesar la solicitud. El servidor no debe almacenar información sobre el estado del cliente entre solicitudes. Esto permite que el servidor sea escalable y se pueda distribuir en varios servidores.
- **Cacheable**: Las respuestas del servidor deben ser cacheables. Esto permite que el cliente pueda almacenar en caché las respuestas del servidor y reutilizarlas en futuras solicitudes.
- **Interfaz uniforme**: La interfaz entre el cliente y el servidor debe ser uniforme. Esto permite que el cliente pueda interactuar con diferentes servidores de forma consistente.
- **Sistema en capas**: El sistema debe estar compuesto por capas. Cada capa debe ser independiente de las demás capas. Esto permite que el sistema sea escalable y se pueda distribuir en varios servidores.
- **Código bajo demanda**: El servidor puede enviar código al cliente para que lo ejecute. Esto permite que el cliente pueda ejecutar código en su propio contexto.

### Endpoints de una API Rest con Express

- **GET /api/v1/users**: Obtener todos los usuarios.
- **GET /api/v1/users/:id**: Obtener un usuario por id.
- **GET /api/v1/users?role=admin**: Obtener todos los usuarios.
- **POST /api/v1/users**: Crear un usuario.

- Validaciones: zod (type Address = z.infer<typeof AddressSchema>;)

- **PATCH /api/v1/users/:id**: Actualizar un usuario por id.
- **DELETE /api/v1/users/:id**: Eliminar un usuario por id.

### Cors

### Arquitectura de una API Rest: MVC

- Model: Representa los datos de la aplicación y la lógica de negocio asociada con ellos: creación de ids, actualización de los datos y persistencia (e.g DB).

- Controller: Intermediario entre los otros dos. Se encarga de gestionar las peticiones HTTP, validar los datos, interactuar con el modelo y devolver una respuesta al cliente.

- View: Representa la interfaz de usuario. En una API Rest no se utiliza o se pude considerar que son los ficheros json.

## Bases de datos

### Bases de datos relacionales

#### MySQL

#### PostgreSQL

#### SQLite

### Bases de datos no relacionales

#### MongoDB

## Autenticación y autorización

### Autenticación

### Autorización

## Aplicación Realtime con Socket IO

### Socket.IO y Express

## Despliegue y publicación en npm

### Despliegue en Render

### Cache

```

```
