import toast from "svelte-french-toast"

const style = 'background: #0b1117; color: #fff;border:1px solid #ac65ff'

const success = (input: string) => {
    toast.success(input, {
        style,
        position: "top-center"
    })
}
const failed = (input: string) => {
    toast.error(input, {
        style,
        position: "top-center"
    })
}

export { success, failed, toast }