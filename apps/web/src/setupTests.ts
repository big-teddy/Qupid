import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 각 테스트 후 cleanup 수행
afterEach(() => {
    cleanup();
});
