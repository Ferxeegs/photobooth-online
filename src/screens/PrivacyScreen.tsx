import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/store/session";
import { Lock, EyeOff, ServerOff } from "lucide-react";

export function PrivacyScreen() {
  const setStep = useSession((s) => s.setStep);
  return (
    <Shell title="Jaminan Privasi 100%" onBack={() => setStep("landing")}>
      <div className="flex flex-col gap-4 py-2">
        <div className="rounded-3xl glass-card p-4">
          <CuteMascot expression="happy" speech="Fotomu 100% aman di HP-mu sendiri! ✨" />
        </div>

        <article className="space-y-4 rounded-3xl glass-card p-6 text-xs leading-relaxed text-purple-900/80 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <ServerOff size={18} />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">Tanpa Unggah Server</p>
              <p className="mt-0.5">
                Snapie memproses seluruh rendering foto strip di browser menggunakan HTML5 Canvas. Foto dari kameramu tidak pernah dikirim ke internet atau server mana pun.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-purple-100 pt-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
              <Lock size={18} />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">Kamera Otomatis Mati</p>
              <p className="mt-0.5">
                Stream media kamera secara otomatis dihentikan dan ditutup sepenuhnya begitu kamu selesai sesi jepretan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-purple-100 pt-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <EyeOff size={18} />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">Tanpa Data Biometrik & Akses Akun</p>
              <p className="mt-0.5">
                Tidak ada pendaftaran akun, tidak ada tracking biometrik wajah. Hasil unduhan foto strip murni tersimpan secara pribadi di penyimpanan lokal perangkatmu.
              </p>
            </div>
          </div>
        </article>

        <Button className="mt-4 w-full py-3.5 text-base" onClick={() => setStep("landing")}>
          Saya Mengerti, Kembali ke Beranda
        </Button>
      </div>
    </Shell>
  );
}
