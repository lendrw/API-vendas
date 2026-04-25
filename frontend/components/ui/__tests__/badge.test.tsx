import { render, screen } from "@testing-library/react";
import Badge from "../badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);

    expect(screen.getByText("Active")).toBeVisible();
  });

  it("uses the gray variant by default", () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText("Draft")).toHaveClass(
      "bg-slate-100",
      "text-slate-600",
      "ring-slate-200",
    );
  });

  it.each([
    ["green", "bg-emerald-50", "text-emerald-700", "ring-emerald-200"],
    ["yellow", "bg-amber-50", "text-amber-700", "ring-amber-200"],
    ["red", "bg-red-50", "text-red-700", "ring-red-200"],
    ["blue", "bg-blue-50", "text-blue-700", "ring-blue-200"],
    ["gray", "bg-slate-100", "text-slate-600", "ring-slate-200"],
  ] as const)("applies the %s variant classes", (variant, bg, text, ring) => {
    render(<Badge variant={variant}>Status</Badge>);

    expect(screen.getByText("Status")).toHaveClass(bg, text, ring);
  });
});
