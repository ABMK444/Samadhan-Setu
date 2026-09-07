import { readDB } from "./storage";

/*
 * The local database remains the website's data source.
 * This module uploads a copy to Supabase in the background.
 *
 * All local records are stored together in the payload JSON column.
 * This does not write to separate challenges/projects tables.
 */

const BACKUP_TABLE = "local_database_backups";
const CLIENT_ID_KEY = "samadhan-backup-client-id";

function getClientId(): string {
  const existing = localStorage.getItem(CLIENT_ID_KEY);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(CLIENT_ID_KEY, id);

  return id;
}

export function startSupabaseSync(): () => void {
  let stopped = false;
  let uploading = false;
  let lastUploadedSnapshot: string | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function scheduleUpload(): void {
    if (stopped) return;

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    // Combine closely spaced changes into one upload.
    timer = setTimeout(() => {
      timer = undefined;
      void uploadLatest();
    }, 1000);
  }

  async function uploadLatest(): Promise<void> {
    if (stopped || uploading || !navigator.onLine) {
      return;
    }

    uploading = true;
    let succeeded = false;

    try {
      const snapshot = JSON.stringify(readDB());

      // Avoid uploading the same data repeatedly.
      if (snapshot === lastUploadedSnapshot) {
        return;
      }

      /*
       * Import inside this try block so a Supabase configuration
       * error does not prevent the local website from opening.
       */
      const { supabase } = await import("./supabaseclient");

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      let ownerId = sessionData.session?.user.id;

      // This session is separate from the portal's mock login.
      if (!ownerId) {
        const {
          data: signInData,
          error: signInError,
        } = await supabase.auth.signInAnonymously();

        if (signInError) {
          throw signInError;
        }

        ownerId = signInData.user?.id;
      }

      if (!ownerId) {
        throw new Error("Could not establish a backup session.");
      }

      if (stopped) return;

      const { error } = await supabase
        .from(BACKUP_TABLE)
        .upsert(
          {
            owner_id: ownerId,
            client_id: getClientId(),
            payload: JSON.parse(snapshot),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "owner_id,client_id",
          },
        );

      if (error) {
        throw error;
      }

      lastUploadedSnapshot = snapshot;
      succeeded = true;

      console.info(
        "[Supabase backup] Local database copied successfully.",
      );
    } catch (error) {
      console.warn(
        "[Supabase backup] Upload failed. Your local data is " +
          "still saved. The backup will retry.",
        error,
      );
    } finally {
      uploading = false;

      // Catch changes that happened while the upload was running.
      if (succeeded && !stopped) {
        scheduleUpload();
      }
    }
  }

  // The original storage.ts emits this after local database edits.
  window.addEventListener("samadhan-change", scheduleUpload);

  // Also notice edits from other tabs and restored connectivity.
  window.addEventListener("storage", scheduleUpload);
  window.addEventListener("online", scheduleUpload);

  // Retry failures while the website remains open.
  const retryTimer = setInterval(() => {
    void uploadLatest();
  }, 30000);

  // Upload existing local data when the website opens.
  scheduleUpload();

  // Cleanup for Vite hot reload.
  return () => {
    stopped = true;

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    clearInterval(retryTimer);

    window.removeEventListener(
      "samadhan-change",
      scheduleUpload,
    );
    window.removeEventListener("storage", scheduleUpload);
    window.removeEventListener("online", scheduleUpload);
  };
}