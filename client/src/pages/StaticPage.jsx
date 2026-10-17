import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { SITE_NAME } from "../config";

const POLICY_NOTE =
  "Sample text for a demo project. Replace it with your own policy before any real use.";

const POLICY_KEYS = ["terms", "privacy", "shipping", "returns"];

const PAGES = {
  about: {
    title: `About ${SITE_NAME}`,
    sections: [
      {
        heading: "What this site is",
        text: `${SITE_NAME} is a demo online pharmacy built as a learning project. It shows how medicines can be listed, searched, added to a cart and ordered online.`,
      },
      {
        heading: "Why generic medicines",
        text: "Generic medicines contain the same active ingredient as branded ones and are usually priced lower. Always check with your doctor or pharmacist before switching a medicine.",
      },
      {
        heading: "How it is built",
        text: "The site uses React and Tailwind CSS on the frontend, and Node.js, Express and MongoDB on the backend. All medicines and prices are sample data.",
      },
    ],
  },

  contact: {
    title: "Contact us",
    sections: [
      { heading: "Email", text: "care@example.com" },
      { heading: "Phone", text: "+91 00000 00000" },
      { heading: "Support hours", text: "Monday to Saturday, 9 am to 6 pm." },
      {
        heading: "Note",
        text: "These are placeholder details. Replace them with your own before sharing the site.",
      },
    ],
  },

  terms: {
    title: "Terms and Conditions",
    note: POLICY_NOTE,
    sections: [
      {
        heading: "Using the site",
        text: "By creating an account or placing an order you agree to give correct details and to use the site only for lawful purposes.",
      },
      {
        heading: "Orders and prices",
        text: "Prices shown on the site include taxes. We may cancel an order if a product is unavailable or a price was listed by mistake.",
      },
      {
        heading: "Medical information",
        text: "Information on this site is not medical advice. Talk to a doctor or pharmacist before starting, stopping or changing any medicine.",
      },
      {
        heading: "Changes",
        text: "These terms may be updated from time to time. The latest version is always on this page.",
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    note: POLICY_NOTE,
    sections: [
      {
        heading: "What we collect",
        text: "Your name, email, phone number, delivery address and order history, so that we can run your account and deliver your orders.",
      },
      {
        heading: "How we use it",
        text: "We use your details only to create your account, process and deliver orders, and contact you about them.",
      },
      {
        heading: "Passwords",
        text: "Passwords are stored in a scrambled (hashed) form and are never saved as plain text.",
      },
      {
        heading: "Questions",
        text: "If you have a question about your data, write to us using the details on the Contact page.",
      },
    ],
  },

  shipping: {
    title: "Shipping and Delivery Policy",
    note: POLICY_NOTE,
    sections: [
      { heading: "Delivery charges", text: "Delivery is free on every order." },
      {
        heading: "Delivery time",
        text: "A real store would show its delivery estimate here, for example 3 to 5 working days. This demo does not deliver anything.",
      },
      {
        heading: "Payment on delivery",
        text: "Orders are paid in cash when they arrive. Please keep the exact amount ready.",
      },
      {
        heading: "Delivery address",
        text: "Please enter a complete address and a working phone number so that the delivery partner can reach you.",
      },
    ],
  },

  returns: {
    title: "Return, Refund and Cancellation Policy",
    note: POLICY_NOTE,
    sections: [
      {
        heading: "Cancelling an order",
        text: "You can cancel an order from My orders while it is in Placed status. Once an order has shipped it can no longer be cancelled online.",
      },
      {
        heading: "Returns",
        text: "Medicines usually cannot be returned once delivered, except if the item is damaged, expired or not what you ordered. Report this within 48 hours of delivery.",
      },
      {
        heading: "Refunds",
        text: "Because payment is Cash on Delivery, no money is taken in advance, so a cancelled order has nothing to refund.",
      },
    ],
  },
};

export default function StaticPage({ page }) {
  const { slug } = useParams();
  const key = page || (POLICY_KEYS.includes(slug) ? slug : null);
  const content = key ? PAGES[key] : null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [key]);

  if (!content) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold md:text-4xl">{content.title}</h1>

      {content.note && (
        <p className="mt-4 rounded-lg bg-saffron-light px-4 py-3 text-sm font-medium">
          {content.note}
        </p>
      )}

      <div className="mt-8 space-y-8">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold">{s.heading}</h2>
            <p className="mt-2 max-w-prose leading-relaxed text-ink/80">{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}