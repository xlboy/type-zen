import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/__test__/**/*.ts"],
    exclude: [".history/**/*"]
  },
});
