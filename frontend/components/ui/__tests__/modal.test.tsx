import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "../modal";

describe("Modal", () => {
  it("does not render when closed", () => {
    render(
      <Modal open={false} title="Edit product" onClose={jest.fn()}>
        Form content
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and content when open", () => {
    render(
      <Modal open title="Edit product" onClose={jest.fn()}>
        Form content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Edit product" })).toBeVisible();
    expect(screen.getByText("Form content")).toBeVisible();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();

    render(
      <Modal open title="Edit product" onClose={onClose}>
        Form content
      </Modal>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = jest.fn();

    render(
      <Modal open title="Edit product" onClose={onClose}>
        Form content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
