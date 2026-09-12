"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";
import api from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

type PortfolioItem = { id: string; title: string; category: string; imageUrl: string; altText: string | null; description: string | null; displayOrder: number; published: boolean };

export default function PortfolioPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get<{ items: PortfolioItem[] }>("/api/admin/portfolio").then(({ data }) => setItems(data.items)).catch(() => setError("Could not load the portfolio."));

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else load();
  }, [router]);

  async function uploadImage(selectedFile: File | null, fallbackUrl: string) {
    if (!selectedFile) return fallbackUrl;
    const upload = new FormData();
    upload.append("image", selectedFile);
    const response = await api.post<{ imageUrl: string }>("/api/uploads/portfolio", upload);
    return response.data.imageUrl;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const imageUrl = await uploadImage(file, String(form.get("imageUrl") || "").trim());
      await api.post("/api/admin/portfolio", {
        title: form.get("title"), category: form.get("category"), imageUrl,
        altText: form.get("altText"), description: form.get("description"),
        displayOrder: Number(form.get("displayOrder") || 0), published: form.get("published") === "on",
      });
      formElement.reset();
      setFile(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save the portfolio image.");
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const enteredImageUrl = String(form.get("imageUrl") || "").trim();
      const imageUrl = await uploadImage(editingFile, enteredImageUrl || editingItem.imageUrl);
      await api.patch(`/api/admin/portfolio/${editingItem.id}`, {
        title: form.get("title"), category: form.get("category"), imageUrl,
        altText: form.get("altText"), description: form.get("description"),
        displayOrder: Number(form.get("displayOrder") || 0), published: form.get("published") === "on",
      });
      setEditingItem(null);
      setEditingFile(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not update the portfolio image.");
    } finally {
      setSaving(false);
    }
  }

  return <AdminShell>
    <div className="page-header"><h1>Portfolio gallery</h1><p>Add, edit and publish images that appear on the customer photography website.</p></div>
    {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}
    <form onSubmit={submit} className="form-card form-grid mb-8">
      <div className="form-field"><label>Title</label><input required name="title" placeholder="Golden hour portraits" /></div>
      <div className="form-field"><label>Category</label><input required name="category" placeholder="Portraits" /></div>
      <div className="form-field"><label>Upload image</label><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div>
      <div className="form-field"><label>Or image URL</label><input name="imageUrl" type="url" placeholder="https://..." /></div>
      <div className="form-field"><label>Alt text</label><input name="altText" placeholder="Portrait at sunset" /></div>
      <div className="form-field"><label>Display order</label><input name="displayOrder" type="number" defaultValue={0} /></div>
      <div className="form-field"><label>Description</label><textarea name="description" /></div>
      <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="published" defaultChecked /> Published on customer website</label>
      <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Add to portfolio"}</button>
    </form>

    {editingItem && <form onSubmit={updateItem} className="form-card form-grid mb-8 border border-amber-400/40">
      <div className="col-span-full flex items-center justify-between gap-4"><div><h2 className="text-lg font-medium text-white">Edit portfolio image</h2><p className="text-sm text-zinc-400">Update the image details, or replace the image if needed.</p></div><button type="button" className="btn-secondary" onClick={() => { setEditingItem(null); setEditingFile(null); }}>Cancel</button></div>
      <div className="form-field"><label>Title</label><input required name="title" defaultValue={editingItem.title} /></div>
      <div className="form-field"><label>Category</label><input required name="category" defaultValue={editingItem.category} /></div>
      <div className="form-field"><label>Replace image</label><input type="file" accept="image/*" onChange={(event) => setEditingFile(event.target.files?.[0] || null)} /></div>
      <div className="form-field"><label>Or image URL</label><input name="imageUrl" type="url" defaultValue={editingItem.imageUrl} /></div>
      <div className="form-field"><label>Alt text</label><input name="altText" defaultValue={editingItem.altText || ""} /></div>
      <div className="form-field"><label>Display order</label><input name="displayOrder" type="number" defaultValue={editingItem.displayOrder} /></div>
      <div className="form-field"><label>Description</label><textarea name="description" defaultValue={editingItem.description || ""} /></div>
      <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="published" defaultChecked={editingItem.published} /> Published on customer website</label>
      <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
    </form>}

    <div className="page-grid page-grid-3">{items.map((item) => <article key={item.id} className="dashboard-card overflow-hidden p-0"><img src={resolveMediaUrl(item.imageUrl)} alt={item.altText || item.title} className="h-44 w-full object-cover" /><div className="p-4"><p className="text-xs uppercase tracking-wider text-zinc-500">{item.category}</p><h2 className="mt-1 font-medium text-white">{item.title}</h2>{item.description && <p className="mt-2 text-sm text-zinc-400">{item.description}</p>}<div className="mt-4 flex gap-2"><button className="btn-secondary" onClick={() => { setEditingItem(item); setEditingFile(null); setError(""); }}>Edit</button><button className="btn-secondary" onClick={async () => { try { await api.delete(`/api/admin/portfolio/${item.id}`); load(); } catch { setError("Could not remove the portfolio image."); } }}>Remove</button></div></div></article>)}</div>
  </AdminShell>;
}
