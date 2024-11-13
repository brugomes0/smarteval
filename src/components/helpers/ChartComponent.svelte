<script lang="ts">
    import { afterUpdate, onMount } from "svelte"
    import { Chart } from "chart.js/auto"

    export let data: { labels: string[], datasets: { label: string, data: number[] }[] }
    export let idCanvas: string
    export let innerBarText: any
    export let options: any
    export let style: string
    export let typeChart: any

    let ctx: any, myChart: any

    function renderChart() {
        if (myChart) myChart.destroy()

        setTimeout(function() {
            ctx = document.getElementById(idCanvas)
            myChart = new Chart(ctx, { type: typeChart, data: data, options: options, plugins: [innerBarText] })
        }, 600)
    }

    afterUpdate(async () => renderChart())
</script>

<canvas id={idCanvas} style={style}></canvas>