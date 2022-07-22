const { REACT_APP_API_SERVER } = process.env;

export async function getAPIResult(resPromise: Promise<Response>) {
    let res: Response
    try {
        res = await resPromise
    } catch (error) {
        console.error('Network Failure:', error)
        throw new Error((error as Error).toString())
    }
    if (!res.ok) {
        let message = await res.text()
        console.error('API response error:', message)
        throw new Error(message)
    }
    let json = await res.json()
    if (!json.success) {
        console.error('API response fail:', json.message)
        throw new Error(JSON.stringify(json.message))
    }
    return json
}

// export async function get(path: string) {
//     let res = await getAPIResult(fetch(
//         `${REACT_APP_API_SERVER}+ path`,

//     ));

//     let json = await res.json()
//     if (json.error) {
//         console.error('Failed GET', path, 'error:', json.error)
//         throw new Error(json.error)
//     }
//     return json
// }


