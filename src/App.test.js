import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// simulates GET call that returns no existing record
// (Personal Info makes GET call on mount)
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

test("renders Resume Builder header", () => {
  render(<App />);
  const headerElement = screen.getByText(/Resume Builder/i);
  expect(headerElement).toBeInTheDocument();
});

test("can navigate to Add Experience page and back", () => {
  render(<App />);
  const addBtn = screen.getByText(/Add Experience/i);
  fireEvent.click(addBtn);

  expect(
    screen.getByText(/Add Experience/i, { selector: "h2" })
  ).toBeInTheDocument();

  const cancelBtn = screen.getByText(/Cancel/i);
  fireEvent.click(cancelBtn);

  expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
});

test("can navigate to Add Education page and back", () => {
  render(<App />);
  const addBtn = screen.getByText(/Add Education/i);
  fireEvent.click(addBtn);

  expect(
    screen.getByText(/Add Education/i, { selector: "h2" })
  ).toBeInTheDocument();

  const cancelBtn = screen.getByText(/Cancel/i);
  fireEvent.click(cancelBtn);

  expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
});

test("can navigate to Personal Info page and back", () => {
  render(<App />);
  const addBtn = screen.getByText(/Add Personal Info/i);
  fireEvent.click(addBtn);

  expect(
    screen.getByText(/Add Personal Info/i, { selector: "h2" })
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

  const cancelBtn = screen.getByText(/Cancel/i);
  fireEvent.click(cancelBtn);

  expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
});

test("can navigate to Add Skill page and back", () => {
  render(<App />);
  const addBtn = screen.getByText(/Add Skill/i);
  fireEvent.click(addBtn);

  expect(
    screen.getByText(/Add Skill/i, { selector: "h2" })
  ).toBeInTheDocument();

  const cancelBtn = screen.getByText(/Cancel/i);
  fireEvent.click(cancelBtn);

  expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
});
