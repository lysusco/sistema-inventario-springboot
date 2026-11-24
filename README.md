# Sistema de Inventario y Proveedores

Aplicación backend para la gestión de inventario, productos y proveedores de un minimercado o negocio comercial. Expone una API REST que permite consultar, crear, actualizar y eliminar productos, así como gestionar proveedores y movimientos de stock.

## Idea del proyecto

Digitalizar el control de inventario: registrar productos con stock mínimo, asociar proveedores, registrar entradas (compras) y salidas (ventas/ajustes), y consultar alertas de stock bajo. Sirve como base para integrarse con un frontend o con un ERP.

## Stack tecnológico

- Java 17
- Spring Boot 3
- Spring Data JPA / Hibernate
- MySQL (configurable a PostgreSQL, SQL Server u Oracle)
- Maven
- (Opcional) Spring Security + JWT para autenticación

## Estructura del proyecto

```
sistema-inventario-springboot/
├── pom.xml
├── src/main/java/com/lysusco/inventario/
│   ├── InventarioApplication.java
│   ├── model/Producto.java
│   ├── model/Proveedor.java
│   ├── repository/ProductoRepository.java
│   ├── repository/ProveedorRepository.java
│   └── controller/ProductoController.java
└── src/main/resources/
    └── application.properties
```

## Cómo ejecutar

1. Instala Java 17 y Maven.
2. Crea la base de datos `inventario_db` en MySQL (o déjala que se cree automáticamente).
3. Configura credenciales en `src/main/resources/application.properties`.
4. Ejecuta:
   ```bash
   mvn spring-boot:run
   ```
5. API disponible en `http://localhost:8085/api/productos`.

## Endpoints principales

- `GET /api/productos` — listar productos
- `GET /api/productos/{id}` — detalle
- `POST /api/productos` — crear
- `PUT /api/productos/{id}` — actualizar
- `DELETE /api/productos/{id}` — eliminar
- `GET /api/productos/stock-bajo` — productos con stock <= mínimo

## Metodología

Scrum: sprints de 2 semanas, backlog priorizado por valor de negocio.

## Autor

Luis Ernesto Corredor Jiménez — https://github.com/lysusco
