'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";

type HomeCardDataType = {
  name: string;
  description: string;
  value: string;
  overdue: string;
  soon: string;
};

export default function ReusableButtonCard({
  data,
  onClick,
  isActive=false
}: {
  data: HomeCardDataType,
  onClick:()=>void,
  isActive:boolean;
}) {
  return (
    <Card className={`w-full h-fit ${isActive ? "shadow-primary bg-#ffffff" : ""}`}
 onClick={onClick}>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        {/* <CardDescription>{data.description}</CardDescription> */}
      </CardHeader>
      <CardContent className="font-bold text-2xl">{data.value}
        
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        {data.overdue} Overdue <Separator orientation="vertical" />
        {data.soon} Soon
      </CardFooter>
    </Card>
  );
}
