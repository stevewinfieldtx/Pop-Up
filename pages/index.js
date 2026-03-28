import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const SCENES = {
  loaves: {
    label: '🐟 Loaves & Fishes',
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing the miracle of loaves and fishes. Center stage: Jesus figure cut from cardstock standing upright perpendicular to the open book pages, arms raised, surrounded by crowd figures on accordion-fold tabs at varying heights. Foreground: fish and bread loaves on folded paper platforms. Background arch: rolling hills die-cut from layered cardstock in receding greens and blues. Golden rays fan out from a foil sun. Paper engineering style, highly detailed paper craft, studio photography lighting, white book pages visible, sharp shadows showing true 3D depth, Hallmark pop-up book quality",
    caption: 'He took the five loaves and two fish, looked up to heaven, gave thanks — and all were fed.',
    reference: 'Matthew 14:13–21'
  },
  david: {
    label: '⭐ David & Goliath',
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing David facing Goliath. Giant Goliath figure cut from thick cardstock stands tall on the right, accordion-folded legs giving true 3D height. Small David figure on the left holds a sling cut from thin paper. Valley of Elah landscape rises in layered die-cut cardstock hills behind them, armies on each side on folded tabs. Paper engineering style, intricate paper craft construction, studio photography lighting, white book pages visible at base, dramatic shadows showing real 3D depth, Hallmark pop-up book quality",
    caption: 'The LORD does not look at outward appearance — He looks at the heart.',
    reference: '1 Samuel 17'
  },
  noah: {
    label: "🕊 Noah's Ark",
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing Noah's Ark. The great ark rises from the center fold as a tall 3D paper structure with accordion sides, animals pairs visible in cutout windows. Waves made of layered blue cardstock ripple outward in concentric arcs. A rainbow arch of multicolor paper strips spans the full spread. Dove figure on a tab in the foreground holds an olive branch. Clouds of white tissue paper float above. Paper engineering style, intricate paper craft, studio photography lighting, white page base visible, dramatic shadows showing true 3D depth, Hallmark pop-up book quality",
    caption: 'And the dove returned with an olive branch — and Noah knew the waters had receded.',
    reference: 'Genesis 8'
  },
  nativity: {
    label: '✨ The Nativity',
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing the nativity. A stable structure of folded cardstock rises from the center with a star cutout at the peak letting light through. Mary and Joseph figures stand on accordion tabs flanking a manger with baby Jesus. Shepherds and wise men on angled side tabs at different depths. Sheep cut from white fuzzy paper in the foreground. A comet-shaped star of Bethlehem in gold foil paper hangs above. Paper engineering style, intricate paper craft construction, warm candlelight photography, white page base, dramatic shadows showing true 3D depth, Hallmark pop-up book quality",
    caption: 'For unto us a child is born — and his name shall be called Wonderful.',
    reference: 'Luke 2:1–20'
  },
  jonah: {
    label: '🐋 Jonah & the Whale',
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing Jonah and the whale. A massive whale rises from the center fold as a 3D paper sculpture, mouth open wide with Jonah figure visible inside on a tab. Ocean waves of layered blue and turquoise cardstock roll in from all sides at different heights. Seagulls cut from white paper on thin wire tabs float above. A distant shoreline of layered paper rises in the background. Water spray from white tissue paper at the whale's base. Paper engineering style, intricate paper craft, studio photography lighting, white page base visible, deep shadows showing true 3D depth, Hallmark pop-up book quality",
    caption: 'From inside the fish, Jonah prayed — and the LORD commanded the fish to release him.',
    reference: 'Jonah 2'
  },
  creation: {
    label: '🌍 The Creation',
    prompt: "A stunning 3D paper pop-up book spread photographed at eye level, showing the seven days of creation. From the center fold rises a layered paper world: sun and moon on opposing accordion arms, a paper tree of life in the center with die-cut leaves, animals on tiered cardstock platforms at different depths, birds on wire tabs in the upper space, fish in rippled blue paper waves below. Stars punched as holes in a dark blue paper sky arch overhead. Paper engineering style, intricate paper craft construction, golden studio lighting, white page base visible, dramatic shadows showing true 3D depth, Hallmark pop-up book quality",
    caption: 'And God saw everything that He had made — and it was very good.',
    reference: 'Genesis 1'
  }
}

const MODELS = [
  { id: 'runware:100@1', label: 'FLUX.1 Dev', desc: 'Best quality, ~15s' },
  { id: 'runware:5@1', label: 'FLUX.1 Schnell', desc: 'Fastest, ~4s' },
  { id: 'civitai:618692@691639', label: 'Juggernaut Pro FLUX', desc: 'Rich detail, ~20s' }
]

const ASPECTS = [
  { id: '1344x768', label: 'Landscape 16:9', desc: 'Wide book spread' },
  { id: '1024x768', label: 'Landscape 4:3', desc: 'Book spread' },
  { id: '768x1024', label: 'Portrait 3:4', desc: 'Single page' }
]

const STYLES = [
  { id: 'hallmark', label: 'Hallmark Classic', mod: '' },
  { id: 'japanese', label: 'Japanese Washi', mod: ', Japanese washi paper texture, muted earth tones, minimalist paper craft' },
  { id: 'bright', label: 'Bright & Vivid', mod: ', primary colors, bold outlines, saturated cardstock, children\'s toy aesthetic' },
  { id: 'gold', label: 'Gold & Ivory', mod: ', ivory paper, gold foil accents, embossed details, luxury stationery aesthetic' }
]

export default function Home() {
  const [sceneKey, setSceneKey] = useState('loaves')
  const [customPrompt, setCustomPrompt] = useState(SCENES.loaves.prompt)
  const [negPrompt, setNegPrompt] = useState('flat illustration, 2D, digital art, painting, drawing, cartoon, anime, blurry, watercolor, dark, scary, photorealistic people, modern, ugly, distorted, watermark')
  const [caption, setCaption] = useState(SCENES.loaves.caption)
  const [model, setModel] = useState('runware:100@1')
  const [aspect, setAspect] = useState('1344x768')
  const [styleId, setStyleId] = useState('hallmark')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(null)

  function selectScene(key) {
    setSceneKey(key)
    const stylemod = STYLES.find(s => s.id === styleId)?.mod || ''
    setCustomPrompt(SCENES[key].prompt + stylemod)
    setCaption(SCENES[key].caption)
    setImageUrl(null)
    setError(null)
  }

  function selectStyle(id) {
    setStyleId(id)
    const stylemod = STYLES.find(s => s.id === id)?.mod || ''
    setCustomPrompt(SCENES[sceneKey].prompt + stylemod)
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
          steps: model.includes('schnell') ? 4 : 30,
          CFGScale: 4.5,
          outputType: ['URL'],
          outputFormat: 'PNG'
        }])
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || data?.message || `API error ${res.status}`)

      const imgResult = data?.data?.find(d => d.imageURL)
      if (!imgResult?.imageURL) throw new Error('No image returned. ' + JSON.stringify(data).slice(0, 200))

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
        <meta name="description" content="Generate 3D paper pop-up book pages for biblical stories" />
      </Head>

      <header className={styles.header}>
        <h1>✦ Pop-Up Book Generator ✦</h1>
        <p>3D Paper Engineering · Runware · FLUX · Biblical Stories</p>
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
            <div className={styles.cardTitle}>Paper Style</div>
            <div className={styles.styleGrid}>
              {STYLES.map(s => (
                <button
                  key={s.id}
                  className={`${styles.styleBtn} ${styleId === s.id ? styles.styleBtnActive : ''}`}
                  onClick={() => selectStyle(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Scene Prompt</div>
            <textarea
              className={styles.textarea}
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={6}
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
            <label className={styles.label}>Format</label>
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

          <button className={styles.generateBtn} onClick={generate} disabled={loading}>
            {loading ? '✦ Generating...' : '✦ Generate Pop-Up Page ✦'}
          </button>
        </div>

        <div className={styles.result}>
          <div className={styles.bookWrap}>
            {!imageUrl && !loading && !error && (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>📖</div>
                <p>Your pop-up page will appear here</p>
                <p className={styles.placeholderSub}>3D paper engineering style</p>
              </div>
            )}
            {loading && (
              <div className={styles.placeholder}>
                <div className={styles.spinner} />
                <p>Folding your scene...</p>
                <p className={styles.placeholderSub}>FLUX is crafting the paper</p>
              </div>
            )}
            {error && <div className={styles.errorBox}><p>⚠ {error}</p></div>}
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
