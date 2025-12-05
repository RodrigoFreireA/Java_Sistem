ToyLog

License: MIT

Build

```bash
mvn -DskipTests package
java -jar target/toylog-0.0.1-SNAPSHOT.jar
```

Run

Configure datasource via environment variables: `JDBC_DATABASE_URL`, `JDBC_DATABASE_USERNAME`, `JDBC_DATABASE_PASSWORD`.

For development you can run a local PostgreSQL instance (e.g. Docker).
ToyLog - Sistema de Gestão de Estoque e Pedidos

Backend (esqueleto)

Run locally with Docker Postgres:

1) Start a Postgres container:

```bash
docker run --name toylog-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=toylog -p 5432:5432 -d postgres:15
```

2) Build and run the app:

```bash
mvn -DskipTests package
java -jar target/toylog-0.0.1-SNAPSHOT.jar
```

3) The app listens on port `8080` and Flyway will run migrations at startup.

Próximos passos:
- Implementar as entidades JPA (`Product`, `Order`, `OrderItem`, `InventoryMovement`).
- Repositórios Spring Data JPA.
- Serviços com regras de negócio (controle de estoque com @Transactional e exceção customizada).
- Endpoints REST para produtos, pedidos e alerta de baixo estoque.

Status atual:
- Esqueleto do projeto (Spring Boot, Flyway, Postgres) criado.
- Entidades JPA e repositórios implementados.
- `ProductService` com `decreaseStock` e audit log parcial implementados.

Como rodar (local com Docker Postgres):

```bash
# start postgres
docker run --name toylog-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=toylog -p 5432:5432 -d postgres:15

# build and run
mvn -DskipTests package
java -jar target/toylog-0.0.1-SNAPSHOT.jar
```

Rodando testes:

```bash
mvn test
```

Endpoints (esqueleto / a implementar):
- `POST /api/products` : criar produto
- `GET  /api/products/low-stock` : retorna produtos abaixo do `minStockLevel`
- `POST /api/orders` : criar pedido (checkout) — operação transacional que baixa estoque

Endpoints implementados nesta etapa:
- `POST /api/products` : criar produto
- `GET  /api/products/low-stock` : retorna produtos abaixo do `minStockLevel`
- `POST /api/products/{id}/decrease?quantity=X&username=Y` : diminuir estoque (venda)
- `POST /api/orders` : criar pedido (checkout) — operação transacional que baixa estoque

Exemplo rápido (curl) — listar produtos com estoque baixo (quando endpoint implementado):

```bash
curl -X GET http://localhost:8080/api/products/low-stock
```

Observações e próximos compromissos:
- Implementar controllers e DTOs para `Product` e `Order`.
- Implementar `OrderService` com criação transacional de pedidos e rollback em caso de estoque insuficiente.
- Adicionar autenticação JWT com `Spring Security` e fluxos para `Gerente` e `Vendedor`.
- Melhorias: upload de imagem para produtos, indexação por SKU, e endpoints para relatórios de faturamento.

# Java_Sistem