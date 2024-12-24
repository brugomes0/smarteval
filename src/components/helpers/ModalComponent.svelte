<script lang="ts">
    import LL from '../../i18n/i18n-svelte'
    import { createEventDispatcher } from 'svelte'

    export let widthModal: number = 400

    let dispatch = createEventDispatcher()
    let confirmChanges = () => { dispatch('save') }
</script>

<div class="fixed top-0 left-0 bg-black bg-opacity-75 flex flex-col justify-center w-screen h-full transition-opacity duration-500 z-40">
    <div class="flex flex-col gap-y-2 mx-auto p-2 rounded bg-gray-100" style="width: {widthModal}px;">
        <slot name="header"></slot>
        <hr>
        <slot name="content"></slot>
        <hr>
        <div class="flex justify-end">
            <button on:click={confirmChanges} class="font-medium px-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.SingleReview.Confirm()}</button>
        </div>
    </div>
</div>