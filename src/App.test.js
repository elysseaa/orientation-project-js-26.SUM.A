import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

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
