import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext';
import { fetchOrders, type OrderRow } from '../../lib/api';
import { PageHeader } from '../components/FormFields';

const STAT_LINKS: { label: string; to: string; count: (ctx: ReturnType<typeof useSiteContent>) => number }[] = [
  { label: 'Products', to: '/admin/products', count: (c) => c.products.length },
  { label: 'Categories', to: '/admin/categories', count: (c) => c.categories.length },
  { label: 'Promo tiles', to: '/admin/home', count: (c) => c.promoTiles.length },
  { label: 'FAQs', to: '/admin/pages', count: (c) => c.faqs.length }
];

export default function Dashboard() {
  const siteContent = useSiteContent();
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((rows) => setRecentOrders(rows.slice(0, 5)))
      .catch((err) => console.error('Failed to load recent orders:', err))
      .finally(() => setLoadingOrders(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store's content and recent activity." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {STAT_LINKS.map(({ label, to, count }) => (
          <Link key={to} to={to} className="border border-black/10 p-5 hover:border-black transition-colors">
            <div className="text-2xl font-black">{count(siteContent)}</div>
            <div className="text-[10px] font-mono tracking-wider text-black/50 uppercase mt-1">{label}</div>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">Recent inquiries</h2>
          <Link to="/admin/orders" className="text-[10px] font-mono text-black/50 hover:text-black uppercase underline">View all</Link>
        </div>

        {loadingOrders ? (
          <p className="text-xs text-black/40 font-mono">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-black/40 font-mono">No orders yet.</p>
        ) : (
          <div className="border border-black/10 divide-y divide-black/10">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold">{o.orderNumber}</span>
                  <span className="text-black/40 ml-2">{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-black/60">${o.total.toFixed(2)}</span>
                  <span className="uppercase text-[9px] tracking-wider text-black/40">{o.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
