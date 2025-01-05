/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";

export const runtime = "edge";

const themes = {
  light: {
    background: "#ffffff",
    headerLine: "#2563eb",
    text: "#0f172a",
    subtext: "#64748b",
    border: "#e2e8f0",
    subtle: "#f8fafc",
  },
  dark: {
    background: "#0f172a",
    headerLine: "#2563eb",
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
    const theme = (searchParams.get("theme") ?? "light") as keyof typeof themes;

    const colors = themes[theme];

    // Get the origin from the request URL
    const origin = new URL(request.url).origin;

    // Load fonts and profile image
    const [interRegular, interBold, profileImage] = await Promise.all([
      fetch(
        new URL(
          "https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff",
          "https://fonts.cdnfonts.com"
        )
      ).then((res) => res.arrayBuffer()),
      fetch(
        new URL(
          "https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff",
          "https://fonts.cdnfonts.com"
        )
      ).then((res) => res.arrayBuffer()),
      fetch(`${origin}/profile.jpeg`).then((res) => res.arrayBuffer()),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: colors.background,
            padding: "0",
          }}
        >
          {/* Top blue line */}
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: colors.headerLine,
            }}
          />

          {/* Main content wrapper */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 64px",
            }}
          >
            {/* Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                maxWidth: "90%",
              }}
            >
              <h1
                style={{
                  fontSize: "52px",
                  fontFamily: "inter",
                  color: colors.text,
                  lineHeight: 1.3,
                  margin: 0,
                  padding: 0,
                  fontWeight: 700,
                }}
              >
                {title}
              </h1>
            </div>

            {/* Bottom section with profile and logo */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "40px",
                paddingTop: "32px",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              {/* Profile section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${Buffer.from(profileImage).toString("base64")}`}
                  width={56}
                  height={56}
                  alt="Profile"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: `2px solid ${colors.border}`,
                    objectFit: "cover",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "20px",
                      fontFamily: "inter",
                      color: colors.text,
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    Hafizh Pratama
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontFamily: "inter",
                      color: colors.subtext,
                      fontWeight: 400,
                    }}
                  >
                    Software Engineer
                  </span>
                </div>
              </div>
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
            data: interRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "inter",
            data: interBold,
            weight: 700,
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
