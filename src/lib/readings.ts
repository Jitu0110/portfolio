export interface ReadingItem {
  title: string;
  url: string;
  source: string;
  type: "Paper" | "Blog";
  date: string; // when it was added/read
  note?: string;
}

/**
 * Papers and blog posts I'm reading.
 * APPEND new items to the END of this array — the page renders them
 * in order of addition (oldest first).
 */
export const readings: ReadingItem[] = [
  {
    title: "A Practical Guide to Building Agents",
    url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
    source: "OpenAI",
    type: "Paper",
    date: "Jun 12, 2026",
  },
  {
    title: "Building Serverless MCP Servers",
    url: "https://ranthebuilder.cloud/blog/building-serverless-mcp-server",
    source: "Ran The Builder",
    type: "Blog",
    date: "Jun 12, 2026",
  },
];
