
function Error({error=null}) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong'
    return (
        <div className="error">
            <h1>Error: {statusCode}</h1>
            <p>{message}</p>
        </div>
    );
}

export default Error;