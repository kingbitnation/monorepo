import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContextProvider } from "@/context/AppContext";
import { AppRouter } from "@/routes/AppRouter";

test("renders project title on home page", () => {
  render(
    <AppContextProvider>
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    </AppContextProvider>
  );

  expect(screen.getByText("project-1")).toBeInTheDocument();
});
