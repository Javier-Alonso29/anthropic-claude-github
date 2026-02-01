import { Loader2, FileEdit, FilePlus, FileX, FolderSync, Eye } from "lucide-react";

interface ToolInvocationArgs {
  path?: string;
  command?: string;
  new_path?: string;
  [key: string]: any;
}

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: string;
  args?: ToolInvocationArgs;
  result?: any;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

interface ToolDisplayInfo {
  message: string;
  Icon: typeof FileEdit;
}

function getToolDisplayInfo(
  toolName: string,
  args?: ToolInvocationArgs
): ToolDisplayInfo {
  const path = args?.path || "file";
  const command = args?.command;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          message: `Creating ${path}`,
          Icon: FilePlus,
        };
      case "str_replace":
        return {
          message: `Editing ${path}`,
          Icon: FileEdit,
        };
      case "insert":
        return {
          message: `Inserting into ${path}`,
          Icon: FileEdit,
        };
      case "view":
        return {
          message: `Viewing ${path}`,
          Icon: Eye,
        };
      case "undo_edit":
        return {
          message: `Reverting ${path}`,
          Icon: FileEdit,
        };
      default:
        return {
          message: `Modifying ${path}`,
          Icon: FileEdit,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        const newPath = args?.new_path || "new location";
        return {
          message: `Renaming ${path} to ${newPath}`,
          Icon: FolderSync,
        };
      case "delete":
        return {
          message: `Deleting ${path}`,
          Icon: FileX,
        };
      default:
        return {
          message: `Managing ${path}`,
          Icon: FolderSync,
        };
    }
  }

  return {
    message: toolName,
    Icon: FileEdit,
  };
}

export function ToolInvocationDisplay({
  toolInvocation,
}: ToolInvocationDisplayProps) {
  const { message, Icon } = getToolDisplayInfo(
    toolInvocation.toolName,
    toolInvocation.args
  );
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
            aria-label="Completed"
          ></div>
          <Icon className="w-3 h-3 text-neutral-600 flex-shrink-0" />
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2
            className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0"
            aria-label="Loading"
          />
          <Icon className="w-3 h-3 text-neutral-600 flex-shrink-0" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
