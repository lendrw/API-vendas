import { Request, Response } from "express";
import { container } from "tsyringe";
import { SearchOrderUseCase } from "@/orders/application/usecases/search-order.usecase";

export async function searchOrderController(
  request: Request,
  response: Response,
): Promise<Response> {
  const page = Number(request.query.page) || 1;
  const per_page = Number(request.query.per_page) || 15;

  const searchOrderUseCase: SearchOrderUseCase.UseCase =
    container.resolve("SearchOrderUseCase");

  const result = await searchOrderUseCase.execute({ page, per_page });

  return response.status(200).json(result);
}
