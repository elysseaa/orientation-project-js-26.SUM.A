import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PersonalInfo from "./personalInfo";

// simulates GET call that returns no existing record
beforeEach(() => { 
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(null),
    })
  );
});

// clears mock calls after each test
afterEach(() => {
  jest.clearAllMocks();
});

// checks if form heading and input fields are present in DOM
test("renders Personal Info form", () => {
  render(<PersonalInfo onBack={() => {}} />);
  expect(screen.getByText("Add Personal Info")).toBeInTheDocument();
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
});

// checks that error messages appear for all input fields upon empty save
test("shows validation errors on empty submit", async () => {
  render(<PersonalInfo onBack={() => {}} />);

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
  });
});

// checks for invalid phone number formatting
test("shows phone format error for invalid phone number", async () => {
  render(<PersonalInfo onBack={() => {}} />);

  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByLabelText(/Phone/i), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "john@example.com" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(
      screen.getByText(/international country code/i)
    ).toBeInTheDocument();
  });
});

// check POST request with valid data upon save
test("submits form data with POST for a new record", async () => {
  const mockOnBack = jest.fn();
  render(<PersonalInfo onBack={mockOnBack} />);

  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByLabelText(/Phone/i), {
    target: { value: "+11234567890" },
  });
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "john@example.com" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/resume/personal-info",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          phone: "+11234567890",
          email: "john@example.com",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockOnBack).toHaveBeenCalled();
  });
});

// check POST request with valid data upon existing record save
test("pre-populates form and submits with PUT for an existing record", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "John Doe",
          phone: "+11234567890",
          email: "john@example.com",
        }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

  const mockOnBack = jest.fn();
  render(<PersonalInfo onBack={mockOnBack} />);

  await waitFor(() => {
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "John Smith" },
  });

  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/resume/personal-info",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Smith",
          phone: "+11234567890",
          email: "john@example.com",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockOnBack).toHaveBeenCalled();
  });
});
