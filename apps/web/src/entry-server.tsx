import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./app/routes";

/**
 * Render the app to an HTML string for a given path.  Used by the
 * build-time prerender script.  Assumes SSR data has already been set via
 * `setSSRData` so components render with content.
 */
export function render(path: string): string {
  return renderToString(
    <StaticRouter location={path}>
      <AppRoutes />
    </StaticRouter>,
  );
}