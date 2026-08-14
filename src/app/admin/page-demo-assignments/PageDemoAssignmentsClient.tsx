"use client";

import { Fragment, useMemo, useState } from "react";
import type { PageDemoAssignment } from "@/lib/admin/page-demo-assignments";
import {
  formatPageDemoLocalUrl,
  formatPageDemoPublicLocalUrl,
  formatPageDemoSlugAsUrl,
  normalizePageDemoUrlToSlug,
  type PageDemoTarget,
} from "@/lib/admin/page-demo-url";

type PageDemoAssignmentsClientProps = {
  initialAssignments: PageDemoAssignment[];
  storagePath: string;
  pageDemoTargets: PageDemoTarget[];
};

type ApiPayload = {
  assignment?: PageDemoAssignment;
  assignments?: PageDemoAssignment[];
  previewUrl?: string;
  error?: string;
};

type EditDraftForm = {
  pageSlug: string;
  locale: string;
  placement: PageDemoAssignment["placement"];
  applyMode: PageDemoAssignment["applyMode"];
  title: string;
};

const statusLabels: Record<PageDemoAssignment["status"], string> = {
  draft: "草稿",
  published: "发版配置",
  archived: "已归档",
};

const placementLabels: Record<PageDemoAssignment["placement"], string> = {
  hero_demo: "Hero Demo",
  default_reference: "默认参考资源",
  prompt_example: "Prompt 示例",
};

const applyModeLabels: Record<PageDemoAssignment["applyMode"], string> = {
  demo_only: "仅 Demo",
  demo_with_parameters: "Demo + 参数",
};

export function PageDemoAssignmentsClient({
  initialAssignments,
  storagePath,
  pageDemoTargets,
}: PageDemoAssignmentsClientProps) {
  const assignmentsApiUrl = "/api/admin/page-demo-assignments";
  const mediaLibraryHref = "/admin/media-library";
  const [assignments, setAssignments] = useState(initialAssignments);
  const [busyId, setBusyId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editDraft, setEditDraft] = useState<EditDraftForm>({
    pageSlug: "",
    locale: "all",
    placement: "hero_demo",
    applyMode: "demo_only",
    title: "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const pageUrlQuery = editDraft.pageSlug.trim();
  const filteredPageDemoTargets = useMemo(() => {
    const query = editDraft.pageSlug.trim();
    if (!query) return pageDemoTargets.slice(0, 10);

    const searchTerms = Array.from(
      new Set(
        [
          query.toLowerCase(),
          normalizePageDemoUrlToSlug(query).toLowerCase(),
        ].filter(Boolean),
      ),
    );

    return pageDemoTargets
      .filter((target) => {
        const searchText = formatPageDemoTargetSearchText(target);
        return searchTerms.some((term) => searchText.includes(term));
      })
      .slice(0, 20);
  }, [editDraft.pageSlug, pageDemoTargets]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              页面 Demo 配置
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              当前 {assignments.length.toLocaleString("zh-CN")} 条配置 ·{" "}
              {storagePath}
            </p>
          </div>
          <a
            href={mediaLibraryHref}
            className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            去历史记录里面选素材
          </a>
        </div>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          Demo
          配置默认用于该页面全部语言。当前为统一本地发版配置，正式线上需提交仓库并随发版生效。
        </p>
        {notice ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
              <th className="px-5 py-3">页面 / 位置</th>
              <th className="px-4 py-3">素材</th>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-5 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <Fragment key={assignment.id}>
                  <tr className="text-sm text-slate-700 transition hover:bg-indigo-50/30">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        /{assignment.pageSlug}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatLocaleScope(assignment.locale)} ·{" "}
                        {placementLabels[assignment.placement]} · v
                        {assignment.version}
                      </p>
                      <div className="mt-2">
                        <ParameterModePill applyMode={assignment.applyMode} />
                      </div>
                      <p className="mt-1 truncate font-mono text-[11px] text-slate-400">
                        {assignment.id}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          {assignment.asset.type === "video" ? (
                            <video
                              src={assignment.asset.url}
                              poster={assignment.asset.posterUrl}
                              muted
                              preload="metadata"
                              className="h-full w-full bg-slate-950 object-contain"
                            />
                          ) : (
                            <img
                              src={assignment.asset.url}
                              alt="Demo 素材预览"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-72 truncate font-semibold text-slate-950">
                            {formatDemoAssetKind(assignment.asset.type)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatAssignmentParameterMode(assignment)} · Input{" "}
                            {assignment.inputAssets.length.toLocaleString(
                              "zh-CN",
                            )}{" "}
                            个 · {assignment.model || "未指定模型"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="line-clamp-3 max-w-md text-xs leading-5 text-slate-600">
                        {formatPromptForApplyMode(assignment)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={assignment.status} />
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(assignment.updatedAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={buildLocalPagePreviewHref(assignment.pageSlug)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                        >
                          预览本地页
                        </a>
                        {assignment.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={busyId === assignment.id}
                            onClick={() => startEditing(assignment)}
                            className="inline-flex h-9 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            编辑
                          </button>
                        ) : null}
                        {assignment.status === "draft" ? (
                          <button
                            type="button"
                            disabled={busyId === assignment.id}
                            onClick={() =>
                              void mutateAssignment("publish", assignment.id)
                            }
                            className="inline-flex h-9 items-center rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            设为发版配置
                          </button>
                        ) : null}
                        {assignment.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={busyId === assignment.id}
                            onClick={() =>
                              void mutateAssignment("archive", assignment.id)
                            }
                            className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            归档
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {editingId === assignment.id ? (
                    <tr className="bg-indigo-50/40">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="grid gap-3 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm lg:grid-cols-[minmax(320px,1.5fr)_110px_160px_160px_minmax(180px,0.8fr)_auto] lg:items-start">
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={`page-demo-url-${assignment.id}`}
                              className="text-[11px] font-semibold text-slate-500"
                            >
                              页面 URL
                            </label>
                            <input
                              id={`page-demo-url-${assignment.id}`}
                              value={editDraft.pageSlug}
                              onChange={(event) =>
                                updateEditDraft({
                                  pageSlug: event.target.value,
                                })
                              }
                              placeholder="搜索或输入页面 URL"
                              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                            />
                            {pageUrlQuery ? (
                              <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                                {filteredPageDemoTargets.length > 0 ? (
                                  filteredPageDemoTargets.map((target) => (
                                    <button
                                      key={target.url}
                                      type="button"
                                      onClick={() =>
                                        updateEditDraft({
                                          pageSlug: target.url,
                                        })
                                      }
                                      className="grid w-full gap-0.5 border-b border-slate-100 px-3 py-2 text-left text-xs transition last:border-b-0 hover:bg-indigo-50"
                                    >
                                      <span className="truncate font-semibold text-slate-800">
                                        {target.url}
                                      </span>
                                      <span className="truncate text-[11px] text-slate-500">
                                        {target.title} ·{" "}
                                        {formatPageDemoLocalUrl(target.url)}
                                      </span>
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-3 py-2 text-xs text-slate-500">
                                    没有匹配 URL，可直接保存当前输入。
                                  </p>
                                )}
                              </div>
                            ) : null}
                          </div>
                          <label className="grid gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              语言
                            </span>
                            <select
                              value={editDraft.locale}
                              onChange={(event) =>
                                updateEditDraft({ locale: event.target.value })
                              }
                              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400"
                            >
                              <option value="all">全部语言</option>
                              <option value="en">en</option>
                              <option value="zh-TW">zh-TW</option>
                              <option value="ja">ja</option>
                              <option value="pt">pt</option>
                              <option value="it">it</option>
                            </select>
                          </label>
                          <label className="grid gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              位置
                            </span>
                            <select
                              value={editDraft.placement}
                              onChange={(event) =>
                                updateEditDraft({
                                  placement: event.target
                                    .value as PageDemoAssignment["placement"],
                                })
                              }
                              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400"
                            >
                              <option value="hero_demo">Hero Demo</option>
                              <option value="default_reference">
                                默认参考资源
                              </option>
                              <option value="prompt_example">
                                Prompt 示例
                              </option>
                            </select>
                          </label>
                          <label className="grid gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              应用方式
                            </span>
                            <select
                              value={editDraft.applyMode}
                              onChange={(event) =>
                                updateEditDraft({
                                  applyMode: event.target
                                    .value as PageDemoAssignment["applyMode"],
                                })
                              }
                              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400"
                            >
                              <option value="demo_only">仅 Demo</option>
                              <option value="demo_with_parameters">
                                Demo + 参数
                              </option>
                            </select>
                          </label>
                          <label className="grid gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              名称（可选）
                            </span>
                            <input
                              value={editDraft.title}
                              onChange={(event) =>
                                updateEditDraft({ title: event.target.value })
                              }
                              placeholder="可选，不在列表展示"
                              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                            />
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={busyId === assignment.id}
                              onClick={() =>
                                void saveEditedDraft(assignment.id)
                              }
                              className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              保存修改
                            </button>
                            <button
                              type="button"
                              disabled={busyId === assignment.id}
                              onClick={() => setEditingId("")}
                              className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              取消编辑
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-14 text-center text-sm text-slate-500"
                >
                  还没有页面 Demo 配置。先去历史记录里面选素材并保存 Draft。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  function startEditing(assignment: PageDemoAssignment) {
    setEditingId(assignment.id);
    setNotice("");
    setError("");
    setEditDraft({
      pageSlug: formatPageDemoSlugAsUrl(assignment.pageSlug),
      locale: assignment.locale,
      placement: assignment.placement,
      applyMode: assignment.applyMode,
      title: assignment.title || "",
    });
  }

  function updateEditDraft(patch: Partial<EditDraftForm>) {
    setEditDraft((current) => ({ ...current, ...patch }));
  }

  async function saveEditedDraft(assignmentId: string) {
    const pageSlug = normalizePageDemoUrlToSlug(editDraft.pageSlug);
    if (!pageSlug) {
      setError("请先选择或输入页面 URL。");
      return;
    }

    setBusyId(assignmentId);
    setNotice("");
    setError("");
    try {
      const payload = await requestJson(assignmentsApiUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "update_draft",
          assignmentId,
          pageSlug,
          locale: editDraft.locale,
          placement: editDraft.placement,
          applyMode: editDraft.applyMode,
          title: editDraft.title,
        }),
      });
      if (payload.assignments) setAssignments(payload.assignments);
      setEditingId("");
      setNotice("配置已更新，可以打开本地页预览实际效果。");
    } catch (requestError) {
      setError(readErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  }

  async function mutateAssignment(
    action: "publish" | "archive",
    assignmentId: string,
  ) {
    setBusyId(assignmentId);
    setNotice("");
    setError("");
    try {
      const payload = await requestJson(assignmentsApiUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, assignmentId }),
      });
      if (payload.assignments) setAssignments(payload.assignments);
      setNotice(
        action === "publish"
          ? "配置已设为发版配置；本地公开页现在会读取它，正式线上需提交代码并随发版生效。"
          : "配置已归档。",
      );
    } catch (requestError) {
      setError(readErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  }
}

function StatusPill({ status }: { status: PageDemoAssignment["status"] }) {
  const className =
    status === "published"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "archived"
        ? "bg-slate-100 text-slate-600 ring-slate-200"
        : "bg-indigo-50 text-indigo-700 ring-indigo-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function ParameterModePill({
  applyMode,
}: {
  applyMode: PageDemoAssignment["applyMode"];
}) {
  const className =
    applyMode === "demo_with_parameters"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}
    >
      {formatAssignmentParameterMode({ applyMode })}
    </span>
  );
}

async function requestJson(
  url: string,
  init?: RequestInit,
): Promise<ApiPayload> {
  const response = await fetch(url, { credentials: "include", ...init });
  const payload = (await response.json().catch(() => ({}))) as ApiPayload;
  if (!response.ok)
    throw new Error(payload.error || `请求失败：${response.status}`);
  return payload;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function formatLocaleScope(locale: string): string {
  return locale === "all" ? "全部语言" : locale;
}

function formatPromptForApplyMode(assignment: PageDemoAssignment): string {
  if (assignment.applyMode === "demo_only") return "未回填参数";
  return assignment.prompt || "—";
}

function formatAssignmentParameterMode(
  assignment: Pick<PageDemoAssignment, "applyMode">,
): string {
  return assignment.applyMode === "demo_with_parameters"
    ? "已回填参数"
    : "仅作为 Demo";
}

function formatDemoAssetKind(
  assetType: PageDemoAssignment["asset"]["type"],
): string {
  return assetType === "video" ? "Demo 视频资源" : "Demo 图片资源";
}

function formatPageDemoTargetSearchText(target: PageDemoTarget): string {
  return [target.url, target.slug, formatPageDemoLocalUrl(target.url)]
    .join(" ")
    .toLowerCase();
}

function buildLocalPagePreviewHref(pageSlug: string): string {
  return formatPageDemoPublicLocalUrl(formatPageDemoSlugAsUrl(pageSlug)) || "#";
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "操作失败。";
}
