<script>
  import { onMount } from 'svelte'

  const STATS_URL = import.meta.env.BASE_URL + 'stats.json'

  const fmtNum = n => Math.round(n).toLocaleString('es-ES')

  function fmtFecha(iso) {
    if (!iso) return ''
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Contador animado
  function animarHasta(nodo, valor) {
    const duracion = 1200
    const inicio = performance.now()
    function tick(ahora) {
      const t = Math.min((ahora - inicio) / duracion, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      nodo.textContent = fmtNum(Math.round(valor * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  let stats = null
  let refFocos, refHa, refIncendios

  onMount(async () => {
    try {
      const r = await fetch(STATS_URL)
      stats = await r.json()
      // Pequeño delay para que se vea la animación
      setTimeout(() => {
        if (refFocos)    animarHasta(refFocos,    stats.focos_24h)
        if (refHa)       animarHasta(refHa,       stats.hectareas_2026)
        if (refIncendios) animarHasta(refIncendios, stats.incendios_2026)
      }, 200)
    } catch (e) {
      stats = null
    }
  })
</script>

<div class="cabecera">
  <div class="barra-top"></div>

  <div class="inner">
    <h1 class="titulo">Incendios en España</h1>

    {#if stats === undefined}
      <!-- cargando -->
    {:else if stats === null}
      <p class="error">No se pudieron cargar los datos.</p>
    {:else}
      <div class="cifras">
        <div class="cifra">
          <span class="num" bind:this={refFocos}>0</span>
          <span class="label">Focos activos<br>últimas 24h</span>
        </div>
        <div class="sep"></div>
        <div class="cifra">
          <span class="num" bind:this={refHa}>0</span>
          <span class="label">Hectáreas<br>quemadas en 2026</span>
        </div>
        <div class="sep"></div>
        <div class="cifra">
          <span class="num" bind:this={refIncendios}>0</span>
          <span class="label">Incendios<br>registrados en 2026</span>
        </div>
      </div>

      {#if stats.actualizado}
        <p class="actualizado">Datos actualizados el {fmtFecha(stats.actualizado)} · Fuente: Copernicus EFFIS · NASA FIRMS</p>
      {/if}
    {/if}
  </div>
</div>

<style>
  .cabecera {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .barra-top {
    height: 4px;
    background: #FF2B00;
  }

  .inner {
    padding: 28px 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }


  .titulo {
    margin: 0;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111;
    line-height: 1;
  }

  .cifras {
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  .sep {
    width: 1px;
    height: 48px;
    background: #e5e7eb;
    flex-shrink: 0;
  }

  .cifra {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .num {
    font-size: 44px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    color: #FF2B00;
    font-variant-numeric: tabular-nums;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    line-height: 1.4;
  }

  .actualizado {
    margin: 0;
    font-size: 13px;
    color: #9ca3af;
    letter-spacing: 0.01em;
    font-style: italic;
  }

  .error {
    color: #FF2B00;
    font-size: 13px;
    margin: 0;
  }

  @media (max-width: 560px) {
    .inner { padding: 20px 20px 18px; }
    .titulo { font-size: 26px; }
    .num { font-size: 34px; }
    .sep { display: none; }
    .cifras { gap: 20px; }
  }
</style>
