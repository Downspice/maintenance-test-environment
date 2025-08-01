export default function Summary() {
  return (
    <div className="grid grid-cols-2 gap-1 min-h-screen">
      {/* First Column */}
      <div className="grid grid-cols-5 gap-2 h-fit ">
        {/* First 4 Sub-columns */}
        <div className="col-span-4  border border-gray-300 p-4">
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

        <div className="col-span-1  border  border-gray-300 p-1  ">
          <h2 className="text-sm font-light mb-4">Work Orders </h2>

          <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
            0<span className="font-light text-sm">Outstanding</span>
          </div>
        </div>

        <div className="col-span-5  border  space-y-2 border-gray-300 p-1  ">
          <div className="grid grid-cols-6 ">
            <div className="col-span-6">Service Cost</div>
            <div className="col-span-2  border-r  border-gray-300 p-1   flex flex-col items-center justify-center">
              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Total</span>
                <span className="font-light text-sm">&nbsp;</span>
              </div>

              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Monthly Average</span>
                <span className="font-light text-sm">&nbsp;</span>
              </div>
            </div>

            <div className="col-span-4  p-1  mt-2 flex flex-col items-center justify-center">
              No Monthly Data
            </div>
          </div>
        </div>

        <div className="col-span-5  border  space-y-2 border-gray-300 p-1  ">
          <div className="grid grid-cols-6">
            <div className="col-span-6">Downtime Hours (Last 4 hours)</div>
            <div className="col-span-2  border-r  border-gray-300 p-1   flex flex-col items-center justify-center">
              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Total</span>
                <span className="font-light text-sm">&nbsp;</span>
              </div>

              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Monthly Average</span>
                <span className="font-light text-sm">&nbsp;</span>
              </div>
            </div>

            <div className="col-span-4  p-1  mt-2 flex flex-col items-center justify-center">
              No Monthly Data
            </div>
          </div>
        </div>
      </div>

      {/* Second Column – Customize as needed */}
      <div className="bg-white h-fit  ">
        <div className="grid grid-cols-5 gap-2">
          {/* First 4 Sub-columns */}
          <div className="col-span-2  border  border-gray-300 p-4    ">
            <h2 className="text-sm font-light mb-4">Last Inspection</h2>
            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-2 p-3 font-light text-blue  mb-3 flex flex-col items-center justify-center">
                No Inspection
                {/* <span className="font-light text-sm">PM</span> */}
              </div>
            </div>
          </div>

          <div className="col-span-3  border  border-gray-300      ">
            <h2 className=" text-sm font-light p-4 mb-4">Budget</h2>
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
          <div className="col-span-5  border  border-gray-300 p-1  ">
            <div className="grid grid-cols-6 ">
              <div className="col-span-6">Usage</div>
              <div className="col-span-2  border-r border-gray-300 p-1   flex flex-col items-center justify-center">
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
              <div className="col-span-4 p-1 flex flex-col items-center justify-center">
                No Monthly Data
              </div>
            </div>
          </div>

          <div className="col-span-5  border  border-gray-300 p-1  ">
            <div className="grid grid-cols-6 ">
              <div className="col-span-6">Fuel Costs</div>
              <div className="col-span-2  border-r border-gray-300 p-1   flex flex-col items-center justify-center">
                <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                  0.00
                  <span className="font-light text-sm">GPH</span>
                  <span className="font-light text-sm">Last 30-days</span>
                </div>
                <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                  0.00
                  <span className="font-light text-sm">GPH</span>
                  <span className="font-light text-sm">Previous 30-days</span>
                </div>
              </div>
              <div className="col-span-4 p-1 flex flex-col items-center justify-center">
                No Monthly Data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
