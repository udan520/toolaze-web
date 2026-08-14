import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from "@/lib/admin/access";
import {
  DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  loadPageDemoAssignments,
} from "@/lib/admin/page-demo-assignments";
import { getPageDemoTargets } from "@/lib/admin/page-demo-targets";
import { PageDemoAssignmentsClient } from "./PageDemoAssignmentsClient";

export const metadata: Metadata = {
  title: "页面 Demo 配置 | Toolaze Admin",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminPageDemoAssignmentsPage() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

  if (
    !isAdminRequestAllowed({
      host,
      adminEmail: getAdminEmailFromHeaders(requestHeaders),
    })
  ) {
    notFound();
  }

  const storagePath =
    process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE ||
    DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH;
  const [data, pageDemoTargets] = await Promise.all([
    loadPageDemoAssignments(storagePath),
    getPageDemoTargets(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <AdminHeader />
      <section className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
        <PageDemoAssignmentsClient
          initialAssignments={data.assignments}
          storagePath={storagePath}
          pageDemoTargets={pageDemoTargets}
        />
      </section>
    </main>
  );
}

function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcff]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-indigo-600">
            <Link
              href="/admin/users"
              className="transition hover:text-indigo-800"
            >
              Google 用户管理
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/admin/media-library"
              className="transition hover:text-indigo-800"
            >
              素材库
            </Link>
            <span className="text-slate-300">/</span>
            <span>页面 Demo 配置</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            页面 Demo 配置
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            管理素材库 Output 到页面 Hero Demo、默认参考资源和 Prompt 示例的
            草稿 / 发版配置 配置。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/media-library"
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
          >
            素材库
          </Link>
          <Link
            href="/admin/page-demo-assignments"
            className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            刷新配置
          </Link>
        </div>
      </div>
    </header>
  );
}
