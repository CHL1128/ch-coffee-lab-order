"use client";

export function StickyOrderSummary({
  selectedItemCount,
  totalQuantity,
  totalAmount,
  onOpenForm
}: {
  selectedItemCount: number;
  totalQuantity: number;
  totalAmount: number;
  onOpenForm: () => void;
}) {
  const hasItems = selectedItemCount > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-coffee-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(42,26,17,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!hasItems ? (
          <p className="text-center font-semibold text-coffee-700 sm:text-left">
            請選擇想訂購的咖啡豆
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 text-center sm:flex sm:text-left">
              <div>
                <p className="text-xs text-coffee-700">已選品項</p>
                <p className="font-bold text-coffee-900">{selectedItemCount}</p>
              </div>
              <div>
                <p className="text-xs text-coffee-700">總包數</p>
                <p className="font-bold text-coffee-900">{totalQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-coffee-700">總金額</p>
                <p className="font-bold text-coffee-900">
                  NT${totalAmount.toLocaleString("zh-TW")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenForm}
              className="min-h-11 rounded-md bg-coffee-700 px-5 py-3 font-semibold text-white hover:bg-coffee-500"
            >
              填寫訂購資料
            </button>
          </>
        )}
      </div>
    </div>
  );
}
