import { container } from "tsyringe";
import "@/products/infrastructure/container";
import { ProductsTypeormRepository } from "@/products/infrastructure/typeorm/repositories/products-typeorm.repository";
import { OrdersTypeormRepository } from "../typeorm/repositories/orders-typeorm.repository";
import { dataSource } from "@/common/infrastructure/typeorm";
import { Order } from "../typeorm/entities/orders.entity";
import { CreateOrderUseCase } from "@/orders/application/usecases/create-order.usecase";
import { GetOrderUseCase } from "@/orders/application/usecases/get-order.usecase";

container.registerSingleton("OrdersRepository", OrdersTypeormRepository);
container.registerSingleton("ProductsRepository", ProductsTypeormRepository);
container.register(
  "OrdersDefaultRepositoryTypeorm",
  { useFactory: () => dataSource.getRepository(Order) },
);

import { SearchOrderUseCase } from "@/orders/application/usecases/search-order.usecase";

container.registerSingleton("CreateOrderUseCase", CreateOrderUseCase.UseCase);
container.registerSingleton("GetOrderUseCase", GetOrderUseCase.UseCase);
container.registerSingleton("SearchOrderUseCase", SearchOrderUseCase.UseCase);
