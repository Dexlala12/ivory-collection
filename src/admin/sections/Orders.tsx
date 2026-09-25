import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchOrders, type OrderRow } from '../../lib/api';
import { PageHeader } from '../components/FormFields';
import type { CartItem } from '../../types';

interface CustomerInfo {
  email: string; phone: string; firstName: string; lastName: string;
  address: string; apartment?: string; city: string; postalCode: string; country: string; shippingMethod: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Orders" subtitle="Every checkout inquiry sent via WhatsApp, most recent first." />

      {loading && <p className="text-xs text-black/40 font-mono">Loading...</p>}
      {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
      {!loading && orders.length === 0 && !error && <p className="text-xs text-black/40 font-mono">No orders yet.</p>}

      <div className="border border-black/10 divide-y divide-black/10">
        {orders.map((o) => {
          const isOpen = expanded === o.id;
          const customer = o.customerInfo as CustomerInfo;
          const items = o.items as CartItem[];
          return (
            <div key={o.id}>
              <button onClick={() => setExpanded(isOpen ? null : o.id)} className="w-full flex items-center justify-between p-4 text-xs font-mono hover:bg-zinc-50 text-left">
                <div>
                  <span className="font-bold">{o.orderNumber}</span>
                  <span className="text-black/40 ml-3">{customer.firstName} {customer.lastName}</span>
                  <span className="text-black/30 ml-3">{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="uppercase text-[9px] tracking-wider text-black/40 border border-black/10 px-2 py-0.5">{o.paymentStatus}</span>
                  <span className="font-bold">${o.total.toFixed(2)}</span>
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {isOpen && (
                <div className="p-4 bg-zinc-50 text-xs font-mono space-y-3 border-t border-black/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-black/40 uppercase text-[9px] mb-1">Customer</p>
                      <p>{customer.email} &middot; {customer.phone}</p>
                      <p>{customer.address}{customer.apartment ? `, ${customer.apartment}` : ''}, {customer.city}, {customer.postalCode}, {customer.country}</p>
                      <p className="text-black/40">{customer.shippingMethod}</p>
                    </div>
                    <div>
                      <p className="text-black/40 uppercase text-[9px] mb-1">Payment</p>
                      <p>{o.paymentMethod}</p>
                      <p className="text-black/40">Subtotal ${o.subtotal.toFixed(2)} &middot; Shipping ${o.shipping.toFixed(2)} &middot; Tax ${o.tax.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-black/40 uppercase text-[9px] mb-1">Items</p>
                    {items.map((it) => (
                      <p key={it.id}>{it.product.name} &middot; {it.selectedColor.name} &middot; Size {it.selectedSize} x{it.quantity} — ${(it.product.price * it.quantity).toFixed(2)}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
