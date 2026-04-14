"use client";

import AppShell from "@/components/AppShell";
import AIAssistant from "@/components/AIAssistant";

export default function AIAssistantPage() {
  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-sm text-slate-600 mt-2">
          Use the chat widget (bottom-right). This page exists for legacy links like <code>/AIAssistant</code>.
        </p>
      </div>
      <AIAssistant defaultOpen />
    </AppShell>
  );
}

