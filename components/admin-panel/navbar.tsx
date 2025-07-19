import { Separator } from "../ui/separator";
import CreateAllButton from "../views/createAllButton";
import HeaderMeterButton from "../views/headerMeterButton";
import NotificationsDropdown from "../views/headerMeterButton";

import HeaderUploadButton from "../views/moreButton";
import HeaderProfileButton from "../views/profileHeaderButton";
import HeaderSettingsButton from "../views/setupButton";
import { Input } from "../ui/input";
import OrganizationHeaderButton from "../views/organizationHeaderButton";
import DBToolsButton from "../views/dbToolsButton";

interface NavbarProps {
  title: string;
}

export function Navbar() {
  return (
    <header className="sticky py-2 top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="flex w-full items-center gap-2 px-4">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <CreateAllButton />
        <HeaderSettingsButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <HeaderMeterButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <Input placeholder="Search Equipments, Work Orders, Inventory and More..." />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <HeaderUploadButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <HeaderProfileButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <OrganizationHeaderButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
         <DBToolsButton/>
      </div>
    </header>
  );
}
