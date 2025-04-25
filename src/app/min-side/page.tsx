'use client'

import { useState, useRef, useEffect } from 'react'
import { fetchLagerHistorikk } from '@/lib/supabase'

interface UserProfile {
  name: string
  email: string
  role: string
  phone: string
  department: string
  profileImage: string // Added profileImage field
}

export default function MinSidePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Edgar Eidsheim',
    email: 'edgar@driftig.no',
    role: 'Driftsleder',
    phone: '+47 123 45 678',
    department: 'Drift',
    profileImage: '/images/edgar.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfile((prevProfile) => ({ ...prevProfile, profileImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Simulerer lagring av profil (kan utvides til å lagre til en database eller API)
    console.log('Profil lagret:', profile);
    setIsEditing(false);
  };

  const [lagerHistorikk, setLagerHistorikk] = useState<Array<{
    created_at: string;
    navn: string;
    type: string;
    antall: number;
    kommentar: string;
  }>>([])

  useEffect(() => {
    fetchLagerHistorikk().then(setLagerHistorikk)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Min side</h1>
            <p className="text-gray-400 mt-2">Din personlige oversikt</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Profilinformasjon</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profilbilde"
                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-12 h-12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="32" cy="32" r="30" fill="#FCD7B6" />
                      <ellipse cx="32" cy="40" rx="14" ry="10" fill="#fff" />
                      <ellipse cx="22" cy="28" rx="3" ry="4" fill="#222" />
                      <ellipse cx="42" cy="28" rx="3" ry="4" fill="#222" />
                      <rect x="22" y="44" width="20" height="6" rx="3" fill="#B07D56" />
                      <path d="M20 44c2 3 8 5 12 5s10-2 12-5" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                      <rect x="24" y="38" width="16" height="4" rx="2" fill="#222" />
                      <ellipse cx="32" cy="50" rx="6" ry="2" fill="#B07D56" />
                    </svg>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400">Navn</label>
                  <p className="mt-1 text-white">{profile.name}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Endre bilde
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">E-post</label>
                <p className="mt-1 text-white">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Telefon</label>
                <p className="mt-1 text-white">{profile.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Stilling</label>
                <p className="mt-1 text-white">{profile.role}</p>
              </div>
              <div>
                <button
                  onClick={handleSaveProfile}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Lagre profil
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Statistikk</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Antall inspeksjoner denne måneden</label>
                <p className="mt-1 text-2xl font-bold text-white">24</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Timer registrert denne måneden</label>
                <p className="mt-1 text-2xl font-bold text-white">156</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Aktive prosjekter</label>
                <p className="mt-1 text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 md:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Nylige aktiviteter</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Fullførte inspeksjon av Bygning A</p>
                  <p className="text-sm text-gray-400">2 timer siden</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Registrerte 4 timer på Prosjekt X</p>
                  <p className="text-sm text-gray-400">5 timer siden</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">Lagerhistorikk</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2">Dato</th>
                      <th className="py-2">Vare</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Antall</th>
                      <th className="py-2">Kommentar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lagerHistorikk.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-4 text-gray-500">Ingen lagerhistorikk funnet</td></tr>
                    )}
                    {lagerHistorikk.map((h, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="py-2">{new Date(h.created_at).toLocaleString('nb-NO')}</td>
                        <td className="py-2">{h.navn}</td>
                        <td className="py-2">
                          <span className={h.type === 'inntak' ? 'text-green-400' : 'text-red-400'}>
                            {h.type === 'inntak' ? 'Inntak' : 'Uttak'}
                          </span>
                        </td>
                        <td className="py-2">{h.antall}</td>
                        <td className="py-2">{h.kommentar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}