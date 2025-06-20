// ** Import Schema
import { usersResponseSchema } from "@/app/(home)/data-table/schema";

const API_BASE_URL = "/api";

/**
 * Fetch users with expenses
 */
export async function fetchUsers() {
//     {
//   search = "",
//   from_date = "",
//   to_date = "",
//   sort_by = "created_at",
//   sort_order = "desc",
//   page = 1,
//   limit = 10,
// }: {
//   search?: string;
//   from_date?: string;
//   to_date?: string;
//   sort_by?: string;
//   sort_order?: string;
//   page?: number;
//   limit?: number;
// }
  // Process search term - trim and sanitize
  //   const processedSearch = search ? search.trim().replace(/\s+/g, ' ') : "";

  //   // Build query parameters
  //   const params = new URLSearchParams();
  //   if (processedSearch) params.append("search", processedSearch);
  //   if (from_date) params.append("from_date", from_date);
  //   if (to_date) params.append("to_date", to_date);
  //   params.append("sort_by", sort_by);
  //   params.append("sort_order", sort_order);
  //   params.append("page", page.toString());
  //   params.append("limit", limit.toString());

  //   // Fetch data
  //   const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`);

  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch users: ${response.statusText}`);
  //   }

  const data = [
    {
      id: 1,
      carName: "Toyota Camry",
      carModel: "2020",
      carNumber: "KAB 123A",
      tasksPending: 3,
      carImage: "https://example.com/images/camry.jpg",
      taskStatus: "due soon",
      taskTypes: ["maintenance", "incident"],
    },
    {
      id: 2,
      carName: "Honda Accord",
      carModel: "2019",
      carNumber: "KCE 456B",
      tasksPending: 1,
      carImage: "https://example.com/images/accord.jpg",
      taskStatus: "overdue",
      taskTypes: ["maintenance"],
    },
    {
      id: 3,
      carName: "Mazda CX-5",
      carModel: "2021",
      carNumber: "KBX 789C",
      tasksPending: 2,
      carImage: "https://example.com/images/cx5.jpg",
      taskStatus: "due soon",
      taskTypes: ["incident"],
    },
    {
      id: 4,
      carName: "Subaru Forester",
      carModel: "2018",
      carNumber: "KDD 321D",
      tasksPending: 4,
      carImage: "https://example.com/images/forester.jpg",
      taskStatus: "overdue",
      taskTypes: ["maintenance", "incident"],
    },
    {
      id: 5,
      carName: "Ford Ranger",
      carModel: "2022",
      carNumber: "KCZ 654E",
      tasksPending: 1,
      carImage: "https://example.com/images/ranger.jpg",
      taskStatus: "due soon",
      taskTypes: ["incident"],
    },
    {
      id: 6,
      carName: "Nissan X-Trail",
      carModel: "2020",
      carNumber: "KCL 987F",
      tasksPending: 2,
      carImage: "https://example.com/images/xtrail.jpg",
      taskStatus: "overdue",
      taskTypes: ["maintenance"],
    },
    {
      id: 7,
      carName: "Volkswagen Golf",
      carModel: "2017",
      carNumber: "KAR 741G",
      tasksPending: 3,
      carImage: "https://example.com/images/golf.jpg",
      taskStatus: "due soon",
      taskTypes: ["maintenance", "incident"],
    },
    {
      id: 8,
      carName: "BMW X3",
      carModel: "2023",
      carNumber: "KDA 852H",
      tasksPending: 0,
      carImage: "https://example.com/images/x3.jpg",
      taskStatus: "due soon",
      taskTypes: [],
    },
    {
      id: 9,
      carName: "Mercedes-Benz C200",
      carModel: "2021",
      carNumber: "KBM 963J",
      tasksPending: 5,
      carImage: "https://example.com/images/c200.jpg",
      taskStatus: "overdue",
      taskTypes: ["incident"],
    },
    {
      id: 10,
      carName: "Hyundai Tucson",
      carModel: "2020",
      carNumber: "KCX 159K",
      tasksPending: 2,
      carImage: "https://example.com/images/tucson.jpg",
      taskStatus: "due soon",
      taskTypes: ["maintenance"],
    },
  ];
  return data;
}
