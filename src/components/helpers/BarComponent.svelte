<script lang="ts">
    export let percentage
    export let width = 160
</script>

<div class="flex h-3 rounded-lg bg-gray-300" style="width: {width}px;">
    <div class="flex rounded-lg select-none text-transparent {parseFloat(percentage) == 0 ? '': 'bg-blue-500'}" style="width: {percentage}%;">percentage</div>
</div>