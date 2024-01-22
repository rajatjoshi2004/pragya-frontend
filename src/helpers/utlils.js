import toast from "react-hot-toast";

const hasError = (errors, key) => {
    if(errors === undefined){
        return null;
    }
    if(typeof(errors) === 'string' ){
        return  null;
    }
    const hasError = errors?.findIndex(err => err.key === key);    
    if (hasError === -1)
        return null;
    else
        return <small className="text-danger pet-basic-info-error">{errors[hasError]?.error}</small>;
}
const showToast = (type, message) => {
    const customStyle = {
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    }
    switch (type) {
        case 'success':
            toast.success(message, customStyle);
            break;
        case 'error':
            toast.error(message, customStyle);
            break;

        default:
            toast(message, customStyle);
            break;
    }
}

export {showToast,hasError};