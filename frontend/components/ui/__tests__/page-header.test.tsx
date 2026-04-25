import { render, screen } from "@testing-library/react";
import PageHeader from "../page-header";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Products" />);

    expect(screen.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Products" description="Manage your catalog" />);

    expect(screen.getByText("Manage your catalog")).toBeVisible();
  });

  it("does not render a description when it is omitted", () => {
    render(<PageHeader title="Products" />);

    expect(screen.queryByText("Manage your catalog")).not.toBeInTheDocument();
  });

  it("renders the action when provided", () => {
    render(
      <PageHeader
        title="Products"
        action={<button type="button">New product</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "New product" })).toBeVisible();
  });
});
