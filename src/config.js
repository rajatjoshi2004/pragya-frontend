const apiPrefix = `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_VERSION}`;
const config = {
    API_URL: process.env.REACT_APP_API_URL,
    VERSION: process.env.REACT_APP_API_VERSION,
    USER_IMG_URL: `${process.env.REACT_APP_API_URL}/profileImg/`,
    apiPrefix
   
};


export default config;