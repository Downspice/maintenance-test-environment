import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobSiteDataTable from "./jobsiteTable";
import { jobSiteOptionsList } from "@/lib/option-list";

export default function JobSiteAssignment() {
  return (
    <>
      <Select>
        <SelectTrigger className="w-1/3">
          <SelectValue placeholder="Select a Jobsite" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {jobSiteOptionsList.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <JobSiteDataTable />
    </>
  );
}
