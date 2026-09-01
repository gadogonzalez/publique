"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setBusinessStatus } from "@/app/admin/(dashboard)/negocios/actions";
import type { BusinessStatus } from "@/lib/types/database";

const NEXT_ACTIONS: Partial<Record<BusinessStatus, { label: string; status: BusinessStatus }[]>> = {
  draft: [{ label: "Activar", status: "active" }],
  active: [{ label: "Suspender", status: "suspended" }],
  suspended: [{ label: "Reactivar", status: "active" }],
  past_due: [{ label: "Reactivar", status: "active" }, { label: "Suspender", status: "suspended" }],
  archived: [{ label: "Restaurar", status: "draft" }],
};

export function StatusActions({
  businessId,
  status,
}: {
  businessId: string;
  status: BusinessStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const actions = NEXT_ACTIONS[status] ?? [];

  function apply(next: BusinessStatus) {
    startTransition(async () => {
      await setBusinessStatus(businessId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-2">
      {actions.map((a) => (
        <Button
          key={a.status}
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => apply(a.status)}
        >
          {a.label}
        </Button>
      ))}
      {status !== "archived" && (
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => apply("archived")}
        >
          Archivar
        </Button>
      )}
    </div>
  );
}
