import { render, screen } from "@testing-library/react";
import Input from "../input";

describe("Input", () => {
  it("associates the label with the input", () => {
    render(<Input label="Email" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(<Input label="Password" hint="Minimum 6 characters" />);

    expect(screen.getByText("Minimum 6 characters")).toBeVisible();
  });

  it("shows the error instead of the hint", () => {
    render(
      <Input
        label="Password"
        hint="Minimum 6 characters"
        error="Password is required"
      />,
    );

    expect(screen.getByText("Password is required")).toBeVisible();
    expect(screen.queryByText("Minimum 6 characters")).not.toBeInTheDocument();
  });
});
