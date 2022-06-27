import {
  Component,
  JSX,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
import Button from "../Button/Button";
import "./Modal.scss";

type ModalProps = {
  children: JSX.Element;
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  triggerType: "primary-round" | "primary" | "secondary" | "link";
};

const Modal: Component<ModalProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const getHeading = function () {
    switch (props.headingLevel) {
      case 1:
        return <h1>{props.heading}</h1>;
      case 3:
        return <h3>{props.heading}</h3>;
      case 4:
        return <h4>{props.heading}</h4>;
      case 5:
        return <h5>{props.heading}</h5>;
      case 6:
        return <h6>{props.heading}</h6>;
      case 2:
      default:
        return <h2>{props.heading}</h2>;
    }
  };
  let modal: HTMLElement;

  createEffect(() => {
    if (isOpen()) {
      const originalFocusedElement = document.activeElement as HTMLElement;
      const modalFocusableElements = modal.querySelectorAll(focusableElements);
      const firstFocusableElement = modalFocusableElements?.[0] as HTMLElement;
      const lastFocusableElement = modalFocusableElements?.[
        modalFocusableElements.length - 1
      ] as HTMLElement;
      const focusTrap = function (e: KeyboardEvent) {
        const { key, code, shiftKey } = e;
        const isTabPressed = (key || code) === "Tab";
        const isEscapePressed = (key || code) === "Escape";
        if (!isTabPressed && !isEscapePressed) return;
        if (isEscapePressed) return setIsOpen(false);
        if (shiftKey) {
          // if shift key pressed for shift + tab combination
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else {
          // if tab key is pressed
          if (document.activeElement === lastFocusableElement) {
            // if focused has reached to last focusable element then focus first focusable element after pressing tab
            firstFocusableElement?.focus(); // add focus for the first focusable element
            e.preventDefault();
          }
        }
      };
      firstFocusableElement?.focus();
      document.addEventListener("keydown", focusTrap);
      onCleanup(() => {
        console.log("cleanup!");
        document.removeEventListener("keydown", focusTrap);
        console.log({ originalFocusedElement });
        originalFocusedElement?.focus();
      });
    }
  });

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      {isOpen() && (
        <>
          <div class="modal__backdrop" onClick={() => setIsOpen(false)}></div>
          <section role="dialog" class="modal" ref={modal}>
            <header>
              {getHeading()}
              <button
                aria-label="Close Dialog"
                class="modal__close"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </header>
            <div class="modal__body">{props.children}</div>
          </section>
        </>
      )}
    </>
  );
};

export default Modal;
