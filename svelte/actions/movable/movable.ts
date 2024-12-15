export type ElementPosition = {
  x: number;
  y: number;
};

type MovableParams = {
  handle?: string;
  onPositionChange?: (position: ElementPosition) => void;
};

export function movable(node: HTMLElement, params: MovableParams = {}) {
  const handle: HTMLElement = params.handle
    ? node.querySelector(params.handle) ?? node
    : node;

  let isDragging = false;

  function onMouseDown(evt: Event) {
    const event = evt as MouseEvent;
    if (handle.isEqualNode(event.target! as Node)) {
      isDragging = true;

      node.style.left = `${node.getBoundingClientRect().x}px`;
      node.style.top = `${node.getBoundingClientRect().y}px`;
      node.style.position = "fixed";
      node.style.margin = "0";

      if (getComputedStyle(handle).cursor === "grab") {
        handle.style.cursor = "grabbing";
      } else {
        handle.style.cursor = "move";
      }
      node.style.userSelect = "none";

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
    }
  }

  function onMouseMove(evt: Event) {
    const event = evt as MouseEvent;
    if (isDragging && !node.dataset.isResizing) {
      node.style.left = `${node.getBoundingClientRect().x + event.movementX}px`;
      node.style.top = `${node.getBoundingClientRect().y + event.movementY}px`;
    }
    event.stopPropagation();
  }

  function onMouseUp() {
    isDragging = false;
    handle.style.cursor = "";
    node.style.userSelect = "";

    document.body.removeEventListener("mousemove", onMouseMove);
    document.body.removeEventListener("mouseup", onMouseUp);

    params.onPositionChange?.({
      x: node.getBoundingClientRect().x,
      y: node.getBoundingClientRect().y,
    });
  }

  handle.addEventListener("mousedown", onMouseDown);

  return {
    update(newParams: MovableParams) {
      // seems unlikely that the handler could be updated
    },
    destroy() {
      handle.removeEventListener("mousedown", onMouseDown);
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    },
  };
}
