import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
const SearchPage = () => {
  const navigate = useNavigate();
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(listings);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setsidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(
          `https://nestquest-server-1.onrender.com/api/listing/get?${searchQuery}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setsidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setsidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setsidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setsidebarData({ ...sidebarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(
        `https://nestquest-server-1.onrender.com/api/listing/get?${searchQuery}`,{credentials: 'include'}
      );
      const data = await res.json();
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold" htmlFor="">
              Search Term :
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
              placeholder="Search"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="" className="font-semibold">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={sidebarData.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="" className="font-semibold">
              Amenities:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={sidebarData.parking}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sidebarData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              Sort
            </label>
            <select
              name=""
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border border-lime-800   rounded-lg w-fit p-2 focus:outline-none "
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price low to Low</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-lime-800 text-white p-3 rounded-lg uppercase hover:opacity-95">
            {" "}
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold border-b p-3 text-lime-700 mt-5">
          Listing Results :
        </h1>
        {loading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="success" />
          </Box>
        )}
        <div className="p-4 flex flex-wrap gap-6">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-red-700 font-semibold">
              No Listing Found
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing}></ListingItem>
            ))}
          {showMore && (
            <button
              onClick={() => {
                onShowMoreClick();
              }}
              className="text-lime-800 hover:underline text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
