import DodajNoviJezikForma from "../../components/moderator/DodajNoviJezikForma";

export default function DodajNoviJezikStranica() {
  const handleDodajJezik = async (data: { jezik: string; nivo: string }) => {
    try {
      // 1. Prvo šaljemo POST zahtev da dodamo jezik
      const resJezik = await fetch("/api/v1/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jezik: data.jezik }), // <- koristi isto ime koje backend očekuje
      });

      if (!resJezik.ok) {
        const errorText = await resJezik.text();
        throw new Error("Greška pri dodavanju jezika: " + errorText);
      }

      const noviJezik = await resJezik.json();
      const languageId = noviJezik.id;
      console.log("Uspešno dodat jezik, ID:", languageId);

      // 2. Sada šaljemo zahtev za dodavanje nivoa za taj jezik
      const resNivo = await fetch("/api/v1/levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: languageId,
          nivo: data.nivo,
        }),
      });

      if (!resNivo.ok) {
        const errorText = await resNivo.text();
        throw new Error("Greška pri dodavanju nivoa: " + errorText);
      }

      console.log("Uspešno dodat nivo za jezik:", data.nivo);
      alert("Uspešno dodat jezik i nivo!");

    } catch (err) {
      const poruka = err instanceof Error ? err.message : "Nepoznata greška";
      alert("Došlo je do greške: " + poruka);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      <DodajNoviJezikForma onSubmit={handleDodajJezik} />
    </div>
  );
}