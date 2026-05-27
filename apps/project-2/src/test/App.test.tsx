import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRouter } from "@/routes/AppRouter";

test("renders project-2 home title", () => {
  render(
    <MemoryRouter>
      <AppRouter />
    </MemoryRouter>
  );

  expect(screen.getByText("project-2")).toBeInTheDocument();
});
