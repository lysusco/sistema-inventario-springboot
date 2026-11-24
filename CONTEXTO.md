# Contexto del Proyecto 1: Sistema de Inventario y Proveedores (Spring Boot)

> Archivo de contexto para iniciar un nuevo chat en OpenCode trabajando específicamente en este proyecto.

## Identidad del desarrollador
- **Nombre:** Luis Ernesto Corredor Jiménez
- **Perfil:** Desarrollador pragmático, nivel básico–intermedio, experiencia en ERP (GeneXus, Java, JS, PHP, Spring Boot, Laravel).
- **GitHub:** https://github.com/lysusco
- **Objetivo:** Demostrar manejo de Spring Boot (Java) con complejidad limitada pero funcional.

## Proyecto
- **Nombre:** Sistema de Inventario y Proveedores
- **Ruta local:** `C:\Users\jimen\OneDrive\Documentos\InformacionTrabajo\sistema-inventario-springboot`
- **Repo GitHub:** https://github.com/lysusco/sistema-inventario-springboot
- **Complejidad objetivo:** básica–intermedia (CRUD claro, validación básica, sin sobre-ingeniería).

## Stack
- Java 21 (JDK instalado)
- Spring Boot 3.3.0
- Spring Web, Spring Data JPA, Hibernate
- MySQL (MariaDB 10.4, vía XAMPP) — base de datos `inventario_db`
- Maven 3.9.6 (instalado en `C:\maven\bin`, añadido al PATH del usuario)
- Puerto del servidor: **8085** (el 8080 está ocupado en el entorno)

## Estructura de archivos
```
sistema-inventario-springboot/
├── pom.xml
├── .gitignore
├── README.md
└── src/main/
    ├── java/com/lysusco/inventario/
    │   ├── InventarioApplication.java
    │   ├── model/Producto.java
    │   ├── repository/ProductoRepository.java
    │   └── controller/ProductoController.java
    └── resources/application.properties
```

## Endpoints disponibles
- `GET    /api/productos` — listar todos
- `GET    /api/productos/{id}` — detalle
- `POST   /api/productos` — crear (validación `@NotBlank`, `@PositiveOrZero`)
- `PUT    /api/productos/{id}` — actualizar
- `DELETE /api/productos/{id}` — eliminar
- `GET    /api/productos/stock-bajo` — productos con stock <= stockMinimo

## Entidades
- `Producto`: id, nombre, descripcion, stock, stockMinimo, precio, isStockBajo().

## Configuración (application.properties)
```
server.port=8085
spring.datasource.url=jdbc:mysql://localhost:3306/inventario_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Cómo ejecutar
```bash
cd C:\Users\jimen\OneDrive\Documentos\InformacionTrabajo\sistema-inventario-springboot
mvn spring-boot:run
# API: http://127.0.0.1:8085/api/productos
```
MySQL debe estar corriendo (XAMPP). Si el puerto 8085 está ocupado, cambiar `server.port` en application.properties.

## Herramientas del entorno
- Java: `java -version` (21)
- Maven: `C:\maven\bin\mvn.cmd` (también en PATH)
- MySQL: `C:\xampp\mysql\bin\mysql.exe`
- Git/GitHub CLI (`gh`) autenticado como `lysusco`.

## Notas importantes
- No usar puerto 8080 (ocupado). Usar 8085.
- El dialecto de Hibernate se detecta automáticamente (no especificar).
- Complejidad limitada: evitar seguridad, paginación avanzada, microservicios. Priorizar funcionalidad clara y código legible.
- El README y el portafolio ya referencian este proyecto.

## Prompt sugerido para el nuevo chat
> "Trabajo en el proyecto Spring Boot de inventario ubicado en C:\Users\jimen\OneDrive\Documentos\InformacionTrabajo\sistema-inventario-springboot. Lee el archivo CONTEXTO.md para tener todo el contexto. Quiero [describe aquí el cambio o adición]."
