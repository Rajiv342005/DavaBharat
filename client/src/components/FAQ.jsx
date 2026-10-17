import { useState } from "react";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add medicines to your cart, sign in, enter your delivery address and place the order.",
  },
  {
    q: "What payment methods are available?",
    a: "Currently only Cash on Delivery is available.",
  },
  {
    q: "Can I cancel an order?",
    a: "Yes. You can cancel an order from My orders as long as it is still in the Placed status.",
  },
  {
    q: "Do I need a prescription?",
    a: "This is a demo project and does not process prescriptions. A real pharmacy must verify a valid prescription for prescription-only medicines.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line bg-white">
      {faqs.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold"
          >
            {item.q}
            <span className="ml-4 text-xl text-brand">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-5 pb-5 text-ink/70">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}