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
    recent: string[]
    favorites: string[]
}

type MainData = {
    path: string | null
    data: Library | null
}

export type { Note, Book, Library, MainData }