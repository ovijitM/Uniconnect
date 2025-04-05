import { Action, State, TOAST_REMOVE_DELAY } from "./types";

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 5), // Using 5 directly since we're keeping logic the same
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effects - This could be extracted into a dismissToast() action,
      // but keeping it here for simplicity
      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          clearTimeout(toastTimeouts.get(toastId));
          toastTimeouts.delete(toastId);
        }
      } else {
        for (const [id, timeout] of toastTimeouts.entries()) {
          clearTimeout(timeout);
          toastTimeouts.delete(id);
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};
