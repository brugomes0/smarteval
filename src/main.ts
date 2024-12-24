import App from './App.svelte'

const app = new App({
    target: document.body,
    props: {
        authToken: "",
        baseUrl: "http://localhost:5104/v1/",
        lang: "EN"
    }
})

export default app

// export { default as App } from './App.svelte'