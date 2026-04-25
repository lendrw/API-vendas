import { render, screen } from "@testing-library/react";
import Button from "../button";

describe("Button", () => {
  it("renders children and keeps the button enabled by default", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Save");
  });

  it("disables the button while loading", () => {
    render(<Button loading>Saving</Button>);

    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
  });

  it("keeps an explicitly disabled button disabled", () => {
    render(<Button disabled>Delete</Button>);

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });
});
