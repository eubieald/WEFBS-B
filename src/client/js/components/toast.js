import { Toast } from "bootstrap";

/**
 * Creates a toast element with the given message and type.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} type - The type of toast (success or error).
 * @return {HTMLElement} - The created toast element.
 */
const createToastElement = (message, type) => {
  const toastElement = document.createElement("div");
  toastElement.classList.add("toast", `bg-${type}`, "text-white");
  toastElement.role = "alert";
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");
  toastElement.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">${
        type === "success" ? "Success" : "Error"
      }</strong>
    </div>
    <div class="toast-body">${message}</div>
  `;
  return toastElement;
};

/**
 * Shows a toast message with the given message and type.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} [type='success'] - The type of the toast. Default is 'success'.
 * @return {void} This function does not return anything.
 */
const showToastNotification = (message, type = "success") => {
  const toastContainer = document.getElementById("toast-container");
  const toastElement = createToastElement(message, type);

  if (toastElement) {
    toastContainer.innerHTML = "";
    toastContainer.appendChild(toastElement); // Append the toast element to the container
    const bsToast = new Toast(toastElement, { autohide: false }); // Create a new Toast instance
    bsToast.show();

    // Hide the toast when the user hovers over it
    toastElement.addEventListener("mouseover", () => {
      if (bsToast.isShown) {
        bsToast.hide(); // Hide the toast
      }
    });

    // Dispose of the toast after it's hidden
    // Remove the toast element from the container
    toastElement.addEventListener("hidden.bs.toast", () => {
      if (bsToast.isShown === false) {
        bsToast.dispose();
      }
      toastContainer.innerHTML = "";
    });
  }
};

export default showToastNotification; // Export the showToast function as the default export
