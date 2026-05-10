// Vitest 全局 setup · 引入 jest-dom 的扩展匹配器（toBeInTheDocument 等）。
// 本项目选择了 `globals: true` + tsconfig 里登记 vitest/globals & @testing-library/jest-dom
// 的 types，因此测试文件不需要显式 import describe/it/expect。
import '@testing-library/jest-dom';
