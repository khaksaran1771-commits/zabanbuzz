"use client";

import { Button, ListBox, Select } from "@heroui/react";
import type { Role } from "@/generated/prisma/client";
import { ROLE_LABELS, ROLES } from "@/lib/auth/roles";
import { setUserRole } from "./actions";

export function RoleForm({ userId, name, role }: { userId: string; name: string; role: Role }) {
  return (
    <form action={setUserRole} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <Select name="role" defaultValue={role} aria-label={`نقش ${name}`} className="w-36">
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {ROLES.map((item) => (
              <ListBox.Item key={item} id={item} textValue={ROLE_LABELS[item]}>
                {ROLE_LABELS[item]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Button type="submit" variant="outline" size="sm">
        ذخیره
      </Button>
    </form>
  );
}
