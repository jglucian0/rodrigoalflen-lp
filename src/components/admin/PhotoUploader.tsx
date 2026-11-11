"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";

const MAX_MB = 40;
const CONCURRENCY = 3;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

type Status = "wait" | "upload" | "process" | "done" | "error";

interface Item {
  id: number;
  name: string;
  status: Status;
  progress: number;
  error?: string;
}

const LABEL: Record<Status, string> = {
  wait: "Na fila",
  upload: "Enviando",
  process: "Processando",
  done: "Pronta",
  error: "Erro",
};

/** PUT direto no R2, com progresso (fetch ainda não mede envio) */
function putFile(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Falha no envio (${xhr.status}).`));
    xhr.onerror = () =>
      reject(new Error("Falha de conexão no envio. Confira o CORS do bucket."));
    xhr.send(file);
  });
}

const post = (url: string, body: unknown) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export default function PhotoUploader({ galleryId }: { galleryId: string }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const nextId = useRef(0);

  // Avisa se tentar fechar a aba no meio do envio
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const patch = (id: number, change: Partial<Item>) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...change } : i)),
    );

  const uploadOne = async (id: number, file: File) => {
    try {
      patch(id, { status: "upload", progress: 0 });

      const signRes = await post(
        `/api/admin/galerias/${galleryId}/fotos/sign`,
        {
          filename: file.name,
          contentType: file.type,
          size: file.size,
        },
      );
      const sign = await signRes.json().catch(() => ({}));
      if (!signRes.ok)
        throw new Error(sign.error ?? "Não foi possível iniciar o envio.");

      await putFile(sign.uploadUrl, file, (progress) =>
        patch(id, { progress }),
      );

      patch(id, { status: "process", progress: 1 });
      const res = await post(`/api/admin/galerias/${galleryId}/fotos/process`, {
        key: sign.key,
        filename: file.name,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.error ?? "Não foi possível processar a foto.");

      patch(id, { status: "done" });
    } catch (error) {
      patch(id, {
        status: "error",
        error: error instanceof Error ? error.message : "Erro inesperado.",
      });
    }
  };

  const start = async (list: FileList | File[]) => {
    if (busy) return;

    // Ordem natural pelo nome, para as fotos entrarem na sequência certa
    const files = Array.from(list).sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { numeric: true }),
    );

    const queued: { id: number; file: File }[] = [];
    const added: Item[] = [];

    for (const file of files) {
      const id = nextId.current++;
      let error: string | undefined;

      if (!ACCEPT.includes(file.type))
        error = "Formato não aceito (use JPG, PNG ou WebP).";
      else if (file.size > MAX_MB * 1024 * 1024)
        error = `Passa de ${MAX_MB} MB.`;

      if (error) {
        added.push({
          id,
          name: file.name,
          status: "error",
          progress: 0,
          error,
        });
      } else {
        added.push({ id, name: file.name, status: "wait", progress: 0 });
        queued.push({ id, file });
      }
    }

    setItems((prev) => [...prev, ...added]);
    if (queued.length === 0) return;

    setBusy(true);
    let cursor = 0;
    const worker = async () => {
      while (cursor < queued.length) {
        const job = queued[cursor++];
        await uploadOne(job.id, job.file);
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, queued.length) }, worker),
    );
    setBusy(false);
    router.refresh(); // mostra as fotos novas na grade
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) start(e.dataTransfer.files);
  };

  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "error").length;

  return (
    <div>
      <label
        className={`adm-drop ${dragging ? "is-over" : ""} ${busy ? "is-busy" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          multiple
          accept={ACCEPT.join(",")}
          disabled={busy}
          onChange={(e) => {
            if (e.target.files?.length) start(e.target.files);
            e.target.value = ""; // permite escolher os mesmos arquivos de novo
          }}
        />
        <strong>
          {busy ? "Enviando…" : "Arraste as fotos aqui ou clique para escolher"}
        </strong>
        <small>
          JPG, PNG ou WebP · até {MAX_MB} MB cada · envie quantas quiser de uma
          vez
        </small>
      </label>

      {items.length > 0 && (
        <div className="adm-queue">
          <div className="adm-queue__head">
            <span>
              {done} de {items.length} enviadas
              {failed > 0 && ` · ${failed} com erro`}
            </span>
            {!busy && (
              <button
                type="button"
                className="auth__link"
                onClick={() => setItems([])}
              >
                Limpar lista
              </button>
            )}
          </div>
          <ul>
            {items.map((item) => (
              <li key={item.id} className={`adm-queue__item is-${item.status}`}>
                <span className="adm-queue__name">{item.name}</span>
                <span className="adm-queue__state">
                  {item.error ?? LABEL[item.status]}
                </span>
                {item.status === "upload" && (
                  <span
                    className="adm-queue__bar"
                    style={{ width: `${Math.round(item.progress * 100)}%` }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
