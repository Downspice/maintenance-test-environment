import GenerateOptionTab from "./generateOptions";
import MeterUpdatesMoreButton from "./updateMeter";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GenerateWorkOrderMoreButtonView() {
  return (
    <Tabs defaultValue="GenerateOptionTab">
      <TabsList>
        <TabsTrigger value="GenerateOptionTab"> GenerateOption </TabsTrigger>
        <TabsTrigger value="MeterUpdates">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent  value="MeterUpdates"  className=" ">
        <MeterUpdatesMoreButton />
      </TabsContent>
      <TabsContent value="GenerateOptionTab" className="">
        <GenerateOptionTab />
      </TabsContent>
    </Tabs>
  );
}
