const Data = (props: { data: any }) => {
    return (
        <pre>
            <code>{JSON.stringify(props.data, null, 2)}</code>
        </pre>
    )
}
export default Data
