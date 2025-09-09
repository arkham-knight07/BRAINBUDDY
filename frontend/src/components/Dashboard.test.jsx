import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

test("renders dashboard heading", () => {
  render(<Dashboard />);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
