import toast from "svelte-french-toast"

const style = 'background: #0b1117; color: #fff;border:1px solid #ac65ff'

const success = (input: string) => {
    toast.success(input, {
        style,
        position: "bottom-right"
    })
}
const failed = (input: string) => {
    toast.error(input, {
        style,
        position: "bottom-right"
    })
}

export { success, failed, toast }