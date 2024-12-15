type ClickOutsideCallback = () => void;

export function clickOutside(el: HTMLElement, callback: ClickOutsideCallback) {
  function onClick(event: MouseEvent) {
    if (el === event.target || event.composedPath().includes(el)) {
      return;
    }
    callback();
  }

  document.body.addEventListener("click", onClick);

  return {
    update(newCallback: ClickOutsideCallback) {
      callback = newCallback;
    },
    destroy() {
      document.body.removeEventListener("click", onClick);
    },
  };
}
