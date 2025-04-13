import Image from "next/image";
import RecentCustomersWidget from '@/components/RecentCustomersWidget'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Torvtak Vedlikehold
          </h1>
          <p className="text-gray-600 mb-6">
            Administrer dine kunder og vedlikeholdsabonnement for torvtak enkelt og effektivt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Kunder</h2>
              <p className="text-gray-600">Administrer kundeinformasjon og kontakter</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Abonnement</h2>
              <p className="text-gray-600">Håndter vedlikeholdsavtaler og tjenester</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Inspeksjoner</h2>
              <p className="text-gray-600">Planlegg og følg opp takinspeksjoner</p>
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kommende Inspeksjoner</h2>
          <div className="border rounded-lg divide-y">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Olsen Familie</h3>
                  <p className="text-sm text-gray-600">Bergveien 12, 5003 Bergen</p>
                </div>
                <span className="text-green-600 text-sm">15. Mai 2024</span>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Hansen Eiendom AS</h3>
                  <p className="text-sm text-gray-600">Fjordgata 8, 5006 Bergen</p>
                </div>
                <span className="text-green-600 text-sm">20. Mai 2024</span>
              </div>
            </div>
          </div>
        </section>
        <RecentCustomersWidget />
      </div>
    </div>
  );
}
