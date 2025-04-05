
import * as React from "react";
import { Toast } from "@/components/ui/toast";

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export interface ToasterToast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
}

export const TOAST_LIMIT = 5;
export const TOAST_REMOVE_DELAY = 1000;

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ActionType = typeof actionTypes;

export type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

export interface State {
  toasts: ToasterToast[];
}

export type Toast = Omit<ToasterToast, "id">;

// Enhanced toast with variant helpers
export interface ToastApi {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  success: (props: Omit<Toast, "variant">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  error: (props: Omit<Toast, "variant">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  info: (props: Omit<Toast, "variant">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  warning: (props: Omit<Toast, "variant">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
}
