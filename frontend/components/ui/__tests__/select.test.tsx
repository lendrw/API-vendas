import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Select from "../select";

describe("Select", () => {
  it("associates the label with the select", () => {
    render(
      <Select label="Status">
        <option>Active</option>
      </Select>,
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("uses the provided id when present", () => {
    render(
      <Select id="order-status" label="Status">
        <option>Pending</option>
      </Select>,
    );

    expect(screen.getByLabelText("Status")).toHaveAttribute("id", "order-status");
  });

  it("renders options and handles value changes", () => {
    const onChange = jest.fn();

    render(
      <Select label="Status" defaultValue="pending" onChange={onChange}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </Select>,
    );

    const select = screen.getByLabelText("Status");

    expect(screen.getByRole("option", { name: "Pending" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Paid" })).toBeVisible();

    fireEvent.change(select, { target: { value: "paid" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue("paid");
  });

  it("shows the error state", () => {
    render(
      <Select label="Status" error="Status is required">
        <option>Pending</option>
      </Select>,
    );

    expect(screen.getByText("Status is required")).toBeVisible();
    expect(screen.getByLabelText("Status")).toHaveClass("border-red-400");
  });

  it("passes native select props through", () => {
    render(
      <Select label="Status" name="status" disabled>
        <option>Pending</option>
      </Select>,
    );

    expect(screen.getByLabelText("Status")).toHaveAttribute("name", "status");
    expect(screen.getByLabelText("Status")).toBeDisabled();
  });

  it("forwards the ref to the select element", () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select label="Status" ref={ref}>
        <option>Pending</option>
      </Select>,
    );

    expect(ref.current).toBe(screen.getByLabelText("Status"));
  });
});
