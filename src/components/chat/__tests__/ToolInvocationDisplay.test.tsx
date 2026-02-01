import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("ToolInvocationDisplay shows creating message for create command", () => {
  const toolInvocation = {
    toolCallId: "test-1",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
      path: "/App.jsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("ToolInvocationDisplay shows editing message for str_replace command", () => {
  const toolInvocation = {
    toolCallId: "test-2",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "str_replace",
      path: "/components/Button.tsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /components/Button.tsx")).toBeDefined();
});

test("ToolInvocationDisplay shows inserting message for insert command", () => {
  const toolInvocation = {
    toolCallId: "test-3",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "insert",
      path: "/utils.js",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Inserting into /utils.js")).toBeDefined();
});

test("ToolInvocationDisplay shows viewing message for view command", () => {
  const toolInvocation = {
    toolCallId: "test-4",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "view",
      path: "/config.json",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing /config.json")).toBeDefined();
});

test("ToolInvocationDisplay shows reverting message for undo_edit command", () => {
  const toolInvocation = {
    toolCallId: "test-5",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "undo_edit",
      path: "/App.jsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Reverting /App.jsx")).toBeDefined();
});

test("ToolInvocationDisplay shows renaming message for file_manager rename", () => {
  const toolInvocation = {
    toolCallId: "test-6",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "rename",
      path: "/OldComponent.tsx",
      new_path: "/NewComponent.tsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(
    screen.getByText("Renaming /OldComponent.tsx to /NewComponent.tsx")
  ).toBeDefined();
});

test("ToolInvocationDisplay shows deleting message for file_manager delete", () => {
  const toolInvocation = {
    toolCallId: "test-7",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "delete",
      path: "/TempFile.tsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting /TempFile.tsx")).toBeDefined();
});

test("ToolInvocationDisplay shows loading state when not completed", () => {
  const toolInvocation = {
    toolCallId: "test-8",
    toolName: "str_replace_editor",
    state: "pending",
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
  const loadingIcon = container.querySelector('[aria-label="Loading"]');
  expect(loadingIcon).toBeDefined();
});

test("ToolInvocationDisplay shows completed state when result exists", () => {
  const toolInvocation = {
    toolCallId: "test-9",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
      path: "/App.jsx",
    },
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  const completedIcon = container.querySelector('[aria-label="Completed"]');
  expect(completedIcon).toBeDefined();
});

test("ToolInvocationDisplay handles missing args gracefully", () => {
  const toolInvocation = {
    toolCallId: "test-10",
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Modifying file")).toBeDefined();
});

test("ToolInvocationDisplay handles missing path in args", () => {
  const toolInvocation = {
    toolCallId: "test-11",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating file")).toBeDefined();
});

test("ToolInvocationDisplay handles unknown command", () => {
  const toolInvocation = {
    toolCallId: "test-12",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "unknown_command",
      path: "/test.js",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Modifying /test.js")).toBeDefined();
});

test("ToolInvocationDisplay handles unknown tool name", () => {
  const toolInvocation = {
    toolCallId: "test-13",
    toolName: "unknown_tool",
    state: "result",
    args: {
      path: "/test.js",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("ToolInvocationDisplay handles file_manager rename with missing new_path", () => {
  const toolInvocation = {
    toolCallId: "test-14",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "rename",
      path: "/OldFile.tsx",
    },
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(
    screen.getByText("Renaming /OldFile.tsx to new location")
  ).toBeDefined();
});

test("ToolInvocationDisplay applies correct styling", () => {
  const toolInvocation = {
    toolCallId: "test-15",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
      path: "/App.jsx",
    },
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("bg-neutral-50");
  expect(element.className).toContain("rounded-lg");
  expect(element.className).toContain("border-neutral-200");
});

test("ToolInvocationDisplay shows loading animation for in-progress state", () => {
  const toolInvocation = {
    toolCallId: "test-16",
    toolName: "str_replace_editor",
    state: "pending",
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  const loadingIcon = container.querySelector(".animate-spin");
  expect(loadingIcon).toBeDefined();
});
