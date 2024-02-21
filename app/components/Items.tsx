"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/utils/supabase";

// Human readable date
const getDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const prices = ["FREE", "FREEMIUM", "PAID"];
const frequencies = ["daily", "weekly", "monthly"];

const Item = ({ item }) => {
  // Assuming this is inside your component
  const [description, setDescription] = useState(item.description);
  const [shortDescription, setShortDescription] = useState("");
  const [pricing, setPricing] = useState(item.pricing);
  const [frequency, setFrequency] = useState(item.frequency);
  const [categories, setCategories] = useState(item.categories);
  const [newCategory, setNewCategory] = useState("");
  const [url, setUrl] = useState(item.url);

  const handleDelete = (categoryToDelete) => {
    setCategories(
      categories.filter((category) => category !== categoryToDelete)
    );
  };

  const handleAdd = () => {
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  useEffect(() => {
    setDescription(item.description);
    setShortDescription("");
    setPricing(item.pricing);
    setFrequency(item.frequency);
    setCategories(item.categories);
    setUrl(item.url);
  }, [item]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onGenerateShortDescription = () => {
    console.log("Generating Short Description");
    // Call the AI function to generate short description
    const shortDescriptionResult = "AI Generated Short Description";
    setShortDescription(shortDescriptionResult);
  };

  const onShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };

  const handlePricingChange = (event) => {
    setPricing(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="max-w-4xl p-4 bg-gray-100 rounded-lg shadow px-8 py-4">
        <Image
          src={item.ogImage}
          alt={item.title}
          className="w-full h-auto rounded"
          width={500}
          height={300}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="text-xs mt-1 italic">
            Submitted at: {getDate(item.created_at)}
          </p>
          <p className="text-xs mt-1 italic">
            {item.firstName} {item.lastName} ({item.email})
          </p>
          <p className="text-sm mt-4">Description: </p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="mt-2 w-full p-4 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-1 shadow-sm bg-gray-50 hover:bg-white focus:outline-none"
          />

          <button
            className="text-xs my-2 px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 min-w-32 font-semibold"
            onClick={onGenerateShortDescription}
          >
            Generate Short Description with AI
          </button>
          <p className="text-sm mt-4">AI Generated Short Description:</p>
          <textarea
            className="mt-2 w-full p-4 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-1 shadow-sm bg-gray-50 hover:bg-white focus:outline-none"
            onChange={onShortDescriptionChange}
            value={shortDescription}
          />

          {/* Display other details */}
          <div className="mt-4 mb-8">
            <p className="text-sm">Price:</p>
            <select
              className="py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded-md"
              value={pricing}
              onChange={handlePricingChange}
            >
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 mb-8">
            <p className="text-sm">Frequency:</p>
            <select
              className="py-1 text-sm font-semibold text-purple-800 bg-purple-200 rounded-md"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {frequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {freq.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm mt-4">Categories (Max 3):</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(category)}
                  className="px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded-full"
                >
                  {category}{" "}
                  <span className="text-xs font-medium ml-2 inline-flex items-center justify-center border border-transparent rounded-full bg-gray-500 text-white h-4 w-4">
                    x
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-row items-center justify-center">
            <input
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="New category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              onClick={handleAdd}
              className="ml-2 min-w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={categories.length >= 3}
            >
              Add
            </button>
          </div>
          <div className="mt-8">
            <iframe
              src={url}
              className="w-full h-96 mt-4"
              title="Newsletter Submission"
            />
            <p className="italic">
              Subscription Website:{" "}
              <Link href={url} className="hover:underline">
                {url}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// On Reject: Set the item in the DB to rejected
// On Approve: Pop up a confirmation modal, fetch the related newsletters from the DB, then upload

const fetchData = async () => {
  const { data, error } = await supabase
    .from("NewsletterSubmissions")
    .select("*")
    .eq("rejected", false)
    .eq("uploaded", false);
  if (error) {
    console.error("Error fetching newsletter submissions", error);
  } else {
    console.log("Newsletter submissions fetched successfully");
    return data;
  }
};

export const Items = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      if (data) {
        setData(data);
      }
    })();
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-center">
          No newsletter submissions to review
        </h2>
        <p className="mt-2 text-center">
          There are no newsletter submissions to review at the moment.
        </p>
      </div>
    );
  }

  const currentItem = data[currentIndex];
  console.log("Current Item", currentItem);

  return (
    <div>
      <Item item={currentItem} />
      <div className="w-full">
        <div className="flex gap-4 mt-8 mx-auto text-center justify-center align-center">
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : data.length - 1
              )
            }
            className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-400 min-w-32 font-semibold"
          >
            Back
          </button>
          <button
            onClick={async () => {
              try {
                const { error } = await supabase
                  .from("NewsletterSubmissions")
                  .update({ rejected: true })
                  .eq("id", currentItem.id);
                if (error) {
                  console.error("Error updating newsletter submission", error);
                } else {
                  console.log("Newsletter submission updated successfully");
                  setData((prevData) =>
                    prevData.filter((item) => item.id !== currentItem.id)
                  );
                }
              } catch (error) {
                console.error("Error updating newsletter submission", error);
              }
            }}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 min-w-32 font-semibold"
          >
            Reject
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
            }
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 min-w-32 font-semibold"
          >
            Approve
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
            }
            className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-400 min-w-32 font-semibold"
          >
            Skip
          </button>
        </div>
      </div>
      <p className="text-sm mt-2 text-center">
        Item: {currentIndex + 1} of {data.length}
      </p>
    </div>
  );
};
