import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useSettings } from "@shopify/ui-extensions/checkout/preact";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const settings = useSettings() || {};
  const messageTemplate =
    settings.message_template ||
    "Please review our {Cancellation} before placing your order.";
  const linkColorConfig = normalizeLinkColor(settings.link_color);
  const messageAlignment = normalizeAlignment(settings.message_alignment);
  const messageSize = normalizeFontSize(settings.message_size);

  const alignItems = alignmentToStackAlign(messageAlignment);

  return (
    <s-stack gap="base" alignItems={alignItems}>
      <s-text type="strong">Cancellation Policy</s-text>
      {renderMessage(messageTemplate, linkColorConfig, messageSize)}

      <s-modal id="cancellation-modal" heading="Cancellation Policy">
        <s-paragraph>TEST</s-paragraph>
        <s-button
          slot="primary-action"
          command="--hide"
          commandFor="cancellation-modal"
        >
          Close
        </s-button>
      </s-modal>
    </s-stack>
  );
}

function renderMessageTemplate(template, linkColorConfig) {
  const parts = [];
  const tokenRegex = /\{([a-zA-Z0-9_-]+)\}/g;
  let cursor = 0, match, i = 0;

  while ((match = tokenRegex.exec(template)) !== null) {
    const [fullToken, tokenName] = match;
    if (match.index > cursor) parts.push(template.slice(cursor, match.index));

    if (tokenName.toLowerCase() === "cancellation") {
      parts.push(
        <s-link
          key={`tok-${i++}`}
          command="--show"
          commandFor="cancellation-modal"
          tone={linkColorConfig.linkTone}
        >
          Cancellation
        </s-link>
      );
    } else {
      parts.push(fullToken);
    }
    cursor = tokenRegex.lastIndex;
  }
  if (cursor < template.length) parts.push(template.slice(cursor));
  return parts;
}

function renderMessage(template, linkColorConfig, sizeValue) {
  const content = renderMessageTemplate(template, linkColorConfig);
  // s-paragraph is block-level and safely holds inline s-text/s-link
  return <s-paragraph>{content}</s-paragraph>;
}

function normalizeAlignment(value) {
  const normalized = String(value || "left")
    .trim()
    .toLowerCase();
  return ["left", "center", "right"].includes(normalized) ? normalized : "left";
}

function normalizeFontSize(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "small") return "small";
  if (normalized === "large") return "large";
  if (normalized === "medium" || normalized === "base" || !normalized) {
    return "base";
  }

  return "base";
}

function normalizeLinkColor(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  const linkTone = normalized === "neutral" ? "neutral" : "auto";

  const allowedTextTones = [
    "auto",
    "neutral",
    "info",
    "success",
    "warning",
    "critical",
  ];
  const textTone = allowedTextTones.includes(normalized) ? normalized : "auto";

  return { linkTone, textTone };
}

function alignmentToStackAlign(alignment) {
  if (alignment === "center") return "center";
  if (alignment === "right") return "end";
  return "start";
}
