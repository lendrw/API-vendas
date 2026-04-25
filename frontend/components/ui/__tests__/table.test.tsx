import { render, screen, within } from "@testing-library/react";
import Table from "../table";

type Product = {
  id: string;
  name: string;
  price: number;
  status?: string;
};

const products: Product[] = [
  { id: "1", name: "Keyboard", price: 120, status: "Active" },
  { id: "2", name: "Mouse", price: 80, status: "Draft" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "price", label: "Price", align: "right" as const },
];

describe("Table", () => {
  it("renders column headers and row values", () => {
    render(
      <Table
        columns={columns}
        data={products}
        keyExtractor={(product) => product.id}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Price" })).toBeVisible();
    expect(screen.getByText("Keyboard")).toBeVisible();
    expect(screen.getByText("120")).toBeVisible();
  });

  it("uses custom column renderers", () => {
    render(
      <Table
        columns={[
          { key: "name", label: "Name" },
          {
            key: "status",
            label: "Status",
            render: (product) => <strong>{product.status}</strong>,
          },
        ]}
        data={products}
        keyExtractor={(product) => product.id}
      />,
    );

    expect(screen.getByText("Active").tagName).toBe("STRONG");
    expect(screen.getByText("Draft").tagName).toBe("STRONG");
  });

  it("shows an empty state when there is no data", () => {
    render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(product: Product) => product.id}
      />,
    );

    const emptyCell = screen.getByText("Nenhum registro encontrado");

    expect(emptyCell).toBeVisible();
    expect(emptyCell).toHaveAttribute("colspan", String(columns.length));
  });

  it("renders loading skeleton rows instead of the empty state", () => {
    const { container } = render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(product: Product) => product.id}
        loading
      />,
    );

    expect(screen.queryByText("Nenhum registro encontrado")).not.toBeInTheDocument();
    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
  });

  it("passes data-testid to the wrapper", () => {
    render(
      <Table
        columns={columns}
        data={products}
        keyExtractor={(product) => product.id}
        data-testid="products-table"
      />,
    );

    expect(screen.getByTestId("products-table")).toBeInTheDocument();
  });

  it("applies column alignment classes", () => {
    render(
      <Table
        columns={[
          { key: "name", label: "Name", align: "center" },
          { key: "price", label: "Price", align: "right" },
        ]}
        data={[products[0]]}
        keyExtractor={(product) => product.id}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveClass("text-center");
    expect(screen.getByRole("columnheader", { name: "Price" })).toHaveClass("text-right");

    const row = screen.getByText("Keyboard").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row as HTMLTableRowElement).getByText("Keyboard")).toHaveClass("text-center");
    expect(within(row as HTMLTableRowElement).getByText("120")).toHaveClass("text-right");
  });
});
