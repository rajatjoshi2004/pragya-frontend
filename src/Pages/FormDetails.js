import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Images } from "../helpers/Images";
import { registerUser, userImageUpload } from "../helpers/api/registerUser.api";
import { hasError, showToast } from "../helpers/utlils";
import toast from "react-hot-toast";
import Locality from "../helpers/api/Locality.json";
import BloodGroup from "../helpers/api/BloodGroup.json";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header";
import Footer from "./Footer";
import { Modal } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import moment from "moment";

// import "./DatePickerInput.css";

const FamilyDetails = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const [formData, setFormData] = useState({
    gender: "Male",
    familyDetails: [
      {
        memberName: "",
        occupation: "",
        martialStatus: "",
        relation: "",
        age: "",
        education: "",
        locality: "",
        bloodGroup: "",
      },
    ],
  });
  const [previewImage, setPreviewImage] = useState();
  const [validationErrors, setValidationErrors] = useState([]);

  const handleOnChange = (name, value) => {
    console.log(name, value);
    let errors = validationErrors?.filter((err) => err.key !== name);
    setValidationErrors(errors);
    if (name === "phone") {
      if (value.length <= 10) {
        setFormData((prevstate) => ({
          ...prevstate,
          [name]: value,
        }));
      } else {
        return;
      }
    } else {
      setFormData((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
  };

  const handleOnChangeFamilyDetails = (index, name, value) => {
    let errors = validationErrors?.filter(
      (err) => err.key !== `${name}-${index}`
    );
    const updatedFamilyDetails = [...formData.familyDetails];
    setValidationErrors(errors);
    if (name === "age") {
      if (value <= 120) {
        console.log(value.length);
        updatedFamilyDetails[index] = {
          ...updatedFamilyDetails[index],
          [name]: value,
        };
        setFormData((prevData) => ({
          ...prevData,
          familyDetails: updatedFamilyDetails,
        }));
      }
    } else {
      updatedFamilyDetails[index] = {
        ...updatedFamilyDetails[index],
        [name]: value,
      };
      setFormData((prevData) => ({
        ...prevData,
        familyDetails: updatedFamilyDetails,
      }));
    }
  };

  const handleProfilePicChange = async (event) => {
    let errors = validationErrors?.filter((err) => err.key !== "profileImg");
    setValidationErrors(errors);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));

    try {
      const { data } = await userImageUpload({ file: event.target.files[0] });
      setFormData((prevData) => ({
        ...prevData,
        profileImg: data?.data?.filename,
      }));
    } catch (err) {
      if (err) {
        toast.dismiss();
        showToast("error", "Network Error");
      }
    }
  };

  const checkValidations = (data) => {
    let errors = [];
    if (data.gotra === undefined || data.gotra === "") {
      const error = {
        error: "Please provide your gotra ",
        key: "gotra",
      };
      errors.push(error);
    }
    if (data.nativePlace === undefined || data.nativePlace === "") {
      const error = {
        error: "Please provide your native place ",
        key: "nativePlace",
      };
      errors.push(error);
    }

    if (!data.agreeTerms) {
      const error = {
        error: "Please tick on above checkbox",
        key: "agreeTerms",
      };
      errors.push(error);
    }
    if (data.profileImg === undefined || data.profileImg === "") {
      const error = {
        error: "Please provide your image ",
        key: "profileImg",
      };
      errors.push(error);
    }

    if (data.name === undefined || data.name === "") {
      const error = {
        error: "Please provide  your name ",
        key: "name",
      };
      errors.push(error);
    }

    const RegexEmailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!RegexEmailValidation.test(data.email)) {
      const error = {
        error: "Please provide your valid email ",
        key: "email",
      };
      errors.push(error);
    }

    if (data.dob === undefined || data.dob === null) {
      const error = {
        error: "Please provide your dob",
        key: "dob",
      };
      errors.push(error);
    }

    if (data.address === undefined || data.address === "") {
      const error = {
        error: "Please provide your address",
        key: "address",
      };
      errors.push(error);
    }
    if (data.occupation === undefined || data.occupation === "") {
      const error = {
        error: "Please provide your occupation",
        key: "occupation",
      };
      errors.push(error);
    }

    if (data.locality === "" || data.locality === undefined) {
      const error = {
        error: "Please select locality",
        key: "locality",
      };
      errors.push(error);
    }

    if (data.gender === "") {
      const error = {
        error: "Please provide gender",
        key: "gender",
      };
      errors.push(error);
    }
    if (data.locality === "Other") {
      if (data.otherLocality === undefined || data.otherLocality === "") {
        const error = {
          error: "Please select your specify locality ",
          key: "otherLocality",
        };
        errors.push(error);
      }
    }

    if (data.phone === undefined || data.phone === "") {
      const error = {
        error: "Please enter your phone number ",
        key: "phone",
      };
      errors.push(error);
    }

    const validatePhone = /^[6-9]{1}[0-9]{9}$/;
    if (!validatePhone.test(data.phone)) {
      const error = {
        error: "Please provide your valid phone number ",
        key: "phone",
      };
      errors.push(error);
    }
    formData?.familyDetails?.map((data, i) => {
      if (data.memberName === "") {
        const error = {
          error: "Please provide name ",
          key: `memberName-${i}`,
        };
        errors.push(error);
      }
      if (data.occupation === "") {
        const error = {
          error: "Please provide occupation",
          key: `occupation-${i}`,
        };
        errors.push(error);
      }

      if (data.education === "default" || data.education === "") {
        const error = {
          error: "Please select education",
          key: `education-${i}`,
        };
        errors.push(error);
      }
      if (data.relation === "" || data.relation === "default") {
        const error = {
          error: "Please provide relation",
          key: `relation-${i}`,
        };
        errors.push(error);
      }
      if (data.martialStatus === "default" || data.martialStatus === "") {
        const error = {
          error: "Please select martial status",
          key: `martialStatus-${i}`,
        };
        errors.push(error);
      }
      if (data.age === "") {
        const error = {
          error: "Please provide age",
          key: `age-${i}`,
        };
        errors.push(error);
      }
    });
    if (errors?.length > 0) {
      toast.dismiss();
      showToast("error", "Please provide all details");
      setValidationErrors(errors);
    }
    return errors;
  };

  const handleSubmit = async () => {
    toast.dismiss();

    const hasError = checkValidations(formData);
    if (hasError.length > 0) {
      return false;
    }
    const params = { ...formData };
    params.dob = moment(params.dob).format("DD-MM-YYYY");
    try {
      const data = await registerUser(params);
      setData(data.data);
      if (data?.data?.status === 403) {
        showToast("error", data.data.message);
      } else {
        setShow(true);
      }
    } catch (err) {
      showToast("error", err);
    }
  };

  const handleDelete = () => {
    const familyDetailsCopy = [...formData.familyDetails];
    familyDetailsCopy.splice(formData.familyDetails.length - 1, 1);
    console.log(familyDetailsCopy);
    setFormData((prev) => ({
      ...prev,
      familyDetails: familyDetailsCopy,
    }));
    
  };

  // const resetForm = () => {
  //   setPreviewImage(undefined);
  //   setValidationErrors([]);
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1000);
  // };

  const handleAdd = () => {
    const newFamilyMember = {
      memberName: "",
      occupation: "",
      martialStatus: "",
      relation: "",
      age: "",
      education: "",
    };
    const updatedFamilyDetails = [...formData.familyDetails, newFamilyMember];
    setFormData((prevData) => ({
      ...prevData,
      familyDetails: updatedFamilyDetails,
    }));
  };
  console.log(formData.familyDetails.length);

  const otherLocality = () => {
    if (formData?.locality === "Other") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="edit-profile-section-wrapper">
        <Container>
          <Header />
          <div className="edit-profile-section">
            <div className="personal-info-heading">
              <div className="personal-info-text">Personal Information</div>
            </div>
            <div className="edit-profile-section-inner">
              <div className="edit-profile-photo">
                <div className="avatar-upload">
                  <div className="avatar-edit">
                    <input
                      type="file"
                      id="imageUpload"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleProfilePicChange}
                    />
                    <label htmlFor="imageUpload">
                      <img
                        src={Images.addImage}
                        height={20}
                        width={20}
                        alt="profileImg"
                      />
                    </label>
                  </div>
                  <div className="avatar-preview">
                    <div className="avatar-img">
                      <div className="avatar-img">
                        {previewImage === undefined && (
                          <img src={Images.userImage} alt="previewImage" />
                        )}
                        {previewImage !== "" ? (
                          <img src={previewImage} alt={formData?.name} />
                        ) : (
                          <>
                            {formData?.profileImg !== "" && (
                              <img
                                loading="lazy"
                                src={`${formData?.profileImg}`}
                                alt={formData?.name}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="image-error">
                  {hasError(validationErrors, "profileImg")}
                </div>
              </div>

              <div className="edit-profile-details">
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Name of Family Head:</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={(e) => handleOnChange("name", e.target.value)}
                      />
                      {hasError(validationErrors, "name")}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} className="errorclass">
                    <Form.Label htmlFor="gender">Gender:</Form.Label>

                    <div className="radio-btn">
                      <Form.Check
                        defaultChecked
                        type="radio"
                        label="Male"
                        id="male"
                        name="gender"
                        value={"Male"}
                        onChange={(e) => {
                          handleOnChange("gender", e.target.value);
                        }}
                      />
                      <Form.Check
                        type="radio"
                        label="Female"
                        id="female"
                        name="gender"
                        value={"Female"}
                        onChange={(e) => {
                          handleOnChange("gender", e.target.value);
                        }}
                      />
                    </div>
                    {hasError(validationErrors, "gender")}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Date Of Birth:</Form.Label>

                      <div className="errorclass">
                        <ReactDatePicker
                          className=" form-control"
                          maxDate={new Date()}
                          renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div
                              style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                              >
                                {"<"}
                              </button>
                              <select
                                value={date.getFullYear()}
                                onChange={({ target: { value } }) =>
                                  changeYear(value)
                                }
                              >
                                {years.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={months[date.getMonth()]}
                                onChange={({ target: { value } }) =>
                                  changeMonth(months.indexOf(value))
                                }
                              >
                                {months.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                              >
                                {">"}
                              </button>
                            </div>
                          )}
                          dateFormat={"dd/MM/yyyy"}
                          placeholderText="DD/MM/YYYY"
                          selected={formData.dob}
                          onChange={(date) => {
                            handleOnChange("dob", date);
                          }}
                        />
                        {hasError(validationErrors, "dob")}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Mobile No:</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData?.phone || ""}
                        placeholder="Enter your Mobile Number"
                        onChange={(e) =>
                          handleOnChange("phone", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "phone")}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) =>
                          handleOnChange("email", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "email")}
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Locality:</Form.Label>

                      <Select
                        // menuPlacement="top"
                        options={Locality}
                        onChange={(values) => {
                          handleOnChange("locality", values.value);
                        }}
                      />
                      {hasError(validationErrors, "locality")}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12}>
                    <div className="other-locality">
                      {otherLocality() && (
                        <Form.Control
                          className="other-locality-input"
                          type="text"
                          name="otherLocality"
                          placeholder="Enter your specify locality"
                          value={formData?.otherLocality || ""}
                          onChange={(e) =>
                            handleOnChange("otherLocality", e.target.value)
                          }
                        />
                      )}
                      {hasError(validationErrors, "otherLocality")}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Occupation:</Form.Label>
                      <Form.Control
                        type="text"
                        name="occupation"
                        placeholder="Occupation"
                        onChange={(e) =>
                          handleOnChange("occupation", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "occupation")}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="gotra-input">
                      <Form.Label>Gotra:</Form.Label>
                      <Form.Control
                        type="text"
                        name="gotra"
                        placeholder="Gotra"
                        onChange={(e) =>
                          handleOnChange("gotra", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "gotra")}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="errorclass">
                      <Form.Label>Native Place:</Form.Label>
                      <Form.Control
                        type="text"
                        name="nativePlace"
                        placeholder="Enter your native place..."
                        onChange={(e) =>
                          handleOnChange("nativePlace", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "nativePlace")}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Blood Group (Optional):</Form.Label>
                      <Select
                        type="text"
                        name="bloodGroup"
                        options={BloodGroup}
                        onChange={(values) =>
                          handleOnChange("bloodGroup", values.value)
                        }
                      />
                      {hasError(validationErrors, "bloodGroup")}
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group>
                      <Form.Label>Full Address:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        type="text"
                        name="address"
                        placeholder="Enter your full address..."
                        onChange={(e) =>
                          handleOnChange("address", e.target.value)
                        }
                      />
                      {hasError(validationErrors, "address")}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="family-heading">
              <div>Family Member Details</div>
            </div>

            {[...formData.familyDetails]?.map((value, index) => {
              return (
                <div
                  key={`familyDetails-${index}`}
                  className="family-section-inner"
                >
                  <div className="inner-div">
                    <Row>
                      <Col xs={12} md={2}>
                        <Form.Group className="family-input">
                          <Form.Label>Name*:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            name="memberName"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "memberName",
                                e.target.value
                              )
                            }
                          />
                          {hasError(validationErrors, `memberName-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={2}>
                        <Form.Group className="family-input">
                          <Form.Label>Martial status*:</Form.Label>
                          <Form.Select
                            className="martial-form-select"
                            type="text"
                            name="martialStatus"
                            placeholder="Martial status"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "martialStatus",
                                e.target.value
                              )
                            }
                          >
                            <option value="default">Martial status</option>
                            <option value="married">Married</option>
                            <option value="unmarried">Unmarried</option>
                          </Form.Select>
                          {hasError(validationErrors, `martialStatus-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={1}>
                        <Form.Group className="family-input">
                          <Form.Label>Relation*:</Form.Label>
                          <Form.Select
                            className="martial-form-select"
                            type="text"
                            name="relation"
                            placeholder="Relation"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "relation",
                                e.target.value
                              )
                            }
                          >
                            <option value="default">Select Relation</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Wife">Wife</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Daughter in law">
                              Daughter in law
                            </option>
                            <option value="Grand Child">Grand Child</option>
                            <option value="Grand Parent">Grand Parent</option>
                          </Form.Select>
                          {hasError(validationErrors, `relation-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={1}>
                        <Form.Group className="family-input">
                          <Form.Label> Age*:</Form.Label>
                          <Form.Control
                            type="text"
                            name="age"
                            value={formData.familyDetails[index].age || ""}
                            placeholder="Age"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "age",
                                e.target.value
                              )
                            }
                          />
                          {hasError(validationErrors, `age-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={2}>
                        <Form.Group className="family-input">
                          <Form.Label>Blood Group:</Form.Label>
                          <Select
                            type="text"
                            name="bloodGroup"
                            options={BloodGroup}
                            onChange={(values) =>
                              handleOnChangeFamilyDetails(
                                index,
                                `bloodGroup`,
                                values.value
                              )
                            }
                          />
                          {hasError(validationErrors, `bloodGroup-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={2}>
                        <Form.Group className="family-input">
                          <Form.Label> Qualification*:</Form.Label>
                          <Form.Select
                            className="martial-form-select"
                            type="text"
                            name="education"
                            placeholder="Education"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "education",
                                e.target.value
                              )
                            }
                          >
                            <option value="default">
                              Select Qualification
                            </option>
                            <option value=" Below 10th">Below 10th</option>
                            <option value="Matriculation">
                              Matriculation(10th)
                            </option>
                            <option value="HigherSecondary">
                              Higher Secondary(10+2)
                            </option>
                            <option value="Diploma">Diploma</option>
                            <option value="Graduation">Graduation</option>
                            <option value="PostGraduation">
                              Post Graduation
                            </option>
                            <option value="Ph.D">Ph.D</option>
                          </Form.Select>

                          {hasError(validationErrors, `education-${index}`)}
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={2}>
                        <Form.Group className="family-input">
                          <Form.Label>Occupation*:</Form.Label>
                          <Form.Control
                            type="text"
                            name="occupation"
                            placeholder="Occupation"
                            onChange={(e) =>
                              handleOnChangeFamilyDetails(
                                index,
                                "occupation",
                                e.target.value
                              )
                            }
                          />
                          {hasError(validationErrors, `occupation-${index}`)}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="addmore-btn-container">
                <button
                  onClick={handleAdd}
                  type="submit"
                  className="addmore-button"
                >
                  Add more
                </button>
              </div>
              {formData.familyDetails.length > 1 && (
                <div className="delete-btn-container">
                  <button
                    onClick={() => handleDelete()}
                    type="submit"
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div
              style={{ display: "flex", gap: "10px" }}
              className="checkboxAgree"
            >
              <input
                id="myCheckbox"
                onChange={(e) => {
                  handleOnChange("agreeTerms", e.target.checked);
                }}
                type="checkbox"
              />
              <label htmlFor="myCheckbox">
                मैं शपथ पूर्वक घोषणा करता हुं की में एवं मेरा परिवार आराध्य
                प्राज्ञवर प्रवर्तक श्री पन्ना लाल जी म.सा.,आचार्य प्रवर श्री
                सोहन लाल जी म.सा., श्रद्धेय गुरुदेव संघनायक श्री प्रियदर्शन मुनि
                जी म.सा. ठाणा एवं साध्वीप्रमुखा गुरुणी सा श्री कमलप्रभा जी म.सा.
                आदि ठाणा में आस्था रखता हुं एवं संघ के प्रति निष्ठावान रहुंगा।
              </label>
            </div>

            <div style={{ textAlign: "center" }} className="termsError">
              {hasError(validationErrors, "agreeTerms")}
            </div>

            <div className="submit-btn-wrapper">
              <button
                onClick={handleSubmit}
                type="submit"
                className="submit-button "
              >
                Submit
              </button>
            </div>

            <Footer />
          </div>
        </Container>
      </div>

      {show && (
        <Modal
          size="lg"
          centered
          show={true}
          onHide={handleClose}
          backdrop="static"
          data-keyboard="false"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <div className="tokenText" style={{ fontSize: "x-large" }}>
              <b>Your Token Number :</b>
              <b>{data.token}</b>
            </div>
            <hr /> <p> Your form has been submitted successfully. </p>
            <b>
              Please present this token at the counter to receive your photo
              booth token.
            </b>
            <hr />
            <b>
              Note*:- New member registration in Shri Prgaya Sangh Jaipur will
              be subject to approval from the committee.
            </b>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default FamilyDetails;
