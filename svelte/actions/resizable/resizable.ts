export type ElementSize = {
  width: number;
  height: number;
};

type ResizableParams = {
  onSizeChange?: (size: ElementSize) => void;
};

type ResizeDirection =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

const RESIZE_ZONE_SIZE_PX = 20;

export function resizable(node: HTMLElement, params: ResizableParams = {}) {
  let resizingDirection: ResizeDirection | null = null;
  let isResizing = false;

  function onMouseMove(evt: Event) {
    const event = evt as MouseEvent;

    const nodeWidth = node.getBoundingClientRect().width;
    const nodeHeight = node.getBoundingClientRect().height;
    const mouseX = event.x - node.getBoundingClientRect().x;
    const mouseY = event.y - node.getBoundingClientRect().y;

    const mouseOverTopZone = mouseY <= RESIZE_ZONE_SIZE_PX;
    const mouseOverBottomZone = mouseY >= nodeHeight - RESIZE_ZONE_SIZE_PX;
    const mouseOverLeftZone = mouseX <= RESIZE_ZONE_SIZE_PX;
    const mouseOverRightZone = mouseX >= nodeWidth - RESIZE_ZONE_SIZE_PX;

    if (mouseOverTopZone) {
      if (mouseOverLeftZone) {
        resizingDirection = "top-left";
        node.style.cursor = "nwse-resize";
      } else if (mouseOverRightZone) {
        resizingDirection = "top-right";
        node.style.cursor = "nesw-resize";
      } else {
        resizingDirection = "top";
        node.style.cursor = "ns-resize";
      }
    } else if (mouseOverBottomZone) {
      if (mouseOverLeftZone) {
        resizingDirection = "bottom-left";
        node.style.cursor = "nesw-resize";
      } else if (mouseOverRightZone) {
        resizingDirection = "bottom-right";
        node.style.cursor = "nwse-resize";
      } else {
        resizingDirection = "bottom";
        node.style.cursor = "ns-resize";
      }
    } else {
      if (mouseOverLeftZone) {
        resizingDirection = "left";
        node.style.cursor = "ew-resize";
      } else if (mouseOverRightZone) {
        resizingDirection = "right";
        node.style.cursor = "ew-resize";
      } else {
        resizingDirection = null;
        node.style.cursor = "";
      }
    }
  }

  function onMouseDown() {
    if (resizingDirection) {
      node.dataset.isResizing = "true";
      isResizing = true;

      node.style.userSelect = "none";

      document.body.addEventListener("mousemove", onResizing);
      document.body.addEventListener("mouseup", onMouseUp);
    }
  }

  function onResizing(evt: Event) {
    const event = evt as MouseEvent;

    if (isResizing && resizingDirection) {
      const movedX = event.movementX;
      const movedY = event.movementY;
      const nodeRect = node.getBoundingClientRect();
      const computedStyle = getComputedStyle(node);
      const isAutoMarginHorizontal =
        computedStyle.marginLeft != "0px" && computedStyle.marginRight != "0px";

      switch (resizingDirection) {
        case "top":
          node.style.height = `${nodeRect.height - movedY}px`;
          node.style.top = `${nodeRect.top + movedY}px`;
          break;

        case "top-right":
          node.style.height = `${nodeRect.height - movedY}px`;
          node.style.top = `${nodeRect.top + movedY}px`;
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width + movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width + movedX}px`;
          }
          break;

        case "right":
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width + movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width + movedX}px`;
          }
          break;

        case "bottom-right":
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width + movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width + movedX}px`;
          }
          node.style.height = `${nodeRect.height + movedY}px`;
          break;

        case "bottom":
          node.style.height = `${nodeRect.height + movedY}px`;
          break;

        case "bottom-left":
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width - movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width - movedX}px`;
            node.style.left = `${nodeRect.left + movedX}px`;
          }
          node.style.height = `${nodeRect.height + movedY}px`;
          break;

        case "left":
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width - movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width - movedX}px`;
            node.style.left = `${nodeRect.left + movedX}px`;
          }
          break;

        case "top-left":
          node.style.height = `${nodeRect.height - movedY}px`;
          node.style.top = `${nodeRect.top + movedY}px`;
          if (isAutoMarginHorizontal) {
            node.style.width = `${nodeRect.width - movedX * 2}px`;
          } else {
            node.style.width = `${nodeRect.width - movedX}px`;
            node.style.left = `${nodeRect.left + movedX}px`;
          }
          break;
      }
    }
  }

  function onMouseUp() {
    if (isResizing) {
      node.dataset.isResizing = undefined;
      delete node.dataset.isResizing;
      isResizing = false;
      resizingDirection = null;
      node.style.userSelect = "";
      document.body.removeEventListener("mousemove", onResizing);
      document.body.removeEventListener("mouseup", onMouseUp);
      params.onSizeChange?.({
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
      });
    }
  }

  node.addEventListener("mousemove", onMouseMove);
  node.addEventListener("mousedown", onMouseDown);

  return {
    update() {
      //
    },
    destroy() {
      node.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("mousedown", onMouseDown);
      document.body.removeEventListener("mousemove", onResizing);
      document.body.removeEventListener("mouseup", onMouseUp);
    },
  };
}
