import axios from "axios";
import config from "../../config";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.apiPrefix;

// 
class APICore {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    let response;
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] === "") delete params[key];
      });
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };

  getById = (url) => {
    let response;

    response = axios.get(`${url}`);

    return response;
  };

  getFile = (url, params) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axios.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls, params) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = (url, data) => {
    const request = axios.post(url, data);
    return request;
  };

  /**
   * Updates patch data
   */
  updatePatch = (url, data) => {
    return axios.patch(url, data);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url) => {
    return axios.delete(url);
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url, data) => {
    const formData = new FormData();
    for (const k in data) {
      if (k === "images") {
        for (const image in data[k]) {
          formData.append("images", data[k][image]);
        }
      } else formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  updateWithFile = (url, data) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  uploadFile = (url, data) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };
  /**
   * post given data to url with files
   */
  uploadMultipleFile = (url, formData) => {
    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };
  /**
   * post given data to url with file
   */
  importFile = (url, data) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    const config = {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        Authorization: axios.defaults.headers.common["Authorization"],
      },
    };
    return axios.post(url, formData, config);
  };

  getCurrentProfileStep = () => {
    let currentStep = localStorage.getItem("CurrentProfileStep");
    currentStep = JSON.parse(currentStep);
    if (currentStep) {
      return currentStep;
    } else {
      return "PetUserDetails";
    }
  };
  setCurrentProfileStep = (session) => {
    if (session)
      localStorage.setItem("CurrentProfileStep", JSON.stringify(session));
    else {
      localStorage.removeItem("CurrentProfileStep");
    }
  };
  setCurrentPetProfile = (session) => {
    if (session)
      localStorage.setItem("CurrentPetProfile", JSON.stringify(session));
    else {
      localStorage.removeItem("CurrentPetProfile");
    }
  };

  getCurrentPetProfile = () => {
    let currentProfile = localStorage.getItem("CurrentPetProfile");
    currentProfile = JSON.parse(currentProfile);
    if (currentProfile) {
      return currentProfile;
    } else {
      return {};
    }
  };

  setCartItems = (session) => {
    if (session) localStorage.setItem("cartItems", JSON.stringify(session));
    else {
      localStorage.removeItem("cartItems");
    }
  };

  getCartItems = () => {
    let cartItems = localStorage.getItem("cartItems");

    cartItems = JSON.parse(cartItems);
    if (cartItems) {
      return cartItems;
    } else {
      return [];
    }
  };

  x;
}

export { APICore };
