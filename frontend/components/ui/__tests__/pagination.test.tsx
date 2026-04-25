import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "../pagination";

describe("Pagination", () => {
  it("does not render for a single page", () => {
    const { container } = render(
      <Pagination current={1} last={1} onChange={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the current page and total pages", () => {
    render(<Pagination current={2} last={5} onChange={jest.fn()} />);

    expect(screen.getByText("Page 2 of 5")).toBeVisible();
  });

  it("disables previous on the first page", () => {
    render(<Pagination current={1} last={3} onChange={jest.fn()} />);

    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
    expect(screen.getByTestId("pagination-next")).toBeEnabled();
  });

  it("disables next on the last page", () => {
    render(<Pagination current={3} last={3} onChange={jest.fn()} />);

    expect(screen.getByTestId("pagination-prev")).toBeEnabled();
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
  });

  it("requests previous and next pages", () => {
    const onChange = jest.fn();

    render(<Pagination current={2} last={3} onChange={onChange} />);

    fireEvent.click(screen.getByTestId("pagination-prev"));
    fireEvent.click(screen.getByTestId("pagination-next"));

    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 3);
  });
});
