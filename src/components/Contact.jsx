import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col items-center gap-4 ">
          <p className="text-xl font-semibold text-lime-800 ">
            Contact <span className="uppercase">{landlord.username}</span> for
            <span> {listing.name}</span>
          </p>
          <textarea
            className="rounded-lg bg-lime-200 w-full p-2 text-lime-800 font-semibold"
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            id="message"
            rows="2"
            value={message}
          ></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}body=${message}`}
          className="bg-lime-800 rounded-lg text-white px-4 py-2 font-semibold ">
          Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
