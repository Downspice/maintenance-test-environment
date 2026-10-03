import CreateAllButton from "../../features/createAllButton";
import HeaderMeterButton from "../../features/reportsButton";
import HeaderUploadButton from "../../features/moreButton";
import HeaderProfileButton from "../../features/profileHeaderButton";
import HeaderSettingsButton from "../../features/setupButton";
import { Input } from "../../ui/input";
import OrganizationHeaderButton from "../../features/organizationHeaderButton";
import DBToolsButton from "../../features/dbToolsButton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-stroke-soft-200 bg-background/95 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="flex w-full items-center gap-2 px-4">
        <div className="flex shrink-0 items-center gap-2">
          <CreateAllButton />
          <HeaderSettingsButton />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
          <HeaderMeterButton />
          <Input
            className="min-w-0 max-w-xl flex-1"
            placeholder="Search equipment, work orders, inventory, and more…"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <HeaderUploadButton />
          <HeaderProfileButton />
          <OrganizationHeaderButton />
          <DBToolsButton />
        </div>
      </div>
    </header>
  );
}
