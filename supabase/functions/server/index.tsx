import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-8f9b6c2d/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── Debug endpoint ───────────────────────────────────────────────────────────
app.get("/make-server-8f9b6c2d/debug-notion-token", async (c) => {
  const t1 = Deno.env.get("NOTION_API_TOKEN");
  const t2 = Deno.env.get("NotionKey");
  const raw = t1 || t2;
  if (!raw) return c.json({ error: "No token found in either NOTION_API_TOKEN or NotionKey" });

  const token = raw.trim().replace(/^["']|["']$/g, "");
  const info = {
    source: t1 ? "NOTION_API_TOKEN" : "NotionKey",
    prefix: token.slice(0, 12),
    length: token.length,
    startsWithSecret: token.startsWith("secret_"),
  };

  // Live test against Notion
  const testRes = await fetch("https://api.notion.com/v1/users/me", {
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28" },
  });
  const testBody = await testRes.json();
  return c.json({ tokenInfo: info, notionResponse: { status: testRes.status, body: testBody } });
});

// ─── Notion proxy ─────────────────────────────────────────────────────────────
// Database: Product Team Project Documentation
const NOTION_DATABASE_ID = "2f10c3d2153880e98546c1a16fde4f3b";
const NOTION_VERSION = "2022-06-28";

function getTitle(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join("") ?? "";
}
function getRichText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}
function getSelect(prop: any): string {
  return prop?.select?.name ?? "";
}
function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((s: any) => s.name) ?? [];
}
function getPeople(prop: any): string[] {
  return prop?.people?.map((p: any) => p.name) ?? [];
}
function getUrl(prop: any): string {
  return prop?.url ?? "";
}
function getDate(prop: any): string {
  return prop?.date?.start ?? "";
}

app.get("/make-server-8f9b6c2d/notion/projects", async (c) => {
  const rawToken = Deno.env.get("NOTION_API_TOKEN") || Deno.env.get("NotionKey");
  if (!rawToken) {
    console.log("No Notion token found (checked NOTION_API_TOKEN and NotionKey)");
    return c.json({ error: "Notion API token not configured" }, 500);
  }
  const notionToken = rawToken.trim().replace(/^["']|["']$/g, "");
  console.log(`Notion token prefix: ${notionToken.slice(0, 10)}... length: ${notionToken.length} startsWithSecret: ${notionToken.startsWith("secret_")}`);

  try {
    const projects: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const body: Record<string, any> = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const res = await fetch(
        `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${notionToken}`,
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.log(`Notion API error ${res.status}: ${errText}`);
        return c.json({ error: `Notion API error: ${res.status} ${errText}` }, 500);
      }

      const data = await res.json();

      for (const page of data.results) {
        const props = page.properties;

        const status = getSelect(props["Project Status"]);
        if (!status) continue; // skip template/blank rows

        const docName = getTitle(props["Doc Name"]);
        if (!docName) continue;

        // Development Team may be People or multi-select depending on workspace config
        const devTeam =
          getPeople(props["Development Team"]).length > 0
            ? getPeople(props["Development Team"])
            : getMultiSelect(props["Development Team"]);

        const urgency = getSelect(props["Urgency Rating"]) || undefined;
        const link = getUrl(props["Link"]) || undefined;
        const quickNote = getRichText(props["Quick note"]) || undefined;
        const startDate = getDate(props["Start Date"]) || undefined;
        const endDate = getDate(props["End Date"]) || undefined;

        projects.push({
          id: page.id,
          url: page.url,
          docName,
          benefits: getRichText(props["Benefits"]),
          projectStatus: status,
          productArea: getMultiSelect(props["Product Area"]),
          productInvolvement: getMultiSelect(props["Product Involvement"]),
          developmentTeam: devTeam,
          urgencyRating: urgency,
          link,
          quickNote,
          startDate,
          endDate,
        });
      }

      hasMore = data.has_more;
      startCursor = data.next_cursor ?? undefined;
    }

    return c.json({ projects });
  } catch (err) {
    console.log(`Failed to fetch Notion projects: ${err}`);
    return c.json({ error: `Failed to fetch Notion projects: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);