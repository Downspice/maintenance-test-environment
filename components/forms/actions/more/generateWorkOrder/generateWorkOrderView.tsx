import GenerateOptionTab from "./generateOptions";
import MeterUpdatesMoreButton from "./updateMeter";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GenerateWorkOrderMoreButtonView() {
  return (
    <Tabs defaultValue="GenerateOptionTab">
      <TabsList>
        <TabsTrigger value="GenerateOptionTab"> Generate Option </TabsTrigger>
        <TabsTrigger value="MeterUpdates">Meter Updates</TabsTrigger>
      </TabsList>
      <TabsContent value="MeterUpdates" className=" ">
        <MeterUpdatesMoreButton />
      </TabsContent>
      <TabsContent value="GenerateOptionTab" className="">
        <GenerateOptionTab />
      </TabsContent>
    </Tabs>
  );
}
