"use client";

import { ModalAddWorkspace } from "@/components/ui/navigation/modal-add-workspace";
import { DashboardAvatar } from "@/components/dashboard-avatar";
import { cn, focusInput } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";

const workspaces = [
  {
    value: "pulse-analytics",
    name: "Pulse analytics",
    role: "Member",
  },
] as const;

const selectedWorkspace = workspaces[0];

const getWorkspaceAvatarSeed = (workspace: (typeof workspaces)[number]) =>
  workspace.value;

export function WorkspacesDropdownDesktop() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
      queueMicrotask(() => dropdownTriggerRef.current?.focus());
    }
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger
        ref={dropdownTriggerRef}
        render={
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-x-3 rounded-2xl border border-border bg-card p-2.5 text-sm shadow-sm transition-all hover:bg-muted/60",
              focusInput,
            )}
          >
            <DashboardAvatar
              seed={getWorkspaceAvatarSeed(selectedWorkspace)}
              square
              className="size-8 rounded-2xl border-border/70"
            />
            <div className="flex w-full items-center justify-between gap-x-4 truncate">
              <div className="truncate">
                <p className="truncate text-sm font-medium whitespace-nowrap text-foreground">
                  {selectedWorkspace.name}
                </p>
                <p className="text-left text-xs whitespace-nowrap text-muted-foreground">
                  {selectedWorkspace.role}
                </p>
              </div>
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </button>
        }
      />
      <DropdownMenuContent
        className={cn("min-w-72", hasOpenDialog && "hidden")}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Workspaces ({workspaces.length})
          </DropdownMenuLabel>
          {workspaces.map((workspace) => (
            <DropdownMenuItem key={workspace.value}>
              <div className="flex w-full items-center gap-x-2.5">
                <DashboardAvatar
                  seed={getWorkspaceAvatarSeed(workspace)}
                  square
                  className="size-8 rounded-2xl border-border/70"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {workspace.role}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ModalAddWorkspace
          onSelect={() => {}}
          onOpenChange={handleDialogItemOpenChange}
          itemName="Add workspace"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function WorkspacesDropdownMobile() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
      queueMicrotask(() => dropdownTriggerRef.current?.focus());
    }
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger
        ref={dropdownTriggerRef}
        render={
          <button
            type="button"
            className="flex max-w-[min(100%,20rem)] min-w-0 items-center gap-x-1.5 rounded-2xl p-2.5 hover:bg-muted focus:outline-none"
          >
            <DashboardAvatar
              seed={getWorkspaceAvatarSeed(selectedWorkspace)}
              square
              className="size-8 rounded-2xl border-border/70"
            />
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-x-3">
              <p className="truncate text-sm font-medium text-foreground">
                {selectedWorkspace.name}
              </p>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </button>
        }
      />
      <DropdownMenuContent
        className={cn("min-w-72!", hasOpenDialog && "hidden")}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Workspaces ({workspaces.length})
          </DropdownMenuLabel>
          {workspaces.map((workspace) => (
            <DropdownMenuItem key={workspace.value}>
              <div className="flex w-full items-center gap-x-2.5">
                <DashboardAvatar
                  seed={getWorkspaceAvatarSeed(workspace)}
                  square
                  className="size-8 rounded-2xl border-border/70"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {workspace.role}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ModalAddWorkspace
          onSelect={() => {}}
          onOpenChange={handleDialogItemOpenChange}
          itemName="Add workspace"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
