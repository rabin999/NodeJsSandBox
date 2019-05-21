export const pluck = (array: string[], key: string): string[] => {
    let values: string[] = []
    if (array.length) {
        array.forEach((value: any) => {
            if ( value[`${key}`] && values.indexOf(value[`${key}`]) == -1 ) {
                values.push(value[`${key}`])
            }
        })
    }

    return values
}