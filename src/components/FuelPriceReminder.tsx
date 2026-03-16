import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const DISMISSED_KEY = 'fuel_reminder_dismissed';

function getDismissedMonth(): string | null {
  return localStorage.getItem(DISMISSED_KEY);
}

function setDismissedMonth(monthKey: string) {
  localStorage.setItem(DISMISSED_KEY, monthKey);
}

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

function shouldShowReminder(): boolean {
  const now = new Date();
  if (now.getDate() < 9) return false;
  const currentMonthKey = getCurrentMonthKey();
  const dismissed = getDismissedMonth();
  return dismissed !== currentMonthKey;
}

export default function FuelPriceReminder() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShowReminder());
  }, []);

  function dismiss() {
    setDismissedMonth(getCurrentMonthKey());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm">
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Bell size={15} className="text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900">Uppdatera drivmedelspriset</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Det ar den 9:e eller senare i manaden. Kom ihag att skapa en ny prislista med uppdaterat bransletillagg.
        </p>
      </div>
      <button
        onClick={dismiss}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0 mt-0.5"
        title="Stang paminelse"
      >
        <X size={16} />
      </button>
    </div>
  );
}
