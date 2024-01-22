import React from 'react';

const PageLoader = ({ loading }) => {

    if (!loading) {
        return (
            <>
            </>
        )

    }
    return (
        <>

            <div className="page-loader-component">
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

        </>
    );
}
export default PageLoader;