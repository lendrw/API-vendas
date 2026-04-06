import {
  SearchInput,
  SearchOutput,
} from "@/common/domain/repositories/repository.interface";
import { OrderModel } from "@/orders/domain/models/orders.model";
import {
  CreateOrderProps,
  OrdersRepository,
} from "@/orders/domain/repositories/orders.repository";
import { inject, injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { Order } from "../entities/orders.entity";
import { OrderProduct } from "../entities/orders-products.entity";
import { ProductsTypeormRepository } from "@/products/infrastructure/typeorm/repositories/products-typeorm.repository";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { BadRequestError } from "@/common/domain/errors/bad-request-error";

@injectable()
export class OrdersTypeormRepository implements OrdersRepository {
  constructor(
    @inject("OrdersDefaultRepositoryTypeorm")
    private ordersRepository: Repository<Order>,
    @inject("ProductsRepository")
    private productsRepository: ProductsTypeormRepository,
  ) {}

  async createOrder(
    connection: DataSource,
    { customer, products: requestedProducts }: CreateOrderProps,
  ): Promise<OrderModel> {
    return connection.manager.transaction(
      async (transactionalEntityManager) => {
        // Criar itens do pedido
        const serializedOrderProducts = requestedProducts.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
          price: product.price,
        }));

        // Verificar estoque de cada produto
        for (const serializedOrderProduct of serializedOrderProducts) {
          const product = await this.productsRepository.findById(
            serializedOrderProduct.product_id,
          );
          if (serializedOrderProduct.quantity > product.quantity) {
            throw new BadRequestError(`Product ${product.id} is out of stock`);
          }
        }

        // Criar pedido
        const newOrder = transactionalEntityManager.create(Order, {
          customer_id: customer.id,
        });
        const order = await transactionalEntityManager.save(newOrder);

        // Criar itens do pedido com order_id
        const orderProductsEntities = serializedOrderProducts.map((op) =>
          transactionalEntityManager.create(OrderProduct, {
            order_id: order.id,
            product_id: op.product_id,
            quantity: op.quantity,
            price: op.price,
          }),
        );
        order.order_products = await transactionalEntityManager.save(orderProductsEntities);

        // Atualizar estoque de cada produto
        for (const product of requestedProducts) {
          const productUpdate = await this.productsRepository.findById(
            product.id,
          );
          productUpdate.quantity -= product.quantity;
          await transactionalEntityManager.save(productUpdate);
        }

        return order;
      },
    );
  }

  create(props: CreateOrderProps): OrderModel {
    throw new Error("Method not implemented.");
  }

  insert(model: OrderModel): Promise<OrderModel> {
    throw new Error("Method not implemented.");
  }

  findById(id: string): Promise<OrderModel> {
    return this._get(id);
  }

  update(model: OrderModel): Promise<OrderModel> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  search(props: SearchInput): Promise<SearchOutput<OrderModel>> {
    return this.ordersRepository.findAndCount({
      relations: { order_products: true },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
      order: { created_at: "DESC" },
    }).then(([items, total]) => ({
      items,
      total,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }));
  }

  protected async _get(id: string): Promise<OrderModel> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        order_products: true,
      },
    });
    if (!order) {
      throw new NotFoundError(`Order not found using ID ${id}`);
    }
    return order;
  }
}
