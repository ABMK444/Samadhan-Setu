import { useState } from "react";
import { Upload, X } from "lucide-react";
import type { ChallengeAttachment } from "../types";
import { uid } from "../services/storage";
// TODO UPLOAD API: send File objects to signed object-storage URLs. These capped
// data URLs persist selected demo files across refresh; nothing leaves the browser.
// Files are capped at 500 KB each and 1.5 MB per form to protect localStorage.
export function ImageUpload({
  value,
  onChange,
  documents = false,
}: {
  value: ChallengeAttachment[];
  onChange: (files: ChallengeAttachment[]) => void;
  documents?: boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function add(files: FileList | null) {
    if (!files) return;
    setError("");
    setBusy(true);
    try {
      const added: ChallengeAttachment[] = [];
      let total = value.reduce((n, f) => n + f.size, 0);
      for (const file of Array.from(files)) {
        const allowed = [
          "image/jpeg",
          "image/png",
          "image/webp",
          ...(documents
            ? [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]
            : []),
        ];
        if (!allowed.includes(file.type))
          throw Error(
            `Unsupported type: ${file.name}. Use JPG, PNG, WebP${documents ? ", PDF or Word" : ""}.`,
          );
        total += file.size;
        if (file.size > 500000 || total > 1500000)
          throw Error(
            "Use files under 500 KB each, with a total below 1.5 MB per form.",
          );
        const url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(Error("Could not read file."));
          reader.readAsDataURL(file);
        });
        added.push({
          id: uid("FILE"),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          alt: file.name,
        });
      }
      onChange([...value, ...added]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wide">
      <label
        className="upload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) void add(e.dataTransfer.files);
        }}
      >
        <Upload size={24} />
        <strong>
          {busy
            ? "Reading files…"
            : documents
              ? "Add images or documents"
              : "Add photographs"}
        </strong>
        <span>Choose files or drag here · 500 KB per file</span>
        <input
          type="file"
          multiple
          disabled={busy}
          accept={
            documents
              ? ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
              : ".jpg,.jpeg,.png,.webp"
          }
          onChange={(e) => {
            void add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div className="attachments">
        {value.map((f) => (
          <div className="attachment" key={f.id}>
            {f.type.startsWith("image/") && <img src={f.url} alt={f.alt} />}
            <span>{f.name}</span>
            <label className="field">
              Image description
              <input
                aria-label={`Description for ${f.name}`}
                value={f.alt}
                onChange={(e) =>
                  onChange(
                    value.map((x) =>
                      x.id === f.id ? { ...x, alt: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              className="secondary"
              onClick={() => onChange(value.filter((x) => x.id !== f.id))}
            >
              <X size={14} /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Attachments({ files }: { files: ChallengeAttachment[] }) {
  return files.length ? (
    <div className="attachments">
      {files.map((f) => (
        <div className="attachment" key={f.id}>
          {f.type.startsWith("image/") && f.url && (
            <img src={f.url} alt={f.alt} />
          )}
          <span>{f.alt || f.name}</span>
          {f.url ? (
            <a href={f.url} download={f.name}>
              Download {f.name}
            </a>
          ) : (
            <span>{f.name} · preview unavailable</span>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="muted">No attachments supplied.</p>
  );
}
