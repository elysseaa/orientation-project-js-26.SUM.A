import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Skill from "./skill";

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

// checks if form heading and input fields are present in DOM
test("renders Skill form", () => {
  render(<Skill onBack={() => {}} onSave={() => {}} />);
  expect(screen.getByText("Add Skill")).toBeInTheDocument();
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Proficiency/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Logo/i)).toBeInTheDocument();
});

// checks that error messages appear for all input fields upon empty save
test("shows validation errors on empty submit", async () => {
  render(<Skill onBack={() => {}} onSave={() => {}} />);

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Proficiency is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Logo is required/i)).toBeInTheDocument();
  });
});

// checks POST request with valid data upon save
test("submits form data correctly", async () => {
  const mockOnSave = jest.fn();
  const mockOnBack = jest.fn();

  render(<Skill onBack={mockOnBack} onSave={mockOnSave} />);

  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "JavaScript" },
  });
  fireEvent.change(screen.getByLabelText(/Proficiency/i), {
    target: { value: "2-4 years" },
  });
  fireEvent.change(screen.getByLabelText(/Logo/i), {
    target: { value: "example-logo.png" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/resume/skill",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "JavaScript",
          proficiency: "2-4 years",
          logo: "example-logo.png",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      name: "JavaScript",
      proficiency: "2-4 years",
      logo: "example-logo.png",
    });
  });

  await waitFor(() => {
    expect(mockOnBack).toHaveBeenCalled();
  });
});
