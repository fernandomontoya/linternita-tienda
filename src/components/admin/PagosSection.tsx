"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2 } from "lucide-react";

export interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  notes: string | null;
  paid_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  anticipo: "Anticipo",
  abono: "Abono",
  total: "Pago total",
  parcialidad: "Parcialidad",
};

const METHOD_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
};

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] bg-white";

const fmt = (p: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

export default function PagosSection({
  orderId,
  orderTotal,
  initialPayments,
}: {
  orderId: string;
  orderTotal: number;
  initialPayments: Payment[];
}) {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("abono");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split("T")[0]);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = orderTotal - totalPaid;

  const handleAdd = async () => {
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payments")
      .insert({ order_id: orderId, amount: n, payment_type: paymentType, payment_method: paymentMethod, notes: paymentNotes || null, paid_at: paidAt })
      .select("*")
      .single();

    setSaving(false);
    if (error || !data) return alert("Error al guardar el pago: " + error?.message);
    setPayments((prev) => [...prev, data]);
    setShowForm(false);
    setAmount("");
    setPaymentNotes("");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pago?")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("payments").delete().eq("id", id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Pagos recibidos</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-xs text-[#C9A84C] hover:underline">
            <Plus size={13} /> Agregar pago
          </button>
        )}
      </div>

      {/* Resumen */}
      <div className="px-5 py-3 grid grid-cols-3 gap-3 bg-gray-50/60 border-b border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Total pedido</p>
          <p className="text-sm font-bold text-gray-700">{fmt(orderTotal)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Pagado</p>
          <p className="text-sm font-bold text-green-600">{fmt(totalPaid)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Saldo pendiente</p>
          <p className={`text-sm font-bold ${balance > 0 ? "text-red-500" : "text-green-600"}`}>{fmt(Math.max(0, balance))}</p>
        </div>
      </div>

      {/* Historial */}
      {payments.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {payments.map((p) => (
            <div key={p.id} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">{TYPE_LABELS[p.payment_type] ?? p.payment_type}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{METHOD_LABELS[p.payment_method] ?? p.payment_method}</span>
                </div>
                {p.notes && <p className="text-xs text-gray-400 mt-0.5">{p.notes}</p>}
                <p className="text-[11px] text-gray-300 mt-0.5">{new Date(p.paid_at + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
              <span className="text-sm font-bold text-gray-800">{fmt(Number(p.amount))}</span>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="text-gray-200 hover:text-red-400 transition-colors">
                {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="px-5 py-4 text-xs text-gray-400">Aún no se han registrado pagos</p>
        )
      )}

      {/* Formulario inline */}
      {showForm && (
        <div className="px-5 py-4 border-t border-gray-50 space-y-3 bg-[#FAF7F2]/50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Monto *</label>
              <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className={inputCls} placeholder="0.00" autoFocus />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
              <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={inputCls}>
                <option value="anticipo">Anticipo</option>
                <option value="abono">Abono</option>
                <option value="parcialidad">Parcialidad</option>
                <option value="total">Pago total</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Método</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputCls}>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Notas (opcional)</label>
              <input value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} className={inputCls} placeholder="Ej. comprobante #123" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving || !amount}
              className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Registrar pago
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-700 border border-gray-200">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
