import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SpinnerDotted } from "spinners-react";
import { useAuth } from "../../Context/MyEventContext";
import ShowTemplets from "./ShowTemplets";
import ShowGiftCards from "./ShowGiftCards";

function AddEvent({ handleCancel, setAddPopup }) {
  const { contacts, setContacts, allEvents, setAllEvents, userData ,template, setTemplate} =
    useAuth();
  const [latestEventNR, setLatestEventNR] = useState(0);

  const [isImage, setIsImage] = useState(false);
  // const [contacts, setContacts] = useState([]);

  const [sending, setSending] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [templatePopup, setTemplatePopup] = useState(false);  
  const [giftCardsPopup, setGiftCardsPopup] = useState(false);

  // -------------------latest event number---------------------

  useEffect(() => {
    const latestEvent = allEvents.length;
    allEvents && setLatestEventNR(latestEvent);
  }, [allEvents]);
  useEffect(() => {
    allEvents && console.log(latestEventNR);
  }, [allEvents]);

  const [event, setEvent] = useState({
    actionDate: "",
    title: "",
    text: "",
    image: "",
    eventNR: latestEventNR,
    user: userData._id,
    contact: "",
    time: "",	
  });


  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    console.log("event", event);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/events/create`,
        event
      );

      console.log(response);
      if (response.status === 201) {
        setEvent({
          actionDate: "",
          title: "",
          text: "",
          image: "",
          eventNR: latestEventNR,
          user: userData._id,
          contact: "",
        });
        setTemplate({
          title: "",
          content: "",
          images: "",
        });
        setAllEvents([...allEvents, response.data]);
        setSending(false);
        setAddPopup(false);

        navigate("/myevents");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating event");
      setSending(false);
    }
  };
  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  const handleContactChange = (e) => {
    setEvent({
      ...event,
      contact: e.target.value,
    });
  };
  const handledateChange = (e) => {
    setEvent({
      ...event,
      actionDate: e.target.value,
    });
  };

  // fetch Template Data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/templates`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTemplateData(response.data);
        console.log("Templates:", response && response.data);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelTemplate = () => {
    setTemplatePopup(false);
  };
  const handleCancelGiftCards = () => {
    setGiftCardsPopup(false);
  };


  if (sending) {
    return (
      <div className="">
        <SpinnerDotted
          size={50}
          thickness={100}
          speed={100}
          color="rgba(57, 107, 172, 1)"
        />
      </div>
    );
  }

  return (
    <div
      className="popup fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center 
    "
    >
      <div
        className="container mt-20 mx-auto max-w-md rounded-xl shadow-xl shadow-gray-500  bg-white bg-opacity-80  
      "
      >
        <div
          className=" w-full container
      "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Create an Event</h2>
            <form onSubmit={handleSubmit}>
              {/* choose a contact */}
              <div className="mb-4">
                <p className="block mb-2">Choose a contact:</p>
                <select
                  name="contact"
                  value={event.contact}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Choose a contact</option>
                  {Array.isArray(contacts) &&
                    contacts.map((contact) => (
                      <option
                        key={contact._id}
                        value={contact._id}
                        onChange={handleContactChange}
                      >
                        {contact.firstName}
                      </option>
                    ))}
                </select>
              </div>

              {/* choose date from dates in Contact */}
              <div className="mb-4">
                <p className="block mb-2">Choose a date:</p>
                <select
                  name="actionDate"
                  value={event.actionDate}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Choose a date</option>

                  {event.contact !== "" &&
                    Array.isArray(contacts) &&
                    contacts.map((contact) =>
                      contact.dates.map(
                        (date) =>
                          event.contact === contact._id && (
                            <option
                              key={date._id}
                              value={date.value}
                              onChange={handledateChange}
                            >
                              {date.title}
                            </option>
                          )
                      )
                    )}
                    
                </select>
              </div>
              {/* choose Time */}
              <div className="mb-4">
                <p className="block mb-2">Choose a time:</p>
                <input
                  type="time"
                  name="time"
                  value={event.time}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />

                {/* <select
                  name="time"
                  value={event.time}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                >
                  <option value="">Choose a time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select> */}
              </div>

              {/* action date */}

              <div className="mb-4">
                <p className="block mb-2">Action Date:</p>
                <input
                  type="date"
                  name="actionDate"
                  value={formatDate(event.actionDate)}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>



            <div className="mb-4"
            >
              <a className="bg-blue-500 text-white rounded p-2 mt-4 cursor-pointer hover:bg-blue-700"
              onClick={() => setTemplatePopup(true)}
              >
                choose a template
              </a>
            </div>
            {templatePopup && (
              <ShowTemplets templateData={templateData} setTemplateData={setTemplateData} handleCancelTemplate={handleCancelTemplate}
              setTemplate={setTemplate} setEvent={setEvent} 
              />
            )} 
             {/*choose gift card  */}
              <div className="mb-4">
                <p className="block mb-2">Choose a gift card:</p>
                <a className="bg-blue-500 text-white rounded p-2 mt-4 cursor-pointer hover:bg-blue-700"
                onClick={() => setGiftCardsPopup(true)}
                
                >
                  Choose gift Card 
                </a>
              </div>
              {giftCardsPopup && (
                <ShowGiftCards handleCancelGiftCards= {handleCancelGiftCards}
                />
              )}


              {/* choose Templet */}
              
              <div className="mb-4">
                <p className="block mb-2">Title:</p>
                <input
                  type="text"
                  name="title"
                  value={template.title}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <p className="block mb-2">Text:</p>
                <textarea
                  type="text-area"
                  name="text"
                  value={template.content&&template.content}
                  onChange={handleChange}
                  className="border rounded w-full p-2 col-span-2 h-72"
                />
              </div>
              <div className="mb-4">
                <p className="block mb-2">Image</p>
                {/* <input
                  type="text"
                  name="image"
                  value={template.images&&template.images}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                /> */}
                {template.images && (
                <div className="flex justify-center items-center">
              
                  <img
                    src={template.images}
                    alt="template image"
                    className="w-20 h-20 rounded-full"
                   
                  />
              
                </div>
                )}
              </div>
              <span className="hCenter">
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded p-2 mt-4"
                >
                  ADD EVENT
                </button>
                <button
                  className=" bg-red-500 text-white rounded p-2 mt-4 ml-4
          "
                  onClick={(e) => handleCancel(e)}
                >
                  Cancel
                </button>
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEvent;
