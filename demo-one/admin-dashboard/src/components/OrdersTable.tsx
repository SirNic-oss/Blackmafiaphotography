import type { Order } from "@/types/order";
import { formatCurrency, formatDate, statusColor, cn } from "@/lib/utils";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="font-medium text-white">{order.orderNumber}</td>
              <td>
                <div>
                  <p className="text-white">{order.customerName}</p>
                  <p className="text-xs text-zinc-500">{order.email}</p>
                </div>
              </td>
              <td>{order.items.length}</td>
              <td>{formatCurrency(order.total)}</td>
              <td>
                <span className={cn("status-badge", statusColor(order.status))}>
                  {order.status}
                </span>
              </td>
              <td>{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
