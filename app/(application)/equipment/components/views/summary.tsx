export default function Summary() {
  return (
    <div className="grid grid-cols-2 gap-1 min-h-screen">
      {/* First Column */}
      <div className="grid grid-cols-5 gap-1 h-fit ">
        {/* First 4 Sub-columns */}
        <div className="col-span-4 bg-gray-100 p-4   shadow">
          <h2 className="text-sm   mb-4">Notifications</h2>
          <div className="grid grid-cols-3 gap-1">
            <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
              0<span className="font-light text-sm">PM</span>
            </div>
            <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
              0<span className="font-light text-sm">Repairs</span>
            </div>
            <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
              0<span className="font-light text-sm">Renewals</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-gray-100 p-1 shadow">
          <h2 className="text-sm font-light mb-4">Work Orders </h2>

          <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
            0<span className="font-light text-sm">Outstanding</span>
          </div>
        </div>

        <div className="col-span-5 bg-gray-100 p-1 shadow">
          <div className="grid grid-cols-6 bg-gray-100 p-1 shadow">
            <div className="col-span-2 bg-gray-100 p-1 shadow flex flex-col items-center justify-center">
              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Total</span>
              </div>

              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Monthly Average</span>
              </div>
            </div>
            <div className="col-span-4 bg-gray-100 p-1 shadow flex flex-col items-center justify-center">
              No Monthly Data
            </div>
          </div>

          <div className="grid grid-cols-6 bg-gray-100 p-10 shadow">
            <div className="col-span-6 bg-gray-100 p-1 shadow flex flex-col items-center justify-center">
              No Monthly Data
            </div>
          </div>
        </div>
      </div>

      {/* Second Column – Customize as needed */}
      <div className="bg-white h-fit shadow">
        <div className="grid grid-cols-5 gap-2">
          {/* First 4 Sub-columns */}
          <div className="col-span-2 bg-gray-100 p-4   shadow">
            <h2 className="text-sm font-light mb-4">Last Inspection</h2>
            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-2 p-3 font-light text-blue  mb-3 flex flex-col items-center justify-center">
                No Inspection
                {/* <span className="font-light text-sm">PM</span> */}
              </div>
            </div>
          </div>

          <div className="col-span-3 bg-gray-100    shadow ">
            <h2 className=" text-sm font-light mb-4">Budget</h2>
            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-1 p-3 font-light text-blue text-xl mb-3 flex flex-col items-center justify-center">
                $0
                <span className="font-light text-sm">Budgeted</span>
              </div>

              <div className="col-span-1 p-3 font-light text-blue text-xl mb-3 flex flex-col items-center justify-center">
                $0
                <span className="font-light text-sm">Actual</span>
              </div>

              <div className="col-span-1 p-3 font-light text-blue text-xl mb-3 flex flex-col items-center justify-center">
                $0
                <span className="font-light text-sm">Remain</span>
              </div>
            </div>
          </div>
          <div className="col-span-5 bg-gray-100 p-1 shadow">
            <div className="grid grid-cols-6 bg-gray-100 p-1 shadow">
              <div className="col-span-2 bg-gray-100 p-1 shadow flex flex-col items-center justify-center">
                <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                  0.00
                  <span className="font-light text-sm">CPM</span>
                  <span className="font-light text-sm">Last 30-days</span>
                </div>
                <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                  0.00
                  <span className="font-light text-sm">CPM</span>
                  <span className="font-light text-sm">Previous 30-days</span>
                </div>
              </div>
              <div className="col-span-4 bg-gray-100 p-1 shadow flex flex-col items-center justify-center">
                No Monthly Data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
