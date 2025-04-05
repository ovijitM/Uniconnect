
import { Toast, ToasterToast, ToastApi } from "./types";
import { dispatch } from "./toast-store";
import { toastTimeouts } from "./reducer";

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Create the base toast function
function toastFunction({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Enhanced toast with variant helpers
export const toast = toastFunction as ToastApi;

// Add variant helper methods
toast.success = (props) => toastFunction({ ...props, variant: "success" });
toast.error = (props) => toastFunction({ ...props, variant: "destructive" });
toast.info = (props) => toastFunction({ ...props, variant: "info" });
toast.warning = (props) => toastFunction({ ...props, variant: "warning" });
