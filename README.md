<p align="">
  <a href="http://nestjs.com/" target="blank"><img src="nest.svg" width="100" alt="Nest Logo" 
  href="http://nestjs.com/" target="blank"><img src="typescript.svg" width="100" alt="ts Logo"/></a>
  
  

# Teslo API

## Proyecto Académico
Proyecto con fines educativos usando el framework nest+typescript para crear el backend de un almacén de una tineda. Contiene una api funcional y documentada. Se emplea un contenedor con la base de datos Postgres, a la cual se accede mediante el ORM TypeOrm. Tambien se usan JWT(JSON Web Tokens) para la autenticacion y autorizacion de algunos endpoints. Se usan WebSockets. En desarrollo...

# Para ejecutar el proyecto

1. Clonar el proyecto

2. ```yarn install```

3. Crear .env similar a .env.example

4. Levantar la base de datos
```
docker-compose up -d
```
5. Levantar la aplicación en modo desarrollo
```
yarn start:dev
```

6. Poblar la base de datos
```
http://localhost:3000/api/seed
```

7. Documentacion disponible en:
```
http://localhost:3000/docs
```
### Contacto:
### guidotele@gmail.com 