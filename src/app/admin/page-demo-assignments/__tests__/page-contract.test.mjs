import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync(
  "src/app/admin/page-demo-assignments/page.tsx",
  "utf8",
);
const clientSource = readFileSync(
  "src/app/admin/page-demo-assignments/PageDemoAssignmentsClient.tsx",
  "utf8",
);

test("page demo assignments admin stays noindex and locally guarded", () => {
  assert.match(pageSource, /robots:\s*['"]noindex,\s*nofollow['"]/);
  assert.match(pageSource, /runtime\s*=\s*['"]nodejs['"]/);
  assert.match(pageSource, /isAdminRequestAllowed/);
  assert.match(pageSource, /notFound\(\)/);
  assert.match(pageSource, /loadPageDemoAssignments/);
});

test("page demo assignments admin explains publish feeds local preview before production release", () => {
  assert.match(clientSource, /统一本地发版配置/);
  assert.match(clientSource, /正式线上需提交仓库并随发版生效/);
  assert.match(clientSource, /去历史记录里面选素材/);
  assert.match(clientSource, /buildLocalPagePreviewHref/);
  assert.match(clientSource, /formatPageDemoPublicLocalUrl/);
});

test("page demo assignments admin labels all-language scope clearly", () => {
  assert.match(clientSource, /formatLocaleScope/);
  assert.match(clientSource, /全部语言/);
});

test("page demo assignments admin labels demo apply mode clearly", () => {
  assert.match(clientSource, /applyModeLabels/);
  assert.match(clientSource, /仅 Demo/);
  assert.match(clientSource, /Demo \+ 参数/);
  assert.match(clientSource, /formatAssignmentParameterMode/);
  assert.match(clientSource, /已回填参数/);
  assert.match(clientSource, /仅作为 Demo/);
  assert.match(clientSource, /formatPromptForApplyMode/);
  assert.match(clientSource, /未回填参数/);
});

test("page demo assignments admin lets active assignments be edited instead of only archived", () => {
  assert.match(pageSource, /getPageDemoTargets/);
  assert.match(clientSource, /editingId/);
  assert.match(clientSource, /update_draft/);
  assert.match(clientSource, /保存修改/);
  assert.match(clientSource, /取消编辑/);
  assert.match(clientSource, /pageDemoTargets/);
  assert.match(clientSource, /filteredPageDemoTargets/);
  assert.match(clientSource, /formatPageDemoTargetSearchText/);
  assert.match(
    clientSource,
    /function formatPageDemoTargetSearchText[^]*target\.url[^]*target\.slug[^]*formatPageDemoLocalUrl/,
  );
  assert.doesNotMatch(
    clientSource,
    /function formatPageDemoTargetSearchText[^]*target\.title/,
  );
  assert.doesNotMatch(
    clientSource,
    /function formatPageDemoTargetSearchText[^]*target\.keywords/,
  );
  assert.doesNotMatch(clientSource, /list="page-demo-assignment-targets"/);
  assert.doesNotMatch(clientSource, /<datalist/);
  assert.match(clientSource, /formatPageDemoLocalUrl/);
  assert.match(
    clientSource,
    /assignment\.status !== ['"]archived['"][^]*?startEditing\(assignment\)[^]*?编辑/,
  );
});

test("page demo assignments list does not surface optional asset names as row titles", () => {
  assert.doesNotMatch(
    clientSource,
    /assignment\.title\s*\|\|\s*assignment\.asset\.title/,
  );
  assert.match(clientSource, /formatDemoAssetKind/);
  assert.match(clientSource, /Demo 视频资源/);
  assert.match(clientSource, /Demo 图片资源/);
});

test("page demo assignments admin labels release-candidate action without implying direct deploy", () => {
  assert.doesNotMatch(clientSource, />\s*Publish\s*</);
  assert.doesNotMatch(clientSource, />\s*Published\s*</);
  assert.match(clientSource, /设为发版配置/);
  assert.match(clientSource, /发版配置/);
});

test("page demo assignments admin uses one unified release config", () => {
  assert.doesNotMatch(pageSource, /shouldUseOnlinePageDemoAssignments/);
  assert.doesNotMatch(pageSource, /Cloudflare D1: page_demo_assignments/);
  assert.doesNotMatch(clientSource, /mode\?: ["']local["'] \| ["']online["']/);
  assert.doesNotMatch(
    clientSource,
    /\/api\/admin\/page-demo-assignments\?source=online/,
  );
  assert.match(clientSource, /assignmentsApiUrl/);
  assert.match(clientSource, /buildLocalPagePreviewHref/);
});
