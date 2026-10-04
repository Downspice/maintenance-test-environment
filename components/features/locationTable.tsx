"use client";

// import React, { useState, useMemo } from "react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ChevronDown,
//   ChevronRight,
//   Edit,
//   Trash2,
//   Building,
//   MapPin,
//   Tag,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Plus,
// } from "lucide-react";

// interface Category {
//   id: string;
//   name: string;
// }

// interface Location {
//   id: string;
//   location_name: string;
//   tax_rate1: number;
//   tax_rate2: number;
//   categories: Category[];
// }

// interface Company {
//   id: string;
//   company_name: string;
//   tax_rate1: number;
//   tax_rate2: number;
//   locations: Location[];
// }

// interface HierarchicalTaxTableProps {
//   data: Company;
//   onEdit: (type: "company" | "location" | "category", id: string) => void;
//   onDelete: (type: "company" | "location" | "category", id: string) => void;
//   onAddLocation?: (companyId: string) => void;
//   onAddCategory?: (locationId: string) => void;
// }

// type SortField = "name" | "tax_rate1" | "tax_rate2";
// type SortDirection = "asc" | "desc" | null;
// type SelectedItem = {
//   type: "company" | "location" | "category";
//   id: string;
// } | null;

// export default function HierarchicalTaxTable({
//   data,
//   onEdit,
//   onDelete,
//   onAddLocation,
//   onAddCategory,
// }: HierarchicalTaxTableProps) {
//   const [expandedCompany, setExpandedCompany] = useState(true);
//   // Initialize all locations as expanded by default
//   const [expandedLocations, setExpandedLocations] = useState<Set<string>>(
//     new Set(data.locations.map((location) => location.id))
//   );
//   const [sortField, setSortField] = useState<SortField | null>(null);
//   const [sortDirection, setSortDirection] = useState<SortDirection>(null);
//   const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

//   const toggleLocation = (locationId: string) => {
//     const newExpanded = new Set(expandedLocations);
//     if (newExpanded.has(locationId)) {
//       newExpanded.delete(locationId);
//     } else {
//       newExpanded.add(locationId);
//     }
//     setExpandedLocations(newExpanded);
//   };

//   const handleItemClick = (
//     type: "company" | "location" | "category",
//     id: string,
//     event: React.MouseEvent
//   ) => {
//     event.stopPropagation();
//     setSelectedItem({ type, id });
//   };

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       // Cycle through: asc -> desc -> null
//       if (sortDirection === "asc") {
//         setSortDirection("desc");
//       } else if (sortDirection === "desc") {
//         setSortDirection(null);
//         setSortField(null);
//       } else {
//         setSortDirection("asc");
//       }
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   const getSortIcon = (field: SortField) => {
//     if (sortField !== field) {
//       return <ArrowUpDown size={14} className="text-slate-400" />;
//     }
//     if (sortDirection === "asc") {
//       return <ArrowUp size={14} className="text-blue-600" />;
//     }
//     if (sortDirection === "desc") {
//       return <ArrowDown size={14} className="text-blue-600" />;
//     }
//     return <ArrowUpDown size={14} className="text-slate-400" />;
//   };

//   const isSelected = (
//     type: "company" | "location" | "category",
//     id: string
//   ) => {
//     return selectedItem?.type === type && selectedItem?.id === id;
//   };

//   const sortedData = useMemo(() => {
//     if (!sortField || !sortDirection) {
//       return data;
//     }

//     const sortedLocations = [...data.locations].sort((a, b) => {
//       let aid: string | number;
//       let bid: string | number;

//       switch (sortField) {
//         case "name":
//           aValue = a.location_name.toLowerCase();
//           bValue = b.location_name.toLowerCase();
//           break;
//         case "tax_rate1":
//           aValue = a.tax_rate1;
//           bValue = b.tax_rate1;
//           break;
//         case "tax_rate2":
//           aValue = a.tax_rate2;
//           bValue = b.tax_rate2;
//           break;
//         default:
//           return 0;
//       }

//       if (aValue < bValue) {
//         return sortDirection === "asc" ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return sortDirection === "asc" ? 1 : -1;
//       }
//       return 0;
//     });

//     // Also sort categories within each location if sorting by name
//     if (sortField === "name") {
//       sortedLocations.forEach((location) => {
//         location.categories.sort((a, b) => {
//           const aName = a.name.toLowerCase();
//           const bName = b.name.toLowerCase();
//           if (aName < bName) {
//             return sortDirection === "asc" ? -1 : 1;
//           }
//           if (aName > bName) {
//             return sortDirection === "asc" ? 1 : -1;
//           }
//           return 0;
//         });
//       });
//     }

//     return {
//       ...data,
//       locations: sortedLocations,
//     };
//   }, [data, sortField, sortDirection]);

//   const ActionButtons = ({
//     type,
//     id,
//   }: {
//     type: "company" | "location" | "category";
//     id: string;
//   }) => (
//     <div className="flex gap-2">
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={(e) => {
//           e.stopPropagation();
//           onEdit(type, id);
//         }}
//         className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
//       >
//         <Edit size={14} />
//       </Button>
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete(type, id);
//         }}
//         className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
//       >
//         <Trash2 size={14} />
//       </Button>
//     </div>
//   );

//   const SortableHeader = ({
//     field,
//     children,
//     className = "",
//   }: {
//     field: SortField;
//     children: React.ReactNode;
//     className?: string;
//   }) => (
//     <button
//       onClick={() => handleSort(field)}
//       className={`flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors rounded px-2 py-1 ${className}`}
//     >
//       {children}
//       {getSortIcon(field)}
//     </button>
//   );

//   const AddButtons = () => {
//     if (!selectedItem) return null;

//     return (
//       <div className="bg-blue-50 border-t border-blue-200 px-4 py-3 flex gap-3">
//         {selectedItem.type === "company" && (
//           <Button onClick={() => onAddLocation?.(selectedItem.id)} size="sm">
//             <Plus size={16} />
//             Add New Location
//           </Button>
//         )}

//         {selectedItem.type === "location" && (
//           <>
//             <Button
//               onClick={() => onAddLocation?.(data.id)}
//               variant="outline"
//               size="sm"
//             >
//               <Plus size={16} />
//               Add New Location
//             </Button>
//             <Button onClick={() => onAddCategory?.(selectedItem.id)} size="sm">
//               <Plus size={16} />
//               Add New Category
//             </Button>
//           </>
//         )}

//         {selectedItem.type === "category" && (
//           <Button
//             onClick={() => {
//               // Find the location that contains this category
//               const location = sortedData.locations.find((loc) =>
//                 loc.categories.some((cat) => cat.id === selectedItem.id)
//               );
//               if (location) {
//                 onAddCategory?.(location.id);
//               }
//             }}
//             size="sm"
//           >
//             <Plus size={16} />
//             Add New Category
//           </Button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <Card className="w-full  shadow-lg">
//       <CardContent className="p-0">
//         <div className="bg-white rounded-lg overflow-hidden">
//           {/* Table Headers */}
//           <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 grid grid-cols-12 gap-4 font-semibold text-slate-700">
//             <div className="col-span-5 flex items-center gap-2">
//               <SortableHeader field="name">Location Name</SortableHeader>
//             </div>
//             <div className="col-span-2 text-center">
//               <SortableHeader field="tax_rate1">Tax Rate #1</SortableHeader>
//             </div>
//             <div className="col-span-2 text-center">
//               <SortableHeader field="tax_rate2">Tax Rate #2</SortableHeader>
//             </div>
//             <div className="col-span-3 text-center">Actions</div>
//           </div>

//           {/* Company Row */}
//           <Collapsible open={expandedCompany} onOpenChange={setExpandedCompany}>
//             <div
//               className={`px-4 py-4 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-200 group ${
//                 isSelected("company", sortedData.id)
//                   ? "bg-blue-100 hover:bg-blue-150"
//                   : "hover:bg-slate-50"
//               }`}
//             >
//               <div className="col-span-5 flex items-center gap-3">
//                 <CollapsibleTrigger className="flex items-center justify-center w-6 h-6 hover:bg-slate-200 rounded transition-colors">
//                   {expandedCompany ? (
//                     <ChevronDown
//                       size={16}
//                       className="text-slate-600 group-hover:text-slate-800"
//                     />
//                   ) : (
//                     <ChevronRight
//                       size={16}
//                       className="text-slate-600 group-hover:text-slate-800"
//                     />
//                   )}
//                 </CollapsibleTrigger>
//                 <div
//                   className="flex items-center gap-3 flex-1 cursor-pointer"
//                   onClick={(e) => handleItemClick("company", sortedData.id, e)}
//                 >
//                   <Building size={18} className="text-blue-600" />
//                   <span className="font-semibold text-slate-800">
//                     {sortedData.company_name}
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className="col-span-2 text-center cursor-pointer"
//                 onClick={(e) => handleItemClick("company", sortedData.id, e)}
//               >
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   {(sortedData.tax_rate1 * 100).toFixed(1)}%
//                 </span>
//               </div>
//               <div
//                 className="col-span-2 text-center cursor-pointer"
//                 onClick={(e) => handleItemClick("company", sortedData.id, e)}
//               >
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   {(sortedData.tax_rate2 * 100).toFixed(1)}%
//                 </span>
//               </div>
//               <div className="col-span-3 flex justify-center">
//                 <ActionButtons type="company" id={sortedData.id} />
//               </div>
//             </div>

//             <CollapsibleContent>
//               {/* Locations */}
//               {sortedData.locations.map((location) => (
//                 <div key={location.id} className="bg-slate-25">
//                   <Collapsible
//                     open={expandedLocations.has(location.id)}
//                     onOpenChange={() => toggleLocation(location.id)}
//                   >
//                     <div
//                       className={`px-4 py-3 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-100 group ${
//                         isSelected("location", location.id)
//                           ? "bg-green-100 hover:bg-green-150"
//                           : "hover:bg-slate-50"
//                       }`}
//                     >
//                       <div className="col-span-5 flex items-center gap-3 pl-8">
//                         <CollapsibleTrigger className="flex items-center justify-center w-6 h-6 hover:bg-slate-200 rounded transition-colors">
//                           {expandedLocations.has(location.id) ? (
//                             <ChevronDown
//                               size={16}
//                               className="text-slate-600 group-hover:text-slate-800"
//                             />
//                           ) : (
//                             <ChevronRight
//                               size={16}
//                               className="text-slate-600 group-hover:text-slate-800"
//                             />
//                           )}
//                         </CollapsibleTrigger>
//                         <div
//                           className="flex items-center gap-3 flex-1 cursor-pointer"
//                           onClick={(e) =>
//                             handleItemClick("location", location.id, e)
//                           }
//                         >
//                           <MapPin size={16} className="text-green-600" />
//                           <span className="font-medium text-slate-700">
//                             {location.location_name}
//                           </span>
//                         </div>
//                       </div>
//                       <div
//                         className="col-span-2 text-center cursor-pointer"
//                         onClick={(e) =>
//                           handleItemClick("location", location.id, e)
//                         }
//                       >
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {(location.tax_rate1 * 100).toFixed(1)}%
//                         </span>
//                       </div>
//                       <div
//                         className="col-span-2 text-center cursor-pointer"
//                         onClick={(e) =>
//                           handleItemClick("location", location.id, e)
//                         }
//                       >
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           {(location.tax_rate2 * 100).toFixed(1)}%
//                         </span>
//                       </div>
//                       <div className="col-span-3 flex justify-center">
//                         <ActionButtons type="location" id={location.id} />
//                       </div>
//                     </div>

//                     <CollapsibleContent>
//                       {/* Categories */}
//                       {location.categories.map((category) => (
//                         <div
//                           key={category.id}
//                           className={`px-4 py-3 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-50 last:border-b-0 cursor-pointer ${
//                             isSelected("category", category.id)
//                               ? "bg-purple-100 hover:bg-purple-150"
//                               : "hover:bg-slate-50"
//                           }`}
//                           onClick={(e) =>
//                             handleItemClick("category", category.id, e)
//                           }
//                         >
//                           <div className="col-span-5 flex items-center gap-3 pl-16">
//                             <Tag size={14} className="text-purple-600" />
//                             <span className="text-slate-600">
//                               {category.name}
//                             </span>
//                           </div>
//                           <div className="col-span-2 text-center">
//                             <span className="text-xs text-slate-400">-</span>
//                           </div>
//                           <div className="col-span-2 text-center">
//                             <span className="text-xs text-slate-400">-</span>
//                           </div>
//                           <div
//                             className="col-span-3 flex justify-center"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <ActionButtons type="category" id={category.id} />
//                           </div>
//                         </div>
//                       ))}
//                     </CollapsibleContent>
//                   </Collapsible>
//                 </div>
//               ))}
//             </CollapsibleContent>
//           </Collapsible>

//           {/* Add Buttons Section */}
//           <AddButtons />
//         </div>
        
//       </CardContent>
//     </Card>
//   );
// }


import React, { useState, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronRight,
  FilePenIcon,
  Trash2,
  Building,
  MapPin,
  Tag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  location_name: string;
  tax_rate1: number;
  tax_rate2: number;
  categories: Category[];
}

interface Company {
  id: string;
  company_name: string;
  tax_rate1: number;
  tax_rate2: number;
  locations: Location[];
}

interface HierarchicalTaxTableProps {
  data: Company;
  onEdit: (type: "company" | "location" | "category", id: string) => void;
  onDelete: (type: "company" | "location" | "category", id: string) => void;
  onAddLocation?: (companyId: string) => void;
  onAddCategory?: (locationId: string) => void;
}

type SortField = "name" | "tax_rate1" | "tax_rate2";
type SortDirection = "asc" | "desc" | null;
type SelectedItem = {
  type: "company" | "location" | "category";
  id: string;
} | null;

export default function HierarchicalTaxTable({
  data,
  onEdit,
  onDelete,
  onAddLocation,
  onAddCategory,
}: HierarchicalTaxTableProps) {
  const [expandedCompany, setExpandedCompany] = useState(true);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(
    new Set(data.locations.map((location) => location.id))
  );
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<{
    type: "company" | "location" | "category";
    id: string;
    name?: string;
    tax_rate1?: number;
    tax_rate2?: number;
  } | null>(null);

  const toggleLocation = (locationId: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedLocations(newExpanded);
  };

  const handleItemClick = (
    type: "company" | "location" | "category",
    id: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSelectedItem({ type, id });
  };

  const findItemById = (type: "company" | "location" | "category", id: string) => {
    if (type === "company") return data;
    if (type === "location") return data.locations.find((loc) => loc.id === id);
    if (type === "category") {
      for (const loc of data.locations) {
        const cat = loc.categories.find((cat) => cat.id === id);
        if (cat) return cat;
      }
    }
    return null;
  };

  const getItemDisplayName = (
    type: "company" | "location" | "category",
    id: string
  ) => {
    const item = findItemById(type, id);
    if (!item) return type;
    if (type === "company") return (item as Company).company_name;
    if (type === "location") return (item as Location).location_name;
    return (item as Category).name;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-slate-400" />;
    if (sortDirection === "asc") return <ArrowUp size={14} className="text-blue-600" />;
    if (sortDirection === "desc") return <ArrowDown size={14} className="text-blue-600" />;
    return <ArrowUpDown size={14} className="text-slate-400" />;
  };

  const isSelected = (type: "company" | "location" | "category", id: string) => {
    return selectedItem?.type === type && selectedItem?.id === id;
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return data;

    const sortedLocations = [...data.locations].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.location_name.toLowerCase();
          bValue = b.location_name.toLowerCase();
          break;
        case "tax_rate1":
          aValue = a.tax_rate1;
          bValue = b.tax_rate1;
          break;
        case "tax_rate2":
          aValue = a.tax_rate2;
          bValue = b.tax_rate2;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    if (sortField === "name") {
      sortedLocations.forEach((location) => {
        location.categories.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          if (aName < bName) return sortDirection === "asc" ? -1 : 1;
          if (aName > bName) return sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      });
    }

    return { ...data, locations: sortedLocations };
  }, [data, sortField, sortDirection]);

  const ActionButtons = ({
    type,
    id,
  }: {
    type: "company" | "location" | "category";
    id: string;
  }) => {
    const displayName = getItemDisplayName(type, id);

    return (
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={`Edit ${displayName}`}
          onClick={(e) => {
            e.stopPropagation();
            const item = findItemById(type, id);
            if (!item) return;
            setEditData({
              type,
              id,
              name:
                type === "company"
                  ? (item as Company).company_name
                  : type === "location"
                    ? (item as Location).location_name
                    : (item as Category).name,
              tax_rate1:
                type !== "category"
                  ? (item as Company | Location).tax_rate1
                  : undefined,
              tax_rate2:
                type !== "category"
                  ? (item as Company | Location).tax_rate2
                  : undefined,
            });
            setEditDialogOpen(true);
          }}
        >
          <FilePenIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={`Delete ${displayName}`}
          className="text-destructive focus:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(type, id);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    );
  };

  const SortableHeader = ({ field, children, className = "" }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors rounded px-2 py-1 ${className}`}
    >
      {children}
      {getSortIcon(field)}
    </button>
  );

  const AddButtons = () => {
    if (!selectedItem) return null;
    return (
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-3 flex gap-3">
        {selectedItem.type === "company" && (
          <Button onClick={() => onAddLocation?.(selectedItem.id)} size="sm">
            <Plus size={16} /> Add New Location
          </Button>
        )}
        {selectedItem.type === "location" && (
          <>
            <Button onClick={() => onAddLocation?.(data.id)} variant="outline" size="sm">
              <Plus size={16} /> Add New Location
            </Button>
            <Button onClick={() => onAddCategory?.(selectedItem.id)} size="sm">
              <Plus size={16} /> Add New Category
            </Button>
          </>
        )}
        {selectedItem.type === "category" && (
          <Button
            onClick={() => {
              const location = sortedData.locations.find((loc) =>
                loc.categories.some((cat) => cat.id === selectedItem.id)
              );
              if (location) {
                onAddCategory?.(location.id);
              }
            }}
            size="sm"
          >
            <Plus size={16} /> Add New Category
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-0">
        {/* Your table content remains unchanged, including Collapsible logic */}
<div className="bg-white rounded-lg overflow-hidden">
          {/* Table Headers */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 grid grid-cols-12 gap-4 font-semibold text-slate-700">
            <div className="col-span-5 flex items-center gap-2">
              <SortableHeader field="name">Location Name</SortableHeader>
            </div>
            <div className="col-span-2 text-center">
              <SortableHeader field="tax_rate1">Tax Rate #1</SortableHeader>
            </div>
            <div className="col-span-2 text-center">
              <SortableHeader field="tax_rate2">Tax Rate #2</SortableHeader>
            </div>
            <div className="col-span-3 text-center">Actions</div>
          </div>

          {/* Company Row */}
          <Collapsible open={expandedCompany} onOpenChange={setExpandedCompany}>
            <div
              className={`px-4 py-4 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-200 group ${
                isSelected("company", sortedData.id)
                  ? "bg-blue-100 hover:bg-blue-150"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <CollapsibleTrigger className="flex items-center justify-center w-6 h-6 hover:bg-slate-200 rounded transition-colors">
                  {expandedCompany ? (
                    <ChevronDown
                      size={16}
                      className="text-slate-600 group-hover:text-slate-800"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-slate-600 group-hover:text-slate-800"
                    />
                  )}
                </CollapsibleTrigger>
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={(e) => handleItemClick("company", sortedData.id, e)}
                >
                  <Building size={18} className="text-blue-600" />
                  <span className="font-semibold text-slate-800">
                    {sortedData.company_name}
                  </span>
                </div>
              </div>
              <div
                className="col-span-2 text-center cursor-pointer"
                onClick={(e) => handleItemClick("company", sortedData.id, e)}
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {(sortedData.tax_rate1 * 100).toFixed(1)}%
                </span>
              </div>
              <div
                className="col-span-2 text-center cursor-pointer"
                onClick={(e) => handleItemClick("company", sortedData.id, e)}
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {(sortedData.tax_rate2 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="col-span-3 flex justify-end pr-1">
                <ActionButtons type="company" id={sortedData.id} />
              </div>
            </div>

            <CollapsibleContent>
              {/* Locations */}
              {sortedData.locations.map((location) => (
                <div key={location.id} className="bg-slate-25">
                  <Collapsible
                    open={expandedLocations.has(location.id)}
                    onOpenChange={() => toggleLocation(location.id)}
                  >
                    <div
                      className={`px-4 py-3 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-100 group ${
                        isSelected("location", location.id)
                          ? "bg-green-100 hover:bg-green-150"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-3 pl-8">
                        <CollapsibleTrigger className="flex items-center justify-center w-6 h-6 hover:bg-slate-200 rounded transition-colors">
                          {expandedLocations.has(location.id) ? (
                            <ChevronDown
                              size={16}
                              className="text-slate-600 group-hover:text-slate-800"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="text-slate-600 group-hover:text-slate-800"
                            />
                          )}
                        </CollapsibleTrigger>
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={(e) =>
                            handleItemClick("location", location.id, e)
                          }
                        >
                          <MapPin size={16} className="text-green-600" />
                          <span className="font-medium text-slate-700">
                            {location.location_name}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-span-2 text-center cursor-pointer"
                        onClick={(e) =>
                          handleItemClick("location", location.id, e)
                        }
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {(location.tax_rate1 * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className="col-span-2 text-center cursor-pointer"
                        onClick={(e) =>
                          handleItemClick("location", location.id, e)
                        }
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {(location.tax_rate2 * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="col-span-3 flex justify-end pr-1">
                        <ActionButtons type="location" id={location.id} />
                      </div>
                    </div>

                    <CollapsibleContent>
                      {/* Categories */}
                      {location.categories.map((category) => (
                        <div
                          key={category.id}
                          className={`px-4 py-3 grid grid-cols-12 gap-4 items-center transition-colors border-b border-slate-50 last:border-b-0 cursor-pointer ${
                            isSelected("category", category.id)
                              ? "bg-purple-100 hover:bg-purple-150"
                              : "hover:bg-slate-50"
                          }`}
                          onClick={(e) =>
                            handleItemClick("category", category.id, e)
                          }
                        >
                          <div className="col-span-5 flex items-center gap-3 pl-16">
                            <Tag size={14} className="text-purple-600" />
                            <span className="text-slate-600">
                              {category.name}
                            </span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="text-xs text-slate-400">-</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="text-xs text-slate-400">-</span>
                          </div>
                          <div
                            className="col-span-3 flex justify-end pr-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionButtons type="category" id={category.id} />
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Add Buttons Section */}
          <AddButtons />
        </div>
        <Modal
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          title={`Edit ${editData?.type ?? "Item"}`}
          description={`Update the details for this ${editData?.type ?? "item"}.`}
          size="md"
          closeable={true}
          renderActions={
            <Button
              variant="primary"
              onClick={() => {
                if (confirm("Are you sure you want to apply these changes?")) {
                  onEdit(editData!.type, editData!.id);
                  setEditDialogOpen(false);
                }
              }}
            >
              Save Changes
            </Button>
          }
        >
          {editData && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData((prev) => prev && { ...prev, name: e.target.value })
                  }
                />
              </div>
              {editData.type !== "category" && (
                <>
                  <div>
                    <Label>Tax Rate 1</Label>
                    <Input
                      type="number"
                      value={editData.tax_rate1 ?? ""}
                      onChange={(e) =>
                        setEditData((prev) => prev && { ...prev, tax_rate1: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tax Rate 2</Label>
                    <Input
                      type="number"
                      value={editData.tax_rate2 ?? ""}
                      onChange={(e) =>
                        setEditData((prev) => prev && { ...prev, tax_rate2: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </CardContent>
    </Card>
  );
}
