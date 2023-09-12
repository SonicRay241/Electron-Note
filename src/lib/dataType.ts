type Note = {
    id: string
    title: string
    noteData: string
    images: object
}

type Book = {
    id: string
    name: string
    color: string
    notes: Note[]
}

type Library = {
    data: Book[]
    // graphs: Graph[]
}

type Graph = {
    id: string
    name: string
    data: string //json
}

type MainData = {
    path: string | null
    data: Library | null
    os: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'
}

export type { Note, Book, Library, MainData }