import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/store/session";

export function PrivacyScreen() {
  const setStep = useSession((s) => s.setStep);
  return (
    <Shell title="Privasi" onBack={() => setStep("landing")}>
      <article className="space-y-3 rounded-3xl bg-white/80 p-5 text-sm leading-relaxed text-ink-soft">
        <p>
          Snapie memproses foto sepenuhnya di browser perangkatmu. Kami tidak
          mengunggah foto, tidak membuat akun, dan tidak menyimpan hasil sesi
          ke server.
        </p>
        <p>
          Stream kamera dihentikan setelah sesi selesai. Berkas yang kamu unduh
          tersimpan hanya di perangkatmu.
        </p>
        <p>
          Analitik (jika aktif) hanya mencatat peristiwa seperti tombol diklik
          atau layout dipilih — tanpa gambar, tanpa wajah, tanpa data biometrik.
        </p>
      </article>
      <Button className="mt-6 w-full" onClick={() => setStep("landing")}>
        Mengerti
      </Button>
    </Shell>
  );
}
