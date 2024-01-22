/* eslint-disable no-lone-blocks */
import { useState, useEffect, useContext } from "react";
import {
  Accordion,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import moment from "moment";
import {
  downloadExcel,
  getUserData,
  listUsers,
  searchFilter,
  totalUsers,
} from "../helpers/api/registerUser.api";
import { hasError, showToast } from "../helpers/utlils";
import toast from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import config from "../config";
import Locality from "../helpers/api/adminLocality.json";
import Select from "react-select";
import PageLoader from "../helpers/pageLoader";
import { useNavigate } from "react-router-dom";
import { Images } from "../helpers/Images";
import debounce from "debounce";

const AdminList = () => {
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState();
  const [userData, setUserData] = useState();
  const [allUsers, setAllUsers] = useState();
  const [formData, setFormData] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const filterLocality = (data) => {
    setFormData(data);
    if (data === "All") {
      setFilterData(allUsers);
      return;
    }
    const localityUsers = allUsers?.filter((value) => {
      return value.locality === data;
    });
    setFilterData(localityUsers);
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await listUsers();
      setFilterData(data.users);
      setAllUsers(data.users);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showToast("error", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const checkValidations = (data) => {
    let errors = [];
    if (data.phone === undefined || data.phone === "") {
      const error = {
        error: "Please enter phone number ",
        key: "phone",
      };
      errors.push(error);
    }

    const validatePhone = /^[6-9]{1}[0-9]{9}$/;
    if (!validatePhone.test(data.phone)) {
      const error = {
        error: "Please provide valid phone number ",
        key: "phone",
      };
      errors.push(error);
    }

    if (errors?.length > 0) {
      toast.dismiss();
      showToast("error", errors[0].error);
      setValidationErrors(errors);
    }
    return errors;
  };

  // const handleSubmit = async () => {
  //   toast.dismiss();

  //   const hasError = checkValidations(formData);
  //   if (hasError.length > 0) {
  //     return false;
  //   }
  //   try {
  //     const { data } = await getUserData(formData);
  //     if (data.data.length > 0) {
  //       data.data.map((user) => setUser(user));

  //       setFormData({ phone: "" });

  //     }
  //     if (data?.status === 403) {
  //       showToast("error", data.message);
  //     }
  //   } catch (err) {
  //     showToast("error", err.message);
  //   }
  // };


  const otherLocality = () => {
    filterData.filter((data) => {
      console.log(data);
    });
  };

  const handleLogout = () => {
    navigate("/Admin");
    showToast("success","Sucessfully logout")
    localStorage.clear();
    sessionStorage.clear();
  };
  //   if (filterData.locality === "Other") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    showFilters&&setFilterData(allUsers) 

  };

  const debouncedSearch = debounce(async (value) => {
    try {
      setLoading(true);
      const { data } = await searchFilter({
        search: value,
      });
      setFilterData(data.data);
      setLoading(false);
    } catch (err) {
      showToast("error", err.message);
      setLoading(false);
    }
  }, 600);

  const handleSearchInput = (value) => {
    debouncedSearch(value);
  };

  const handleViewButton = (index, value) => {
    
    setShowModal(true);
    setUserData(value);
  };


  const handleExport=async()=>{
    try{
      setLoading(true)
      const {data}= await downloadExcel();
      if(data?.status){
        showToast("success",data?.message);
      setLoading(false)

      }

    }
    catch(err){
      toast.dismiss();
      setLoading(false)
      showToast("error",err.message)
    }

  }
  return (
    <>
      <div className="edit-profile-section-wrapper">
        <Container>
          <Header />
          <PageLoader loading={loading} />
          {true && (
            <div className="edit-profile-section">
              <div className="personal-info-heading member_info_heading">
                <div>
                  <div className="member_info_right">
                    <div className="btn-filter">
                      <div className="member-btn" onClick={handleLogout}>
                        <img src={Images.Logout} alt="img-fluid" />
                        <span>Logout</span>
                      </div>
                      <div className="member-btn" onClick={handleExport}>
                      <span><img src={Images.ExportIcon} height={20} width={20} alt="export-icon"/></span>Export List
                      </div>
                      <div className="dash_area_filter_icon">
                        {!showFilters ? (
                          <img
                            onClick={handleFilterClick}
                            src={Images.FilterBlack}
                            height={25}
                            width={25}
                            alt="filterImage"
                          />
                        ) : (
                          <img
                            onClick={handleFilterClick}
                            src={Images.FilterWhite}
                            height={30}
                            width={30}
                            alt="filterWhiteImage"
                          />
                        )}
                      </div>
                    </div>
                    {showFilters && (
                      <div className="search-filters">
                        <div className="dash_area_filter">
                          <Select
                            options={Locality}
                            onChange={(item) => {
                              filterLocality(item.value);
                            }}
                          ></Select>
                        </div>
                        <div class="input-group dashboard_search mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                              <img
                                src={Images.SearchIcon}
                                alt="search-icon"
                                height={20}
                                width={20}
                              />
                            </span>
                          </div>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Search..."
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => handleSearchInput(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="personal-info-text">Members List</div>
                </div>
              </div>
              {!(filterData?.length > 0) ? (
                <div className="resultCount">No results Found </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{
                    position: "relative", 
                    width: "100%",
                    minHeight: 150,
                  }}
                >
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Family head</th>
                        <th>Gender</th>
                        <th>Locality</th>
                        {/* <th>Date of Birth</th> */}
                        <th>Mobile Number</th>
                        <th>Email</th>
                       
                        {/* <th>Occupation</th>
                    <th>Gotra</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filterData?.map((user, index) => {
                        return (
                          <tr>
                            <td>{user.name}</td>
                            <td>{user.gender}</td>
                            <td>{user.locality}</td>
                            {/* <td>{ moment(user.dob)
                                    .add(1, "day")
                                    .utc()
                                    .format("DD-MM-YYYY")}</td> */}
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>
                              <div
                                className="member-view-btn"
                                onClick={() => handleViewButton(index, user)}
                              >
                                <img
                                  src={Images.View}
                                  alt="img-fluid"
                                  height={20}
                                  width={20}
                                />
                                <span>View</span>
                              </div>
                            </td>
                            
                            {/* <td>{user.occupation}</td>
                    <td>{user.gotra}</td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}

              <Modal
                size="lg"
                className="login-modal"
                centered
                show={showModal}
                // onHide={loginModalClose}
              >
                <Modal.Header>
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    class="btn-close discountModel"
                    aria-label="Close"
                  ></button>
                </Modal.Header>
                <Modal.Body>
                  <div className="edit-profile-section-inner-admin">
                    <div className="edit-profile-photo">
                      <div className="avatar-upload">
                        <div className="avatar-edit"></div>
                        <div className="avatar-preview">
                          <div className="avatar-img">
                            <div className="avatar-img">
                              <img
                                src={`${config.USER_IMG_URL}${userData?.profileImg}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit-profile-details">
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Family Head:</strong>
                            </Form.Label>
                            <span>{userData?.name}</span>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6} className="errorclass">
                          <Form.Label htmlFor="gender">
                            <strong>Gender:</strong>
                          </Form.Label>
                          <span>{userData?.gender}</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={6} className="errorclass">
                          <Form.Group>
                            <Form.Label>
                              <strong>Date Of Birth:</strong>
                            </Form.Label>
                            <span>
                              {!(
                                moment(userData?.dob)
                                  .utc()
                                  .format("DD-MM-YYYY") === "Invalid date"
                              )
                                ? moment(userData?.dob)
                                    .add(1, "day")
                                    .utc()
                                    .format("DD-MM-YYYY")
                                : userData?.dob}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Mobile No:</strong>
                            </Form.Label>
                            <span>{userData?.phone}</span>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Email:</strong>
                            </Form.Label>
                            <span>{userData?.email}</span>
                          </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Locality:</strong>
                            </Form.Label>
                            {userData?.locality}
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <div className="other-locality">
                            {userData?.locality  === "Other" && (
                              <Form.Group className="errorclass">
                                <Form.Label>
                                  <strong>Specify Locality:</strong>
                                </Form.Label>
                                {userData?.otherLocality}
                              </Form.Group>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Occupation:</strong>
                            </Form.Label>
                            <span>{userData?.occupation}</span>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="gotra-input-admin">
                            <Form.Label>
                              <strong>Gotra:</strong>
                            </Form.Label>
                            <span>{userData?.gotra}</span>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="errorclass">
                            <Form.Label>
                              <strong>Native Place:</strong>
                            </Form.Label>
                            {userData?.nativePlace}
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group>
                            <Form.Label>
                              <strong>Blood Group:</strong>
                            </Form.Label>
                            {userData?.bloodGroup}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={12}>
                          <Form.Group>
                            <Form.Label>
                              <strong>Full Address:</strong>
                            </Form.Label>
                            {userData?.address}
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {userData?.familyDetails?.length > 0 && (
                    <div
                      className="table-responsive -admin"
                      style={{
                        position: "relative",
                        width: "100%",
                        minHeight: 150,
                      }}
                    >
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Martial Status</th>
                            <th>Relation</th>
                            <th>Age</th>
                            <th>Blood Group</th>
                            <th>Qualification</th>
                            <th>Occupation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData?.familyDetails?.map((value, index) => {
                            return (
                              <tr key={value - index}>
                                <td>{value.memberName}</td>
                                <td>{value.martialStatus}</td>
                                <td>{value.relation}</td>
                                <td>{value.age}</td>
                                <td>{value.bloodGroup}</td>
                                <td>{value.education}</td>
                                <td>{value.occupation}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Modal.Body>
              </Modal>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default AdminList;
