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
  },
};
