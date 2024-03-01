import React, { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import axios from "axios";
import "./Styles/settings.css";
import { useAuth } from "../../Context/MyEventContext";

function Settings() {
  const {userData } = useAuth();
  const [data, setData] = useState({
    // firstName: "Issa",
    // lastName: "alali",
    // email: "issa@exp.com",
    // avater: "defaultAvatar.svg",
    // birthDate: "12/12/1990",
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    avater: userData.avatar,
    birthDate: userData.birthDate,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  console.log(userData);
  // -------------------format date--------------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // validate form
  const validateForm = () => {
    const newErrors = {};

    if (!validator.isAlpha(data.firstName)) {
      newErrors.firstName = "Please enter a valid first name";
    }

    if (!validator.isAlpha(data.lastName)) {
      newErrors.lastName = "Please enter a valid last name";
    }

    if (!validator.isEmail(data.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!validator.isDate(data.birthDate)) {
      newErrors.birthDate = "Please enter a valid date";
    }

    if (!validator.isURL(data.avater)) {
      newErrors.avater = "Please enter a valid URL";
    }
    // if (Object.keys(newErrors).length === 0) {
    //   toast.success("Form is valid");
    // } 
   


    setErrors({ ...newErrors });

    return newErrors;
  };
  // -------------------handle button--------------

  const handleButton = (idName, span) => {
    const idInbox = document.getElementById(idName);
    const spanButton = document.getElementById(span);
    const savebtn = document.getElementById("save");
    const cancelbtn = document.getElementById("cancel");
   

    if (isEditMode) {
      idInbox.readOnly = true;
      idInbox.style.backgroundColor = "lightgray";
      spanButton.innerHTML = "Edit";
      setIsEditMode(false);
      // savebtn.style.display = "visible";
      // cancelbtn.style.display = "visible";
    } else {
      idInbox.readOnly = false;
      idInbox.disabled = false;
      idInbox.focus();
      spanButton.innerHTML = "Save";
      idInbox.style.backgroundColor = "white";
      setIsEditMode(true);
    }
  };
  // -------------------avatar change--------------
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
  };
  // -------------------form submit--------------
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if(isEditMode) {
      toast.error("Please save  the changes");
      return;
    }
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) 
    toast.error(
      Object.values(newErrors).map((value) => value).join(" "
      )



);
    else {
    const VITE_API_URL=import.meta.env.VITE_API_URL
   


    try {
   

        axios
          .put(`${VITE_API_URL}/user/${userData._id}`, data)
          .then((res) => {
            console.log(res);

            toast.success("Profile updated successfully");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Profile not updated");
          });
      
    } catch (error) {
      console.log(error);
    }


    console.log("Form submitted:", data);
  }
  
  };


  return (
    <div className="settings">
      <h1>Settings your Profile</h1>
      <div>
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className=" formsitting
       "
        >
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={data.firstName}
              className={`border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 m-2 w-72 bg-gray-100`}
              onChange={(e) => {
                setData({ ...data, firstName: e.target.value }
              
                );
              }}
              readOnly
              disabled
              
            />

            {/* edit button */}
            <span
              id="span-first-name"
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              onClick={() => handleButton("firstName", "span-first-name")}
            >
              Edit
            </span>
          </div>
          <br />
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={data.lastName}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-last-name"
              onClick={() => handleButton("lastName", "span-last-name")}
            >
              Edit
            </span>
          </div>

          <br />
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-email"
              onClick={() => handleButton("email", "span-email")}
            >
              Edit
            </span>
          </div>
          <br />
          <div>
            <label htmlFor="birthDate">birthDate</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formatDate(data.birthDate)}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, birthDate: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-birthDate"
              onClick={() => handleButton("birthDate", "span-birthDate")}
            >
              Edit
            </span>
          </div>
          <br />
          <div>
            <label htmlFor="avater">Avater</label>
            <input
              type="file"
              id="avater"
              name="avater"
           
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => handleAvatarChange(e)}
              
            />
          </div>
          <br />
          <div
            className="flex justify-center gap-4 m-4  
          "
          >
            <button
              id="save"
              type="submit"
              className="bg-blue-500 text-white text-sm rounded-md 
            border-solid border-2 border-blue-500 py-1 px-1 hover:bg-blue-800 transition duration-300 font-oleo font-bold py-1 px-2"
            >
              Save
            </button>
            <button
              id="cancel"
              type="reset"
              className="bg-red-500 text-white text-sm rounded-md 
            border-solid border-2 border-red-500 py-1 px-1 hover:bg-red-800 transition duration-300 font-oleo font-bold py-1 px-2 mr-4"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
