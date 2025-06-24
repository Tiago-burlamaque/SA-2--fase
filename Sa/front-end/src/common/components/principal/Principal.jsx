import "./Principal.css";

function Principal ({voltarPara, titulo, children}) {
    return (
        <main className='principal_root'>
            <div className='principal_titulo'>
                {voltarPara && <link to={voltarPara}>Voltar</link>}
                <h1>{titulo}</h1>
            </div>
            {children}
        </main>
    
    );
}

export default Principal;