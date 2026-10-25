export type FeedbackLinkDraft = {
  orderNumber: string;
  email: string;
  customerName: string;
  url: string;
  message: string;
  deliveredAt: string;
  status: string;
};

export type PublicFeedbackForm = {
  orderNumber: string;
  customerName: string;
  products: string[];
  submitted: boolean;
};

export type PublicProductFeedback = {
  id: string;
  customerName: string;
  body: string;
  dateLabel: string;
  imageIds: string[];
};

export type ListFeedbackRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  body: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED";
  createdAt: string;
  decidedAt: string | null;
  products: Array<{ name: string; slug: string }>;
  imageIds: string[];
};
