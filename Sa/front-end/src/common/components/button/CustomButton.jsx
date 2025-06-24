import "./CustomButton.css";

const CustomButton = ({cor, aoClicar, children }) => {
    const estilos = ['custom-button_root'];

    switch (cor) {

        case 'primaria':
            estilos.push('custom-button_primario');
            break;
        case 'secundaria':
            estilos.push('custom-button_secundario');
            break;
        default:
            estilos.push('custom-button_padrao');
            break;
    }
    return (
        <button
        className={estilos.join(' ')}
        onClick={aoClicar}
        >
            {children}
        </button>
    );

};

export default CustomButton;