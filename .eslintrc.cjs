module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/dark:/]",
        message: "Use semantic tokens instead of Tailwind dark: utilities.",
      },
      {
        selector: "TemplateElement[value.raw=/dark:/]",
        message: "Use semantic tokens instead of Tailwind dark: utilities.",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@/components/header",
            message: "Use the shared @airnub/ui exports.",
          },
          {
            name: "@/components/footer",
            message: "Use the shared @airnub/ui exports.",
          },
        ],
        patterns: [
          {
            group: ["@/components/header/*", "@/components/footer/*"],
            message: "Use the shared @airnub/ui exports.",
          },
        ],
      },
    ],
  },
};
