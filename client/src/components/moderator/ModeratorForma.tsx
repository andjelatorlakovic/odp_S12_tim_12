import { Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";

export function ModeratorForma() {


    return (
        <div className="min-h-screen bg-white">
            {/* Zaglavlje */}
            <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
                <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
                <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
            </div>

            {/* Glavni sadržaj */}
            <div className="pt-[140px] px-6">
                <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
                    Dobro dosli, moderatore!
                </h2>

                {/* Moderatorske opcije */}
                <div className="grid flex gap-6 grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Kartica: Dodaj jezik */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Dodaj novi jezik</h3>
                        <p className="text-gray-700 mb-6">
                            Dodaj nove jezike koji će biti dostupni korisnicima na platformi.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="dodaj-jezik"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Dodaj jezik
                            </Link>
                        </div>
                    </div>


                    {/* Kartica: Nivoi znanja */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Nivoi znanja</h3>
                        <p className="text-gray-700 mb-6">
                            Postavi nivoe znanja (A1, A2, B1...) za svaki jezik.
                        </p>
                        <div className="flex justify-end">
                            <button className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex flex-col justify-between h-full">
                                Uredi nivoe
                            </button>
                        </div>
                    </div>

                    {/* Kartica: Blokiraj korisnika */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Blokiraj korisnika</h3>
                        <p className="text-gray-700 mb-6">
                            Blokirani korisnici mogu samo pregledati sadržaj.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="blokiraj-korisnika"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Blokiraj korisnika
                            </Link>
                        </div>
                    </div>

                    {/* Kartica: Lista blokiranih korisnika */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Blokirani korisnici</h3>
                        <p className="text-gray-700 mb-6">
                            Pogledaj listu svih trenutno blokiranih korisnika.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="/moderator-dashboard/lista-blokiranih"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Prikaži listu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
