
export default function capName(name ){
    const firstLetterCapped = name.slice(0, 1).toUpperCase();
    const nameWithoutFirstLetter = name.slice(1, name.length)
    return firstLetterCapped+nameWithoutFirstLetter
}

