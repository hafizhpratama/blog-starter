/* eslint-disable @next/next/no-img-element */
// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";

export const runtime = "edge";

// Load and convert the logo image
const logoImage = fetch(
  new URL("../../../public/logo.png", import.meta.url)
).then(async (res) => {
  if (!res.ok) {
    throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
  }
  return res.arrayBuffer();
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params with proper decoding
    const title = decodeURIComponent(
      searchParams.get("title") ?? "Hafizh Pratama"
    );
    const description = decodeURIComponent(
      searchParams.get("description") ?? "Software Engineer"
    );
    const theme = searchParams.get("theme") ?? "light";

    // Wait for the logo to be loaded
    const logo = await logoImage;

    // Convert ArrayBuffer to base64
    const base64Logo = Buffer.from(logo).toString("base64");
    const logoUrl = `data:image/png;base64,${base64Logo}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
            padding: "48px",
          }}
        >
          {/* Header with logo */}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                height: "64px",
                width: "100px",
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "800px",
              marginTop: "-80px",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "Georgia, serif",
                color: theme === "dark" ? "#ffffff" : "#000000",
                lineHeight: 1.2,
                margin: "0 0 16px 0",
                fontStyle: "italic",
                maxWidth: "700px",
                display: "flex",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                fontFamily: "system-ui, sans-serif",
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                lineHeight: 1.5,
                margin: 0,
                maxWidth: "600px",
                display: "flex",
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
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                fontFamily: "system-ui, sans-serif",
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
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
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
