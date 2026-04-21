import * as React from "react";

interface IRenderErrorProps {
  error: Error | undefined;
}

const RenderError: React.FC<IRenderErrorProps> = ({ error }) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      padding: "14px 16px",
      background: "#FFF5F5",
      border: "1px solid #FDDEDE",
      borderLeft: "4px solid #BC2F32",
      borderRadius: "0 10px 10px 0",
      margin: "12px 0",
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#FDE7E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      ⚠️
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#BC2F32",
          marginBottom: 3,
        }}
      >
        Failed to load activities
      </div>
      {error?.message && (
        <div
          style={{
            fontSize: 11,
            color: "#8A4040",
            lineHeight: "1.45",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {error.message}
        </div>
      )}
    </div>
  </div>
);

export default RenderError;
