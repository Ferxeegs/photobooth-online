export type AnalyticsEvent =
  | "start_click"
  | "camera_granted"
  | "camera_denied"
  | "layout_selected"
  | "capture_completed"
  | "frame_selected"
  | "filter_used"
  | "export_success"
  | "share_click"
  | "retake_count";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  const payload = { event, ...props, t: Date.now() };
  window.dispatchEvent(new CustomEvent("snapie:analytics", { detail: payload }));
  const plausible = (
    window as Window & {
      plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
    }
  ).plausible;
  plausible?.(event, props ? { props } : undefined);
}
