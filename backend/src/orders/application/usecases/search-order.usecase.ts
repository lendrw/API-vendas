import { inject, injectable } from "tsyringe";
import { OrdersRepository } from "@/orders/domain/repositories/orders.repository";
import { OrderOutput } from "../dtos/order-output.dto";

export namespace SearchOrderUseCase {
  export type Input = {
    page?: number;
    per_page?: number;
  };

  export type Output = {
    items: OrderOutput[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };

  @injectable()
  export class UseCase {
    constructor(
      @inject("OrdersRepository")
      private ordersRepository: OrdersRepository,
    ) {}

    async execute({ page = 1, per_page = 15 }: Input): Promise<Output> {
      const result = await this.ordersRepository.search({ page, per_page, sort: null, sort_dir: null, filter: null });
      return {
        items: result.items,
        total: result.total,
        current_page: result.current_page,
        per_page: result.per_page,
        last_page: Math.ceil(result.total / result.per_page),
      };
    }
  }
}
