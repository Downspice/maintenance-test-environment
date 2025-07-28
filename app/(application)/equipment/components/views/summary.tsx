export default function Summary() {
  return (
    <div className="grid grid-cols-2 gap-1 min-h-screen">
      {/* First Column */}
      <div className="grid grid-cols-5 gap-2 h-fit ">
        {/* First 4 Sub-columns */}
        <div className="col-span-4  border border-gray-300 p-4    ">
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

        <div className="col-span-5  border  gap-2 border-gray-300 p-1  ">
          <div className="grid grid-cols-6       ">
            <div className="col-span-2  border  border-gray-300 p-1   flex flex-col items-center justify-center">
              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Total</span>
              </div>

              <div className="col-span-1 p-3 font-bold text-xl mb-3 flex flex-col items-center justify-center">
                $0.00<span className="font-light text-sm">Monthly Average</span>
              </div>
            </div>
            <div className="col-span-4  border  border-gray-300 p-1   flex flex-col items-center justify-center">
              No Monthly Data
            </div>
          </div>

          <div className="grid grid-cols-6  border  border-gray-300 p-10  ">
            <div className="col-span-6    p-1   flex flex-col items-center justify-center">
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
            <div className="grid grid-cols-6    p-1  ">
              <div className="col-span-2  border  border-gray-300 p-1   flex flex-col items-center justify-center">
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
              <div className="col-span-4 border  border-gray-300 p-1 flex flex-col items-center justify-center">
                No Monthly Data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
