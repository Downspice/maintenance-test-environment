// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbSeparator,
//   BreadcrumbPage,
// } from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Input } from "../ui/input";
import CreateAllButton from "./createAllButton";
import HeaderSettingsButton from "./setupButton";
import NotificationsDropdown from "./headerNotificationsButton";
import HeaderMeterButton from "./reportsButton";
import HeaderProfileButton from "./profileHeaderButton";
import HeaderUploadButton from "./moreButton";
import { Separator } from "../ui/separator";

export default function AppHeader() {
  return (
    <header className="flex w-full  h-16 sticky shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <CreateAllButton />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <HeaderMeterButton />
        <Input placeholder="" />
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
        />{" "}
        <NotificationsDropdown />
        <Separator
          orientation="vertical"
          className="  data-[orientation=vertical]:h-4"
        />
        <HeaderSettingsButton />
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
    </header>
  );
}
