import type { Customer } from "@/types/customer";
import { formatCurrency, formatDate, statusColor, cn } from "@/lib/utils";

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div>
                  <p className="font-medium text-white">{customer.name}</p>
                  <p className="text-xs text-zinc-500">{customer.email}</p>
                </div>
              </td>
              <td>{customer.orders}</td>
              <td>{formatCurrency(customer.totalSpent)}</td>
              <td>{formatDate(customer.joinedAt)}</td>
              <td>
                <span className={cn("status-badge", statusColor(customer.status))}>
                  {customer.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
