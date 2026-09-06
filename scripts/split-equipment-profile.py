#!/usr/bin/env python3
"""Split equipment-profile.tsx into focused modules."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "components/features/equipment/equipment-profile.tsx"
OUT = ROOT / "components/features/equipment"

SHARED_IMPORTS = '''"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  FilePenIcon,
  MinusSquare,
  Pen,
  PlusSquare,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UpdateEquipmentRenewalForm, {
  NewEquipmentRenewalForm,
} from "./equipment-renewal";
import NewRepairRequestForm from "@/components/forms/actions/more/repairRequest/repairRequestForm";
import ActualRepairRequestForm, {
  EditActualUpdateRepairRequestForm,
} from "@/components/forms/entities/repairRequest";
import NewWorkOrderForm, {
  ActualWorkOrderForm,
  EditActualWorkOrderForm,
} from "@/components/forms/entities/work-order-form";
import EditWorkOrderForm from "@/app/(application)/work-orders/views/edit-work-order";
import FluidConsumedForm, {
  EditFluidConsumption,
} from "@/components/forms/entities/equipment/FluidConsumed";
import NewAccident, {
  EditAccidents,
} from "@/components/forms/entities/new-accident";
import FuelTransactionForm, {
  UpdateFuelTransactionForm,
} from "@/components/forms/entities/equipment/FuelTransactionForm";
import AssignEquipmentForm, {
  EditAssignEquipmentForm,
} from "@/components/forms/entities/equipment/AssignEquipment";
import GeneralExpense, {
  EditGeneralExpense,
} from "@/components/forms/entities/new-general-expense";
import InspectionForm, {
  EditInspectionForm,
} from "@/components/forms/entities/new-inspection";
import EquipmentPMServiceForm, {
  UpdateEquipmentPMServiceForm,
} from "@/components/forms/entities/equipment/equipmentPMServiceform";
import { MeterReplacementTab } from "./meter-replacement-tab";
import {
  useGetEquipmentPMs,
  useGetEquipmentRepairs,
  useGetEquipmentRenewalsByEquipmentId,
  useGetEquipmentCommonParts,
  useGetEquipmentNotes,
  useUpdateEquipmentNotes,
} from "@/services/setups/equipments";

'''

MAIN_IMPORTS = '''"use client";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pen } from "lucide-react";
import EditEquipment from "./edit-equipment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  BookText,
  ClipboardList,
  FileText,
  History,
  Image as ImageIcon,
  Paperclip,
  StickyNote,
  ListChecks,
} from "lucide-react";
import SidebarLayout from "@/components/customUI/customSideBar";
import Summary from "./summary";
import { useGetEquipment } from "@/services/setups/equipments";
import { HistoryTabs } from "./history-tabs";
import { TasksTab } from "./tasks-tab";
import { WorkOrdersTab } from "./work-orders-tab";
import { PartsManager } from "./parts-manager";
import {
  AttachmentTable,
  EquipmentDetailsSection,
  ImageGrid,
  NotesSection,
} from "./profile-sections";

'''


def slice_lines(lines: list[str], start: int, end: int) -> str:
    return "".join(lines[start - 1 : end])


def main() -> None:
    lines = SRC.read_text(encoding="utf-8").splitlines(keepends=True)

    chunks = {
        "history-tabs.tsx": (117, 1209, SHARED_IMPORTS, "\nexport { HistoryTabs } from './history-tabs-impl';\n"),
    }

    # history-tabs: 117-1209 + 1752-1839
    history_body = slice_lines(lines, 117, 1209) + "\n" + slice_lines(lines, 1752, 1839)
    (OUT / "history-tabs.tsx").write_text(SHARED_IMPORTS + history_body, encoding="utf-8")

    # work-orders-tab: 1211-1525, export as WorkOrdersTab
    wo_body = slice_lines(lines, 1211, 1525).replace(
        "const WorkOrdersComponent = () =>",
        "export function WorkOrdersTab()",
    )
    (OUT / "work-orders-tab.tsx").write_text(SHARED_IMPORTS + wo_body, encoding="utf-8")

    # tasks-tab: 1529-1750
    tasks_body = slice_lines(lines, 1529, 1750).replace(
        "export function Tasks(",
        "export function TasksTab(",
    )
    (OUT / "tasks-tab.tsx").write_text(SHARED_IMPORTS + tasks_body, encoding="utf-8")

    # parts-manager: 1841-2126, already exports PartsManager
    parts_body = slice_lines(lines, 1841, 2126)
    (OUT / "parts-manager.tsx").write_text(SHARED_IMPORTS + parts_body, encoding="utf-8")

    # profile-sections: 2127-2571
    sections_body = slice_lines(lines, 2127, 2571)
    sections_exports = (
        "\nexport { ImageGrid, AttachmentTable, EquipmentDetailsSection, NotesSection };\n"
    )
    sections_body = sections_body.replace(
        "function ImageGrid()",
        "export function ImageGrid()",
    ).replace(
        "function AttachmentTable()",
        "export function AttachmentTable()",
    ).replace(
        "const EquipmentDetailsSection = ",
        "export const EquipmentDetailsSection = ",
    ).replace(
        "function NotesSection(",
        "export function NotesSection(",
    )
    (OUT / "profile-sections.tsx").write_text(
        SHARED_IMPORTS + sections_body + sections_exports, encoding="utf-8"
    )

    # main equipment-profile: 2573-end, update component refs
    main_body = slice_lines(lines, 2573, len(lines))
    main_body = main_body.replace("<Tasks equipmentId", "<TasksTab equipmentId")
    main_body = main_body.replace("<WorkOrdersComponent />", "<WorkOrdersTab />")
    (OUT / "equipment-profile.tsx").write_text(MAIN_IMPORTS + main_body, encoding="utf-8")

    # Back-compat alias: Tasks export from tasks-tab
    tasks_file = OUT / "tasks-tab.tsx"
    tasks_content = tasks_file.read_text(encoding="utf-8")
    if "export function Tasks(" not in tasks_content:
        tasks_content += "\n/** @deprecated Use TasksTab */\nexport { TasksTab as Tasks };\n"
        tasks_file.write_text(tasks_content, encoding="utf-8")

    print("Split equipment-profile.tsx into modules.")


if __name__ == "__main__":
    main()
