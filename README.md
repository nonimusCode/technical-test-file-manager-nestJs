<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Introducción

Este es un proyecto técnico desarrollado por Juan Pablo Cerón, implementando una API REST robusta y escalable utilizando NestJS. El proyecto demuestra las mejores prácticas en el desarrollo de aplicaciones backend, incorporando características como autenticación, manejo de archivos, documentación API y contenerización.

## Instalación

### Requisitos Previos

- Docker
- Docker Compose

### Pasos de Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd <project-name>
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## Migraciones de Base de Datos

El proyecto utiliza Prisma como ORM y gestor de migraciones. Es importante entender cómo se manejan las migraciones en diferentes ambientes:

### Ambiente de Desarrollo

En el ambiente de desarrollo, las migraciones se ejecutan **automáticamente** al iniciar el contenedor con `docker compose up my-service-dev postgres -d --build`. Esto se maneja a través del `entrypoint.sh` que:

- Ejecuta las migraciones con `prisma migrate dev`
- Inicia el servidor en modo desarrollo

### Ambiente de Producción

En el ambiente de producción, las migraciones **NO** se ejecutan automáticamente por seguridad. Antes de iniciar el servicio en producción

> ⚠️ **IMPORTANTE**: Siempre ejecuta y verifica las migraciones antes de desplegar a producción para evitar inconsistencias en la base de datos.

3. Iniciar la aplicación:

```bash
# Modo desarrollo
docker compose up my-service-dev postgres -d --build
```

```bash
# Primero, ejecutar las migraciones
npx prisma migrate deploy

# Luego, levantar el servicio
docker compose up my-service-production postgres -d --build

```

## Tecnologías y Herramientas

- **Framework Principal**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT
- **Almacenamiento**: AWS S3
- **Manejo de Archivos**: Multer
- **Documentación API**: Swagger
- **Contenerización**: Docker y Docker Compose

## Variables de Entorno

El archivo `.env.example` contiene todas las variables necesarias para el proyecto. Las principales categorías incluyen:

- **Configuración Básica**
- NODE_ENV
- PORT
- API_PREFIX

- **Base de Datos**
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- DATABASE_URL

- **JWT**
- JWT_SECRET
- JWT_EXPIRATION_TIME

- **AWS S3**
- AWS_BUCKET_NAME
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION

- **Email**
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD

- **Unsplash**
- UNSPLASH_ACCESS_KEY
- UNSPLASH_SECRET_KEY

## Estructura del Proyecto

### Configuración Docker

El proyecto utiliza un enfoque de multi-stage build para optimizar las imágenes de Docker:

- **Desarrollo**:
- Hot-reload habilitado
- Volúmenes montados para desarrollo en tiempo real
- Migraciones automáticas de base de datos

- **Producción**:
- Build optimizado
- Dependencias de producción únicamente
- Configuración para mejor rendimiento

Las migraciones de base de datos se ejecutan automáticamente al iniciar los contenedores, asegurando que el esquema de la base de datos esté siempre actualizado.

## Arquitectura del Proyecto

El proyecto implementa una Arquitectura Hexagonal,siguiendo los principios de Domain-Driven Design (DDD) y Clean Architecture.

### Estructura de Carpetas

```
src/
├── app/              # Módulo principal de la aplicación
├── auth/             # Módulo de autenticación
│   ├── api/          # Capa de adaptadores primarios (controladores)
│   ├── application/  # Casos de uso y lógica de aplicación
│   ├── domain/       # Entidades y lógica de dominio
│   ├── interfaces/   # Puertos (interfaces y contratos)
│   └── guards/       # Guardias de autenticación
├── contexts/         # Contextos compartidos
│   └── shared/       # Funcionalidades compartidas entre módulos
├── files/            # Módulo de gestión de archivos
│   ├── api/          # Adaptadores primarios
│   └── application/  # Casos de uso
└── images/           # Módulo de gestión de imágenes
    ├── api/          # Adaptadores primarios
    └── application/  # Casos de uso
```

### Capas de la Arquitectura

1. **Dominio (Domain)**

- Contiene la lógica de negocio central
- Entidades y objetos de valor
- Interfaces del dominio
- Reglas de negocio

2. **Aplicación (Application)**

- Casos de uso
- Servicios de aplicación
- Orquestación de la lógica de negocio
- DTOs y mappers

3. **Adaptadores (Adapters)**

- **Primarios (API)**:
  - Controladores REST
  - Middlewares
  - Transformadores de entrada
- **Secundarios**:
  - Implementaciones de repositorios
  - Servicios externos
  - Adaptadores de base de datos

### Patrones de Diseño Implementados

- Repository Pattern
- Dependency Injection
- Factory Pattern
- Command/Query Separation (CQRS)
- Guard Pattern para autenticación

## Infrastructure y Escalabilidad

### Infraestructura Cloud

- **AWS S3**: Almacenamiento de archivos escalable y seguro
- **PostgreSQL**: Base de datos relacional robusta
- **Docker**: Contenedorización para desarrollo y producción
- **CI/CD**: Integración y despliegue continuo con Docker

### Prácticas de Escalabilidad

- **Arquitectura Modular**: Diseño basado en módulos independientes siguiendo principios SOLID
- **Microservicios Ready**: Estructura preparada para evolucionar a microservicios
- **Caching**: Implementación de estrategias de caché para optimizar rendimiento
- **Load Balancing**: Preparado para balanceo de carga horizontal
- **Database Optimization**: Uso de Prisma ORM con optimización de consultas
- **API Documentation**: Swagger/OpenAPI para documentación clara y mantenible
- **Environment Configuration**: Gestión robusta de variables de entorno
- **Error Handling**: Sistema centralizado de manejo de errores

### Control de Calidad y Git Hooks

El proyecto utiliza Husky para garantizar la calidad del código antes de cada commit:

- **Pre-commit hooks**:
- Lint-staged para verificar archivos modificados
- ESLint para análisis estático de código
- Prettier para formateo consistente

- **Commit Message Control**:
- Commitlint para asegurar mensajes de commit estandarizados
- Convención de commits convencionales

### Seguridad

- JWT para autenticación
- Protección contra inyección SQL con Prisma
- Encriptación de datos sensibles
- Validación de entrada con class-validator
- Sanitización de archivos subidos
- Variables de entorno seguras

### Monitoreo y Logging

- Sistema de logging estructurado
- Métricas de rendimiento
- Trazabilidad de operaciones
- Monitoreo de salud del sistema
