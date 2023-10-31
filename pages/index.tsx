import { Accordion, Alert, BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react'
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
      <div className="max-w-lg flex flex-col gap-4">
      <Accordion>
        <Accordion.Item>
        <Accordion.Header>Formål for tjenesten</Accordion.Header>
        <Accordion.Content>
          <div className="flex flex-col gap-4">
          <BodyLong>
            I visse områder som Metabase er det noen ganger ønsket å inkludere bilder.
            Metabase har ikke en løsning for å servere bilder, og i noen tilfeller burde bildene ikke være generelt tilgjengelige på nett.
            For å løse dette kan man integrere bildedata direkte inn i Markdown, da vil disse ressursene være tilgjengelige for de som har tilgang til dokumentet men ikke noen andre!
          </BodyLong>
          <BodyLong>
            Denne løsningen setter sikkerhet i fokus.
            Når man laster inn et bilde vil det ikke sendes over nettverk, alt av konvertering skjer direkte i nettleseren din.
            Dermed kan du med sikkerhet vite at intern data ikke sendes til tredjepart. :)
          </BodyLong>
          </div>
        </Accordion.Content>
        </Accordion.Item>
      </Accordion>

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
      </div>
    </section>
  )
}
