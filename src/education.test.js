import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Education from "./education";

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
test("renders Education form", () => {
  render(<Education onBack={() => {}} onSave={() => {}} />);
  expect(screen.getByText("Add Education")).toBeInTheDocument();
  expect(screen.getByLabelText(/Course/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/School/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Grade/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Logo/i)).toBeInTheDocument();
});

// checks that error messages appear for all input fields upon empty save
test("shows validation errors on empty submit", async () => {
  render(<Education onBack={() => {}} onSave={() => {}} />);

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(screen.getByText(/Course is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/School is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Start date is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Grade is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Logo is required/i)).toBeInTheDocument();
  });
});

// checks that a non-numeric grade value shows a validation error
test("shows grade format error for non-numeric grade", async () => {
  render(<Education onBack={() => {}} onSave={() => {}} />);

  fireEvent.change(screen.getByLabelText(/Grade/i), {
    target: { value: "abc" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(
      screen.getByText(/Grade must be a number between 0 and 100/i)
    ).toBeInTheDocument();
  });
});

// checks that an out-of-range grade value shows a validation error
test("shows grade format error for invalid grade", async () => {
  render(<Education onBack={() => {}} onSave={() => {}} />);

  fireEvent.change(screen.getByLabelText(/Grade/i), {
    target: { value: "150%" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(
      screen.getByText(/Grade must be a number between 0 and 100/i)
    ).toBeInTheDocument();
  });
});

// checks that an end date before start date shows a validation error
test("shows error when end date is before start date", async () => {
  render(<Education onBack={() => {}} onSave={() => {}} />);

  const selects = screen.getAllByRole("combobox");
  fireEvent.change(selects[0], { target: { value: "August" } });
  fireEvent.change(selects[1], { target: { value: "2024" } });
  fireEvent.change(selects[2], { target: { value: "January" } });
  fireEvent.change(selects[3], { target: { value: "2022" } });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(
      screen.getByText(/End date cannot be before start date/i)
    ).toBeInTheDocument();
  });
});

// checks POST request with a specific end date instead of Present
test("submits form data correctly with a specific end date", async () => {
  const mockOnSave = jest.fn();
  const mockOnBack = jest.fn();

  render(<Education onBack={mockOnBack} onSave={mockOnSave} />);

  fireEvent.change(screen.getByLabelText(/Course/i), {
    target: { value: "Engineering" },
  });
  fireEvent.change(screen.getByLabelText(/School/i), {
    target: { value: "NYU" },
  });

  const selects = screen.getAllByRole("combobox");
  fireEvent.change(selects[0], { target: { value: "October" } });
  fireEvent.change(selects[1], { target: { value: "2022" } });
  fireEvent.change(selects[2], { target: { value: "August" } });
  fireEvent.change(selects[3], { target: { value: "2024" } });

  fireEvent.change(screen.getByLabelText(/Grade/i), {
    target: { value: "86%" },
  });
  fireEvent.change(screen.getByLabelText(/Logo/i), {
    target: { value: "example-logo.png" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/resume/education",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: "Engineering",
          school: "NYU",
          start_date: "October 2022",
          end_date: "August 2024",
          grade: "86%",
          logo: "example-logo.png",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      course: "Engineering",
      school: "NYU",
      start_date: "October 2022",
      end_date: "August 2024",
      grade: "86%",
      logo: "example-logo.png",
    });
  });

  await waitFor(() => {
    expect(mockOnBack).toHaveBeenCalled();
  });
});

// checks POST request with valid data upon save
test("submits form data correctly", async () => {
  const mockOnSave = jest.fn();
  const mockOnBack = jest.fn();

  render(<Education onBack={mockOnBack} onSave={mockOnSave} />);

  fireEvent.change(screen.getByLabelText(/Course/i), {
    target: { value: "Engineering" },
  });
  fireEvent.change(screen.getByLabelText(/School/i), {
    target: { value: "NYU" },
  });

  const selects = screen.getAllByRole("combobox");
  fireEvent.change(selects[0], { target: { value: "October" } });
  fireEvent.change(selects[1], { target: { value: "2022" } });

  fireEvent.click(screen.getByRole("checkbox"));

  fireEvent.change(screen.getByLabelText(/Grade/i), {
    target: { value: "86%" },
  });
  fireEvent.change(screen.getByLabelText(/Logo/i), {
    target: { value: "example-logo.png" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/resume/education",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: "Engineering",
          school: "NYU",
          start_date: "October 2022",
          end_date: "Present",
          grade: "86%",
          logo: "example-logo.png",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      course: "Engineering",
      school: "NYU",
      start_date: "October 2022",
      end_date: "Present",
      grade: "86%",
      logo: "example-logo.png",
    });
  });

  await waitFor(() => {
    expect(mockOnBack).toHaveBeenCalled();
  });
});
