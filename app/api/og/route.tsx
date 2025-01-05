import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";

export const runtime = "edge";

// Theme configuration
const themes = {
  light: {
    background: "#ffffff",
    pattern: "#e2e8f0",
    text: "#0f172a",
    subtext: "#64748b",
    border: "#e2e8f0",
  },
  dark: {
    background: "#0f172a",
    pattern: "#334155",
    text: "#ffffff",
    subtext: "#94a3b8",
    border: "#334155",
  },
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = decodeURIComponent(
      searchParams.get("title") ?? "Hafizh Pratama"
    );
    const description = decodeURIComponent(
      searchParams.get("description") ?? "Hafizh Pratama"
    );
    const theme = (searchParams.get("theme") ?? "light") as keyof typeof themes;

    const colors = themes[theme];

    const interFont = await fetch(
      new URL(
        "https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff",
        "https://fonts.cdnfonts.com"
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: colors.background,
            padding: "48px",
          }}
        >
          {/* Main content wrapper */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "inter",
                color: colors.text,
                lineHeight: 1.2,
                margin: "0 0 24px 0",
                maxWidth: "700px",
                display: "flex",
                fontWeight: 400,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                fontFamily: "inter",
                color: colors.subtext,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: "600px",
                display: "flex",
                fontWeight: 400,
              }}
            >
              {description}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingTop: "20px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                fontFamily: "inter",
                color: colors.subtext,
                fontWeight: 400,
              }}
            >
              hafizh.pages.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "inter",
            data: interFont,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
