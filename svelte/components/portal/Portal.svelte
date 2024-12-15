<div use:portal={target} hidden>
  {@render children()}
</div>

<script module lang="ts">
  import type { Action } from "svelte/action";
  import { tick } from "svelte";

  type CssSelector = "body" | `#${string}` | `.${string}`;

  export type PortalTarget = HTMLElement | CssSelector | undefined;

  export const portal: Action<HTMLElement, PortalTarget> = (
    element: HTMLElement,
    target: PortalTarget = "body"
  ) => {
    let portalTarget: HTMLElement | null;

    async function update(newTarget: PortalTarget) {
      target = newTarget;

      if (typeof target === "string") {
        portalTarget = document.querySelector(target);
        if (portalTarget) {
          // if target is not there yet, wait for svelte to rerender and hope it is
          await tick();
          portalTarget = document.querySelector(target);
        }
        if (!portalTarget) {
          throw new Error(`Not element found for selector: "${target}"`);
        }
      } else {
        portalTarget = target ?? null;
      }

      portalTarget?.appendChild(element);
      element.hidden = false;
    }

    function destroy() {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    update(target);

    return {
      update,
      destroy,
    };
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    target?: PortalTarget;
    children: Snippet;
  };

  const { target = "body", children }: Props = $props();
</script>
