import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react'
import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [base64, setBase64] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const base64Encode = (ev: HTMLInputElement) => {
    setError(null)
    if (ev?.files && ev?.files[0]) {
      const f: File = ev?.files[0]
      setFilename(f.name)
      if (!f.type.startsWith("image")) {
        setBase64(null)
        setError(`${f.type} er ikke et støttet filformat :(`)
        return
      }
      const prefix = `![alt tekst](data:${f.type};base64,`
      const suffix = ")"
      f.arrayBuffer().then(buff => {
        let array = new Uint8Array(buff);
        setBase64(prefix+Buffer.from(array).toString("base64")+suffix);
      })
    }
  } 

  const copyToClipboard = () => {
    if (base64 !== null) { 
      navigator.clipboard.writeText(base64)
    }
  }

  return (
    <section className="flex flex-col min-h-screen gap-4 p-8 bg-purple-50">
      <Head>
        <title>Konvertering av bilder til Markdown-bilde</title>
      </Head>
      <Heading level="1" size="large">Konvertering av bilder til Markdown-bilde</Heading>
      <div>
        <label htmlFor="filTilKonvertering" className="navds-button navds-button--primary navds-button--medium">
          <span className="navds-label">Last inn bilde</span>
        </label>
        <input className="hidden" type="file" id="filTilKonvertering" onChange={(ev) => base64Encode(ev.target)} />
      </div>
      { filename &&
          <BodyShort>Produserer Markdown-bildekode av &quot;{filename}&quot;:</BodyShort> 
      }
      { error && 
        <div className="max-w-2xl">
          <Alert variant="error">{error}</Alert>
        </div>
      }
      { base64 && 
      <div>
        <div className="max-w-2xl overflow-auto">
          <pre>{base64}</pre>
        </div>
          <Button variant="secondary" onClick={() => copyToClipboard()}>Kopiér Markdown</Button>
          <BodyShort>PS: Husk å endre alt tekst til noe representativt :)</BodyShort>
      </div>
      }
    </section>
  )
}
