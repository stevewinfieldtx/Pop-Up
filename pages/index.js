import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const SCENES = {
  loaves: {
    label: '🐟 Loaves & Fishes',
    prompt: "A magical children's pop-up book illustration of Jesus blessing five loaves of bread and two fish for a crowd on a hillside, painted in warm watercolor and gouache style, layered paper cutout depth, foreground figures in silhouette, middle ground crowd of people in robes, background rolling hills and blue sky, golden light, storybook illustration style, intricate paper craft layers, children's picture book aesthetic",
    caption: 'He took the five loaves and two fish, looked up to heaven, gave thanks — and all were fed.',
    reference: 'Matthew 14:13–21'
  },
  david: {
    label: '⭐ David & Goliath',
    prompt: "A magical children's pop-up book illustration of young David standing before the giant Goliath on a battlefield, sling in hand, paper cutout layered style, watercolor and gouache, foreground rocks and wildflowers, middle ground the two figures facing each other, background army banners and rolling Judean hills, golden hour light, storybook picture book aesthetic, intricate paper craft depth",
    caption: 'The LORD does not look at outward appearance — He looks at the heart.',
    reference: '1 Samuel 17'
  },
  noah: {
    label: "🕊 Noah's Ark",
    prompt: "A magical children's pop-up book illustration of Noah's Ark floating on calm waters with pairs of animals visible on deck, rainbow arching overhead, layered paper cutout style, warm watercolor and gouache, foreground gentle waves with small fish, middle ground the great wooden ark, background parting storm clouds and a full rainbow, children's storybook aesthetic",
    caption: 'And the dove returned with an olive branch — and Noah knew the waters had receded.',
    reference: 'Genesis 8'
  },
  nativity: {
    label: '✨ The Nativity',
    prompt: "A magical children's pop-up book illustration of the nativity scene in a stable, baby Jesus glowing in a manger, Mary and Joseph kneeling, star of Bethlehem blazing overhead, shepherds and wise men gathered with gifts, layered paper cutout depth, warm candlelight watercolor and gouache style, foreground hay and animals, middle ground holy family, background starry night sky, storybook picture book aesthetic",
    caption: 'For unto us a child is born — and his name shall be called Wonderful.',
    reference: 'Luke 2:1–20'
  },
  jonah: {
    label: '🐋 Jonah & the Whale',
    prompt: "A magical children's pop-up book illustration of Jonah emerging from the open mouth of a great whale beneath a bright sunny sky, dramatic ocean waves, seagulls, layered paper cutout style, vibrant watercolor and gouache, foreground ocean spray and foam, middle ground the whale surfacing, background bright blue sky and distant shore, children's storybook picture book aesthetic",
    caption: 'From inside the fish, Jonah prayed — and the LORD commanded the fish to release him.',
    reference: 'Jonah 2'
  }
}

const MODELS = [
  { id: 'runware:100@1', label: 'FLUX.1 Dev', desc: 'Best quality, ~15s' },
  { id: 'runware:5@1', label: 'FLUX.1 Schnell', desc: 'Fastest, ~4s' },
  { id: 'civitai:618692@691639', label: 'Juggernaut Pro FLUX', desc: 'Rich detail, ~20s' }
]

const ASPECTS = [
  { id: '1024x768', label: 'Landscape 4:3', desc: 'Book spread' },
  { id: '768x1024', label: 'Portrait 3:4', desc: 'Single page' },
  { id: '1024x1024', label: 'Square', desc: '1:1' }
]

export default function Home() {
  const [sceneKey, setSceneKey] = useState('loaves')
  const [customPrompt, setCustomPrompt] = useState(SCENES.loaves.prompt)
  const [negPrompt, setNegPrompt] = useState('blurry, dark, scary, photorealistic, modern clothing, photography, ugly, distorted, watermark')
  const [caption, setCaption] = useState(SCENES.loaves.caption)
  const [model, setModel] = useState('runware:100@1')
  const [aspect, setAspect] = useState('1024x768')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(null)

  function selectScene(key) {
    setSceneKey(key)
    setCustomPrompt(SCENES[key].prompt)
    setCaption(SCENES[key].caption)
    setImageUrl(null)
    setError(null)
  }

  async function generate() {
    setLoading(true)
    setError(null)
    setImageUrl(null)
    setElapsed(null)

    const [width, height] = aspect.split('x').map(Number)
    const start = Date.now()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          taskType: 'imageInference',
          taskUUID: crypto.randomUUID(),
          model,
          positivePrompt: customPrompt,
          negativePrompt: negPrompt,
          width,
          height,
          numberResults: 1,
          steps: model.includes('schnell') ? 4 : 28,
          CFGScale: 3.5,
          outputType: ['URL'],
          outputFormat: 'PNG'
        }])
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || data?.message || `API error ${res.status}`)
      }

      const imgResult = data?.data?.find(d => d.imageURL)
      if (!imgResult?.imageURL) {
        throw new Error('No image returned. ' + JSON.stringify(data).slice(0, 200))
      }

      setImageUrl(imgResult.imageURL)
      setElapsed(((Date.now() - start) / 1000).toFixed(1))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const scene = SCENES[sceneKey]

  return (
    <div className={styles.page}>
      <Head>
        <title>Pop-Up Book Generator</title>
        <meta name="description" content="Generate biblical pop-up book pages with Runware and FLUX" />
      </Head>

      <header className={styles.header}>
        <h1>✦ Pop-Up Book Generator ✦</h1>
        <p>Runware · FLUX · Biblical Stories</p>
      </header>

      <main className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Choose a Story</div>
            <div className={styles.sceneGrid}>
              {Object.entries(SCENES).map(([key, s]) => (
                <button
                  key={key}
                  className={`${styles.sceneBtn} ${sceneKey === key ? styles.sceneBtnActive : ''}`}
                  onClick={() => selectScene(key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className={styles.sceneRef}>{scene.reference}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Scene Prompt</div>
            <textarea
              className={styles.textarea}
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={5}
            />
            <label className={styles.label}>Negative Prompt</label>
            <input
              className={styles.input}
              value={negPrompt}
              onChange={e => setNegPrompt(e.target.value)}
            />
            <label className={styles.label}>Book Caption</label>
            <input
              className={styles.input}
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Generation Settings</div>
            <label className={styles.label}>Model</label>
            <div className={styles.optionGroup}>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  className={`${styles.optionBtn} ${model === m.id ? styles.optionBtnActive : ''}`}
                  onClick={() => setModel(m.id)}
                >
                  <span className={styles.optionLabel}>{m.label}</span>
                  <span className={styles.optionDesc}>{m.desc}</span>
                </button>
              ))}
            </div>
            <label className={styles.label}>Aspect Ratio</label>
            <div className={styles.optionGroup}>
              {ASPECTS.map(a => (
                <button
                  key={a.id}
                  className={`${styles.optionBtn} ${aspect === a.id ? styles.optionBtnActive : ''}`}
                  onClick={() => setAspect(a.id)}
                >
                  <span className={styles.optionLabel}>{a.label}</span>
                  <span className={styles.optionDesc}>{a.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.generateBtn}
            onClick={generate}
            disabled={loading}
          >
            {loading ? '✦ Generating...' : '✦ Generate Pop-Up Page ✦'}
          </button>
        </div>

        <div className={styles.result}>
          <div className={styles.bookWrap}>
            {!imageUrl && !loading && !error && (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>📖</div>
                <p>Your pop-up page will appear here</p>
                <p className={styles.placeholderSub}>Select a story and click Generate</p>
              </div>
            )}
            {loading && (
              <div className={styles.placeholder}>
                <div className={styles.spinner} />
                <p>Painting your scene...</p>
                <p className={styles.placeholderSub}>FLUX is working its magic</p>
              </div>
            )}
            {error && (
              <div className={styles.errorBox}>
                <p>⚠ {error}</p>
              </div>
            )}
            {imageUrl && (
              <>
                <div className={styles.bookPage}>
                  <div className={styles.spineLeft} />
                  <img src={imageUrl} alt="Generated pop-up page" className={styles.bookImg} />
                </div>
                <div className={styles.bookCaption}>
                  <p className={styles.captionText}>{caption}</p>
                  <p className={styles.captionRef}>{scene.reference}</p>
                </div>
                <div className={styles.bookMeta}>
                  {elapsed && <span>Generated in {elapsed}s</span>}
                  <span> · </span>
                  <span>{MODELS.find(m => m.id === model)?.label}</span>
                  <span> · </span>
                  <a href={imageUrl} download="popup_page.png" className={styles.downloadLink}>↓ Download</a>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
