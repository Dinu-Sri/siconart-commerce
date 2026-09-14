"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotalCents: number;
  discountCode: string | null;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  paymentProvider: string | null;
  paymentRef: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: { name: string | null; email: string; phone: string | null } | null;
  items: Array<{ id: string; sku: string; name: string; quantity: number; unitCents: number; totalCents: number }>;
  shippingAddress: Address | null;
  billingAddress: Address | null;
};

type Address = {
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
  phone: string | null;
};

export function AdminOrders({
  orders,
  deleteOrder
}: {
  orders: Order[];
  deleteOrder: (formData: FormData) => void;
}) {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-[0.5rem] border bg-surface">
        {orders.length === 0 && <p className="p-5 text-muted-foreground">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="grid gap-4 border-b p-5 last:border-0 lg:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_auto] lg:items-center">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{order.email}</p>
            </div>
            <div className="text-sm">
              <p>{order.status}</p>
              <p className="text-muted-foreground">{order.paymentStatus}</p>
            </div>
            <p className="font-semibold">{money(order.totalCents, order.currency)}</p>
            <p className="text-sm text-muted-foreground">{order.items.length} item{order.items.length === 1 ? "" : "s"}</p>
            <Button type="button" variant="secondary" onClick={() => setSelected(order)}>
              View details
            </Button>
          </div>
        ))}
      </div>

      {selected && <OrderDetails order={selected} deleteOrder={deleteOrder} onClose={() => setSelected(null)} />}
    </>
  );
}

function OrderDetails({ order, deleteOrder, onClose }: { order: Order; deleteOrder: (formData: FormData) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/45 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="order-details-title">
      <div className="mx-auto my-4 max-w-3xl rounded-[0.75rem] border bg-background p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
          <div>
            <p className="eyebrow">Order details</p>
            <h2 id="order-details-title" className="mt-2 font-serif text-3xl font-semibold">{order.orderNumber}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Placed {dateTime(order.createdAt)}</p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DetailGroup title="Order status">
            <Detail label="Fulfilment" value={order.status} />
            <Detail label="Payment" value={order.paymentStatus} />
            <Detail label="Payment provider" value={order.paymentProvider || "Not recorded"} />
            <Detail label="Payment reference" value={order.paymentRef || "Not recorded"} />
            <Detail label="Last updated" value={dateTime(order.updatedAt)} />
          </DetailGroup>
          <DetailGroup title="Customer">
            <Detail label="Email" value={order.email} />
            <Detail label="Name" value={order.customer?.name || order.shippingAddress?.name || "Not recorded"} />
            <Detail label="Phone" value={order.customer?.phone || order.shippingAddress?.phone || "Not recorded"} />
          </DetailGroup>
          <DetailGroup title="Shipping address">
            {order.shippingAddress ? <AddressDetails address={order.shippingAddress} /> : <p className="text-sm text-muted-foreground">Not recorded</p>}
          </DetailGroup>
          <DetailGroup title="Order total">
            <Detail label="Subtotal" value={money(order.subtotalCents, order.currency)} />
            <Detail label="Discount" value={`${order.discountCents ? "-" : ""}${money(order.discountCents, order.currency)}${order.discountCode ? ` (${order.discountCode})` : ""}`} />
            <Detail label="Shipping" value={money(order.shippingCents, order.currency)} />
            <Detail label="Tax" value={money(order.taxCents, order.currency)} />
            <Detail label="Total" value={money(order.totalCents, order.currency)} strong />
          </DetailGroup>
        </div>

        <section className="mt-6 border-t pt-6">
          <h3 className="font-serif text-xl font-semibold">Items</h3>
          <div className="mt-3 overflow-hidden rounded-[0.5rem] border">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-2 border-b p-4 text-sm last:border-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5">
                <div><p className="font-semibold">{item.name}</p><p className="text-muted-foreground">SKU: {item.sku}</p></div>
                <p>Qty: {item.quantity} × {money(item.unitCents, order.currency)}</p>
                <p className="font-semibold">{money(item.totalCents, order.currency)}</p>
              </div>
            ))}
          </div>
        </section>

        {order.notes && <DetailGroup title="Notes" className="mt-6"><p className="text-sm leading-6 text-muted-foreground">{order.notes}</p></DetailGroup>}

        <form
          action={deleteOrder}
          onSubmit={(event) => {
            if (!window.confirm(`Permanently delete ${order.orderNumber}? This cannot be undone.`)) event.preventDefault();
          }}
          className="mt-7 flex flex-wrap justify-between gap-3 border-t pt-5"
        >
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Delete only unwanted test or duplicate orders. This permanently removes the order, its items, and saved addresses.</p>
          <input type="hidden" name="orderId" value={order.id} />
          <Button type="submit" variant="secondary" className="border-red-300 text-red-700 hover:bg-red-50">Delete order</Button>
        </form>
      </div>
    </div>
  );
}

function DetailGroup({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={className}><h3 className="font-serif text-xl font-semibold">{title}</h3><div className="mt-3 grid gap-2">{children}</div></section>;
}

function Detail({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">{label}</span><span className={strong ? "font-semibold" : "text-right"}>{value}</span></div>;
}

function AddressDetails({ address }: { address: Address }) {
  return <p className="text-sm leading-6 text-muted-foreground">{[address.name, address.line1, address.line2, [address.city, address.region, address.postalCode].filter(Boolean).join(", "), address.country, address.phone].filter(Boolean).map((line) => <span key={line} className="block">{line}</span>)}</p>;
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function dateTime(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
