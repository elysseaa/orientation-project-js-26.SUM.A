import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Experience from "./experience";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders Experience form", () => {
  render(<Experience onBack={() => {}} onSave={() => {}} />);
  expect(screen.getByText("Add Experience")).toBeInTheDocument();
  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
});

test("shows validation errors on empty submit", async () => {
  render(<Experience onBack={() => {}} onSave={() => {}} />);

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Company is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Start date is required/i)).toBeInTheDocument();
  });
});

test("submits form data correctly", async () => {
  const mockOnSave = jest.fn();
  const mockOnBack = jest.fn();

  render(<Experience onBack={mockOnBack} onSave={mockOnSave} />);

  fireEvent.change(screen.getByLabelText(/Title/i), {
    target: { value: "SWE Fellow" },
  });
  fireEvent.change(screen.getByLabelText(/Company/i), {
    target: { value: "MLH" },
  });

  const [startMonth, startYear] = screen.getAllByRole("combobox").slice(0, 2);
  const [endMonth, endYear] = screen.getAllByRole("combobox").slice(2, 4);

  fireEvent.change(startMonth, { target: { value: "January" } });
  fireEvent.change(startYear, { target: { value: "2023" } });

  fireEvent.click(screen.getByRole("checkbox")); // Check "Present"

  fireEvent.change(screen.getByLabelText(/Description/i), {
    target: { value: "Writing code" },
  });
  fireEvent.change(screen.getByLabelText(/Logo/i), {
    target: { value: "logo.png" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/resume/experience",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "SWE Fellow",
          company: "MLH",
          start_date: "January 2023",
          end_date: "Present",
          description: "Writing code",
          logo: "logo.png",
        }),
      })
    );
  });

  expect(mockOnSave).toHaveBeenCalledWith({
    id: 1,
    title: "SWE Fellow",
    company: "MLH",
    start_date: "January 2023",
    end_date: "Present",
    description: "Writing code",
    logo: "logo.png",
  });

  expect(mockOnBack).toHaveBeenCalled();
});
