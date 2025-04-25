// Lager modul for å holde oversikt over varer
// Viser beholdning av impregnert staur, granstaur, skier, ståltråd
'use client'

import { useEffect, useState } from 'react'
import { fetchLager, updateLager, fetchLagerHistorikk, registerLagerTransaksjon } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Typer for lager og historikk
interface LagerHistorikk {
  created_at: string;
  navn: string;
  type: string;
  antall: number;
  kommentar: string;
}

interface LagerForm {
  [key: string]: number;
}

const initialItems = [
  { name: 'Impregnert staur', key: 'impregnert_staur' },
  { name: 'Granstaur', key: 'granstaur' },
  { name: 'Skier', key: 'skier' },
  { name: 'Ståltråd', key: 'staltrad' }
]

export default function LagerPage() {
  const [lager, setLager] = useState<LagerForm>({})
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState<LagerForm>({})
  const [historikk, setHistorikk] = useState<LagerHistorikk[]>([])
  // Nytt for transaksjonsskjema
  const [transaksjon, setTransaksjon] = useState({
    key: initialItems[0].key,
    type: 'inntak',
    antall: 1,
    kommentar: ''
  })
  const [transLoading, setTransLoading] = useState(false)
  const [transError, setTransError] = useState('')

  useEffect(() => {
    const getLager = async () => {
      setLoading(true)
      const data = await fetchLager()
      setLager(data || {})
      setForm(data || {})
      setLoading(false)
    }
    const getHistorikk = async () => {
      const data = await fetchLagerHistorikk()
      setHistorikk(data || [])
    }
    getLager()
    getHistorikk()
  }, [])

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: Number(value) }))
  }

  const handleSave = async () => {
    // Finn hvilke varer som er endret
    const changedKeys = Object.keys(form).filter(key => form[key] !== lager[key]);

    await updateLager(form);
    setLager(form);
    setEdit(false);

    // Registrer manuell transaksjon for hver endret vare
    for (const key of changedKeys) {
      const gammeltAntall = lager[key] ?? 0;
      const nyttAntall = form[key] ?? 0;
      const diff = nyttAntall - gammeltAntall;
      if (diff !== 0) {
        // Finn riktig navn og lager_id fra initialItems
        const item = initialItems.find(i => i.key === key);
        if (!item) continue;
        // Hent lager_id fra Supabase
        const { data: lagerRows, error } = await fetchLager();
        // Vi antar at fetchLager returnerer et objekt med key: antall, men vi trenger id. Hvis du har en bedre mapping, bruk den.
        // Alternativt kan du hente lager_id fra en egen mapping eller fra Supabase direkte.
        // Her antar vi at registerLagerTransaksjon kan ta imot key/navn.
        await registerLagerTransaksjon({
          key,
          type: 'manuell',
          antall: diff,
          kommentar: `Manuell endring fra ${gammeltAntall} til ${nyttAntall} via rediger-knapp`
        });
      }
    }

    // Oppdater historikk etter lagring
    const hist = await fetchLagerHistorikk();
    setHistorikk(hist || []);
  }

  // Funksjon for å registrere transaksjon
  const handleTransaksjon = async (e: React.FormEvent) => {
    e.preventDefault()
    setTransLoading(true)
    setTransError('')
    try {
      // Sikre riktig type for Supabase-funksjonen
      const res = await registerLagerTransaksjon({
        ...transaksjon,
        type: transaksjon.type as 'inntak' | 'uttak'
      })
      if (res?.error) setTransError(res.error)
      // Oppdater lager og historikk
      const data = await fetchLager()
      setLager(data || {})
      setForm(data || {})
      const hist = await fetchLagerHistorikk()
      setHistorikk(hist || [])
      setTransaksjon({ ...transaksjon, antall: 1, kommentar: '' })
    } catch (err) {
      setTransError('Uventet feil ved registrering')
    } finally {
      setTransLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-white mb-2">Lagerbeholdning</h1>
        <p className="text-gray-400 mb-8">Hold oversikt, rediger og registrer transaksjoner på lageret.</p>

        {/* Lagerkort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {initialItems.map(item => (
            <Card key={item.key} className="p-6 flex flex-col items-center bg-gray-800 border border-gray-700">
              <span className="text-lg text-gray-300 mb-2">{item.name}</span>
              {edit ? (
                <input
                  type="number"
                  className="w-20 text-center rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  value={form[item.key] ?? 0}
                  onChange={e => handleChange(item.key, e.target.value)}
                  min={0}
                />
              ) : (
                <span className="text-3xl font-bold text-white">{lager[item.key] ?? 0}</span>
              )}
            </Card>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          {edit ? (
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Lagre</Button>
          ) : (
            <Button onClick={() => setEdit(true)} className="bg-gray-700 hover:bg-gray-600">Rediger</Button>
          )}
          {edit && (
            <Button onClick={() => { setEdit(false); setForm(lager) }} className="bg-gray-500 hover:bg-gray-400">Avbryt</Button>
          )}
        </div>

        

        {/* Transaksjonsskjema */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Registrer transaksjon</h2>
          <form onSubmit={handleTransaksjon} className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label className="block text-gray-300 mb-1">Vare</label>
              <select
                className="rounded bg-gray-700 text-white border border-gray-600"
                value={transaksjon.key}
                onChange={e => setTransaksjon(t => ({ ...t, key: e.target.value }))}
              >
                {initialItems.map(item => (
                  <option key={item.key} value={item.key}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Type</label>
              <select
                className="rounded bg-gray-700 text-white border border-gray-600"
                value={transaksjon.type}
                onChange={e => setTransaksjon(t => ({ ...t, type: e.target.value }))}
              >
                <option value="inntak">Inntak</option>
                <option value="uttak">Uttak</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Antall</label>
              <input
                type="number"
                className="w-24 rounded bg-gray-700 text-white border border-gray-600"
                value={transaksjon.antall}
                min={1}
                onChange={e => setTransaksjon(t => ({ ...t, antall: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">Kommentar</label>
              <input
                type="text"
                className="w-full rounded bg-gray-700 text-white border border-gray-600"
                value={transaksjon.kommentar}
                onChange={e => setTransaksjon(t => ({ ...t, kommentar: e.target.value }))}
                placeholder="Valgfritt"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={transLoading}>
              {transLoading ? 'Lagrer...' : 'Registrer'}
            </Button>
          </form>
          {transError && <p className="text-red-400 mt-2">{transError}</p>}
        </div>



        {/* Historikk */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Lagerhistorikk</h2>
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
                {historikk.map((h, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="py-2">{new Date(h.created_at).toLocaleString('nb-NO')}</td>
                    <td className="py-2">{h.navn}</td>
                    <td className="py-2">{h.type === 'inntak' ? 'Inntak' : 'Uttak'}</td>
                    <td className="py-2">{h.antall}</td>
                    <td className="py-2">{h.kommentar}</td>
                  </tr>
                ))}
                {historikk.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-500">Ingen historikk funnet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
