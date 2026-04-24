import type { AutomationAction } from "@/types/workflow";

export const automationActions: AutomationAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    description: "Send an email notification to an employee, manager, or HR owner.",
    params: ["to", "subject"]
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    description: "Generate an offer letter, policy document, or verification PDF.",
    params: ["template", "recipient"]
  },
  {
    id: "create_ticket",
    label: "Create IT Ticket",
    description: "Create an internal IT setup ticket for laptop, access, or tools.",
    params: ["queue", "priority"]
  },
  {
    id: "notify_slack",
    label: "Notify Slack Channel",
    description: "Send an automated update to an HR or manager channel.",
    params: ["channel", "message"]
  }
];
